import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with base configuration
const apiClient = axios.create({
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
      const session = await fetchAuthSession();
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
        const session = await fetchAuthSession({ forceRefresh: true });
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

// API service methods
const apiService = {
  // User profile endpoints
  getUserProfile: async () => {
    const response = await apiClient.get('/api/user/profile');
    return response.data;
  },

  updateUserProfile: async (profileData) => {
    const response = await apiClient.put('/api/user/profile', profileData);
    return response.data;
  },

  // Content sharing endpoints
  getSharedContent: async () => {
    const response = await apiClient.get('/api/content');
    return response.data;
  },

  createContent: async (contentData) => {
    const response = await apiClient.post('/api/content', contentData);
    return response.data;
  },

  updateContent: async (contentId, contentData) => {
    const response = await apiClient.put(`/api/content/${contentId}`, contentData);
    return response.data;
  },

  deleteContent: async (contentId) => {
    const response = await apiClient.delete(`/api/content/${contentId}`);
    return response.data;
  },

  // Share content with other users
  shareContent: async (contentId, shareData) => {
    const response = await apiClient.post(`/api/content/${contentId}/share`, shareData);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default apiService;