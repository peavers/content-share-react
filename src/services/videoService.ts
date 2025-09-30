import { generatedApiService } from './generatedApiService';
import type { Video } from '../types';

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
   * Get videos uploaded by the current user
   */
  async getMyVideos(): Promise<Video[]> {
    const response = await generatedApiService.video.getMyVideos();
    return response.data as Video[];
  }

  /**
   * Delete a video
   */
  async deleteVideo(videoId: number): Promise<void> {
    await generatedApiService.video.deleteVideo(videoId);
  }
}

export const videoService = new VideoService();