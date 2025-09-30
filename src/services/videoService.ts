import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { Video } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// Function to get current organization from localStorage
const getCurrentOrganizationId = (): string | null => {
  try {
    const workspace = localStorage.getItem('currentWorkspace');
    if (workspace) {
      const parsed = JSON.parse(workspace);
      return parsed.organizationId;
    }
  } catch (error) {
    console.error('Error getting current organization:', error);
  }
  return null;
};

// Add auth and organization headers to all requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      if (session?.tokens?.idToken) {
        config.headers.Authorization = `Bearer ${session.tokens.idToken.toString()}`;
      }

      // Add organization header if available
      const organizationId = getCurrentOrganizationId();
      if (organizationId) {
        config.headers['X-Organization-Id'] = organizationId;
      }
    } catch (error) {
      console.error('Error adding headers:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export class VideoService {
  /**
   * Get all videos for the current organization
   */
  async getOrganizationVideos(): Promise<Video[]> {
    const response = await axiosInstance.get('/api/videos');
    return response.data;
  }

  /**
   * Get a specific video by ID
   */
  async getVideo(videoId: number): Promise<Video> {
    const response = await axiosInstance.get(`/api/videos/${videoId}`);
    return response.data;
  }

  /**
   * Get videos uploaded by the current user
   */
  async getMyVideos(): Promise<Video[]> {
    const response = await axiosInstance.get('/api/videos/my-videos');
    return response.data;
  }

  /**
   * Delete a video
   */
  async deleteVideo(videoId: number): Promise<void> {
    await axiosInstance.delete(`/api/videos/${videoId}`);
  }
}

export const videoService = new VideoService();