import axios, { type AxiosProgressEvent } from 'axios';
import type {
  UploadProgress
} from '../types';
import type { UploadRequest, UploadResult, UploadCompletionRequest, PartInfo } from '../generated';
import { generatedApiService } from './generatedApiService';

export class UploadService {
  private activeUploads = new Map<string, AbortController>();

  async initiateUpload(request: UploadRequest): Promise<UploadResult> {
    const response = await generatedApiService.videoUpload.initiateUpload(request);
    return response.data;
  }

  async uploadChunk(
    url: string,
    chunk: Blob,
    onProgress: (progress: AxiosProgressEvent) => void,
    uploadId: string
  ): Promise<string> {
    const controller = new AbortController();
    this.activeUploads.set(uploadId, controller);

    try {
      const response = await axios.put(url, chunk, {
        onUploadProgress: onProgress,
        signal: controller.signal,
        maxRedirects: 0,
        timeout: 300000 // 5 minute timeout
      });

      const etag = response.headers['etag'] || response.headers['ETag'];
      if (!etag) {
        throw new Error('No ETag received from S3');
      }

      return etag.replace(/"/g, '');
    } finally {
      this.activeUploads.delete(uploadId);
    }
  }

  async completeUpload(
    uploadId: string,
    completedParts: PartInfo[]
  ): Promise<void> {
    // Convert to generated API request format
    const request: UploadCompletionRequest = {
      parts: completedParts.map(part => ({
        partNumber: part.partNumber,
        etag: part.etag
      }))
    };

    await generatedApiService.videoUpload.completeMultipartUpload(uploadId, request);
  }

  async abortUpload(uploadId: string): Promise<void> {
    const controller = this.activeUploads.get(uploadId);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(uploadId);
    }

    await generatedApiService.videoUpload.abortUpload(uploadId);
  }

  cancelUpload(uploadId: string): void {
    const controller = this.activeUploads.get(uploadId);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(uploadId);
    }
  }

  async uploadFile(
    file: File,
    metadata: { title?: string; description?: string; tags?: string[] },
    onProgress: (progress: UploadProgress) => void
  ): Promise<void> {
    const startTime = new Date();
    let uploadedBytes = 0;
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const updateProgress = (status: UploadProgress['status'], percentage = 0, error?: string, currentUploadedBytes?: number) => {
      if (currentUploadedBytes !== undefined) {
        uploadedBytes = currentUploadedBytes;
      }
      const now = new Date();
      const elapsedTime = now.getTime() - startTime.getTime();
      const uploadSpeed = uploadedBytes / (elapsedTime / 1000); // bytes per second
      const remainingBytes = file.size - uploadedBytes;
      const estimatedTimeRemaining = uploadSpeed > 0 ? remainingBytes / uploadSpeed : undefined;

      onProgress({
        uploadId,
        fileName: file.name,
        fileSize: file.size,
        uploadedBytes,
        totalBytes: file.size,
        percentage,
        status,
        error,
        startTime,
        estimatedTimeRemaining,
        uploadSpeed
      });
    };

    try {
      updateProgress('preparing');

      // Determine content type - fallback to extension-based detection if file.type is empty
      let contentType = file.type;
      if (!contentType || contentType === '') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        const mimeTypes: { [key: string]: string } = {
          'mp4': 'video/mp4',
          'webm': 'video/webm',
          'ogg': 'video/ogg',
          'mov': 'video/quicktime',
          'avi': 'video/x-msvideo',
          'mkv': 'video/x-matroska',
          'flv': 'video/x-flv',
          'wmv': 'video/x-ms-wmv'
        };
        contentType = extension ? (mimeTypes[extension] || 'video/mp4') : 'video/mp4';
      }

      const initiateRequest: UploadRequest = {
        fileName: file.name,
        fileSize: file.size,
        contentType: contentType,
        metadata: {},
        title: metadata.title || '',
        description: metadata.description || '',
        tags: metadata.tags || []
      };

      console.log('Upload request:', initiateRequest);
      const uploadResponse = await this.initiateUpload(initiateRequest);
      updateProgress('uploading');

      if (uploadResponse.uploadType === 'single') {
        await this.handleSingleUpload(file, uploadResponse, updateProgress, uploadId);
      } else {
        await this.handleMultipartUpload(file, uploadResponse, updateProgress, uploadId);
      }

      updateProgress('completed', 100);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      updateProgress('error', 0, errorMessage);
      throw error;
    }
  }

  private async handleSingleUpload(
    file: File,
    uploadResponse: UploadResult,
    updateProgress: (status: UploadProgress['status'], percentage?: number, error?: string, uploadedBytes?: number) => void,
    uploadId: string
  ): Promise<void> {
    const presignedUrl = uploadResponse.presignedUrls[0];

    await this.uploadChunk(
      presignedUrl.url,
      file,
      (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded / file.size) * 100);
        updateProgress('uploading', percentage, undefined, progressEvent.loaded);
      },
      uploadId
    );

    // Complete the upload to mark it as COMPLETED in the backend
    updateProgress('completing');
    await this.completeUpload(uploadResponse.uploadId, []);
  }

  private async handleMultipartUpload(
    file: File,
    uploadResponse: UploadResult,
    updateProgress: (status: UploadProgress['status'], percentage?: number, error?: string, uploadedBytes?: number) => void,
    uploadId: string
  ): Promise<void> {
    const chunkSize = uploadResponse.chunkSize || 104857600; // 100MB default
    const completedParts: PartInfo[] = [];
    let uploadedBytes = 0;

    for (let i = 0; i < uploadResponse.presignedUrls.length; i++) {
      const presignedUrl = uploadResponse.presignedUrls[i];
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const etag = await this.uploadChunk(
        presignedUrl.url,
        chunk,
        (progressEvent) => {
          const chunkProgress = progressEvent.loaded;
          const totalProgress = uploadedBytes + chunkProgress;
          const percentage = Math.round((totalProgress / file.size) * 100);
          updateProgress('uploading', percentage, undefined, totalProgress);
        },
        uploadId
      );

      uploadedBytes += chunk.size;
      completedParts.push({
        partNumber: presignedUrl.partNumber,
        etag
      });

      const percentage = Math.round((uploadedBytes / file.size) * 100);
      updateProgress('uploading', percentage, undefined, uploadedBytes);
    }

    updateProgress('completing');
    await this.completeUpload(uploadResponse.uploadId, completedParts);
  }

  validateVideoFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      'video/flv', 'video/webm', 'video/mkv', 'video/m4v'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Unsupported file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of 10GB. Current size: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB`
      };
    }

    if (file.size <= 0) {
      return {
        isValid: false,
        error: 'File is empty'
      };
    }

    return { isValid: true };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return '--';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}

export const uploadService = new UploadService();