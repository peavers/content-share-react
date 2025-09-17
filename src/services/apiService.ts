import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type {
  ApiServiceType,
  UserProfile,
  ContentDto,
  ShareRequestDto,
  HealthCheckResponse,
  AmplifyAuthSession
} from '../types';

const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session: AmplifyAuthSession = await fetchAuthSession();
      if (session?.tokens?.idToken) {
        config.headers.Authorization = `Bearer ${session.tokens.idToken.toString()}`;
      }
    } catch (error) {
      console.error('Error fetching auth session for API call:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the session
        const session: AmplifyAuthSession = await fetchAuthSession({ forceRefresh: true });
        if (session?.tokens?.idToken) {
          originalRequest.headers.Authorization = `Bearer ${session.tokens.idToken.toString()}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API service methods with generic HTTP methods
const apiService: ApiServiceType = {
  // Generic HTTP methods
  get: async <T = any>(url: string): Promise<{ data: T }> => {
    const response = await apiClient.get<T>(url);
    return { data: response.data };
  },

  post: async <T = any>(url: string, data?: any): Promise<{ data: T }> => {
    const response = await apiClient.post<T>(url, data);
    return { data: response.data };
  },

  put: async <T = any>(url: string, data?: any): Promise<{ data: T }> => {
    const response = await apiClient.put<T>(url, data);
    return { data: response.data };
  },

  delete: async <T = any>(url: string): Promise<{ data: T }> => {
    const response = await apiClient.delete<T>(url);
    return { data: response.data };
  },

  // User profile endpoints
  getUserProfile: async (): Promise<UserProfile> => {
    const response: AxiosResponse<UserProfile> = await apiClient.get('/api/user/profile');
    return response.data;
  },

  updateUserProfile: async (profileData: UserProfile): Promise<UserProfile> => {
    const response: AxiosResponse<UserProfile> = await apiClient.put('/api/user/profile', profileData);
    return response.data;
  },

  // Content sharing endpoints
  getSharedContent: async (): Promise<ContentDto[]> => {
    const response: AxiosResponse<ContentDto[]> = await apiClient.get('/api/content');
    return response.data;
  },

  createContent: async (contentData: Partial<ContentDto>): Promise<ContentDto> => {
    const response: AxiosResponse<ContentDto> = await apiClient.post('/api/content', contentData);
    return response.data;
  },

  updateContent: async (contentId: string, contentData: Partial<ContentDto>): Promise<ContentDto> => {
    const response: AxiosResponse<ContentDto> = await apiClient.put(`/api/content/${contentId}`, contentData);
    return response.data;
  },

  deleteContent: async (contentId: string): Promise<void> => {
    await apiClient.delete(`/api/content/${contentId}`);
  },

  // Share content with other users
  shareContent: async (contentId: string, shareData: ShareRequestDto): Promise<any> => {
    const response: AxiosResponse<any> = await apiClient.post(`/api/content/${contentId}/share`, shareData);
    return response.data;
  },

  // Health check - use generated API service
  healthCheck: async (): Promise<HealthCheckResponse> => {
    const { generatedApiService } = await import('./generatedApiService');
    const response = await generatedApiService.healthCheck();
    return response.data;
  }
};

export default apiService;