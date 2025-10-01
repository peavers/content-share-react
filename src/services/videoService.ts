import { generatedApiService } from './generatedApiService';
import type { Video } from '../types';
import type { VideoWithMetadataDTO } from '../generated';

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
  async getVideo(videoId: number): Promise<Video> {
    const response = await generatedApiService.video.getVideo(videoId);
    return response.data as Video;
  }

  /**
   * Get a specific video with its metadata by ID
   */
  async getVideoWithMetadata(videoId: number): Promise<VideoWithMetadataDTO> {
    const response = await generatedApiService.video.getVideoWithMetadata(videoId);
    return response.data;
  }

  /**
   * Get presigned URL for video playback
   */
  async getVideoPresignedUrl(videoId: number): Promise<string> {
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
  async getThumbnailUrl(videoId: number): Promise<string> {
    const response = await generatedApiService.video.getVideoThumbnailUrl(videoId);
    return response.data;
  }

  /**
   * Delete a video
   */
  async deleteVideo(videoId: number): Promise<void> {
    await generatedApiService.video.deleteVideo(videoId);
  }
}

export const videoService = new VideoService();