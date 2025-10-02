import { generatedApiService } from './generatedApiService';
import type { Video, VideoWithMetadataDTO } from '../generated';

export class VideoService {
  /**
   * Get all videos for the current organization
   */
  async getOrganizationVideos(): Promise<Video[]> {
    const response = await generatedApiService.video.getOrganizationVideos();
    return response.data as Video[];
  }

  /**
   * Get a specific video by ID
   */
  async getVideo(videoId: string): Promise<Video> {
    const response = await generatedApiService.video.getVideo(videoId);
    return response.data as Video;
  }

  /**
   * Get a specific video with its metadata by ID
   */
  async getVideoWithMetadata(videoId: string): Promise<VideoWithMetadataDTO> {
    const response = await generatedApiService.video.getVideoWithMetadata(videoId);
    return response.data;
  }

  /**
   * Get presigned URL for video playback
   */
  async getVideoPresignedUrl(videoId: string): Promise<string> {
    const response = await generatedApiService.video.getVideoPresignedUrl(videoId);
    return response.data;
  }

  /**
   * Get videos uploaded by the current user
   */
  async getMyVideos(): Promise<Video[]> {
    const response = await generatedApiService.video.getUserVideos();
    return response.data as Video[];
  }

  /**
   * Get presigned URL for video thumbnail
   */
  async getThumbnailUrl(videoId: string): Promise<string> {
    const response = await generatedApiService.video.getVideoThumbnailUrl(videoId);
    return response.data;
  }

  /**
   * Update a video's metadata (title, description)
   */
  async updateVideo(videoId: string, updates: { title?: string; description?: string }): Promise<Video> {
    const updateRequest = {
      title: updates.title || '',
      description: updates.description || ''
    };
    const response = await generatedApiService.video.updateVideo(videoId, updateRequest);
    return response.data as Video;
  }

  /**
   * Delete a video
   */
  async deleteVideo(videoId: string): Promise<void> {
    await generatedApiService.video.deleteVideo(videoId);
  }
}

export const videoService = new VideoService();