import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import {
  AwsS3ControllerApi,
  OrganizationControllerApi,
  SecurityControllerApi,
  TagControllerApi,
  UserControllerApi,
  UserManagementControllerApi,
  VideoControllerApi,
  Configuration
} from '../generated';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with auth interceptor
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

// Add auth header to all requests
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
      console.error('Error fetching auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create configuration
const configuration = new Configuration({
  basePath: API_BASE_URL
});

// Create API instances with the axios instance that has auth
export const awsS3Api = new AwsS3ControllerApi(configuration, API_BASE_URL, axiosInstance);
export const organizationApi = new OrganizationControllerApi(configuration, API_BASE_URL, axiosInstance);
export const securityApi = new SecurityControllerApi(configuration, API_BASE_URL, axiosInstance);
export const tagApi = new TagControllerApi(configuration, API_BASE_URL, axiosInstance);
export const userApi = new UserControllerApi(configuration, API_BASE_URL, axiosInstance);
export const userManagementApi = new UserManagementControllerApi(configuration, API_BASE_URL, axiosInstance);
export const videoApi = new VideoControllerApi(configuration, API_BASE_URL, axiosInstance);

// Export the axios instance for services that need to make custom API calls
export const getAuthenticatedAxios = () => axiosInstance;

// Export as default for backward compatibility
export const generatedApiService = {
  s3: awsS3Api,
  organization: organizationApi,
  security: securityApi,
  tag: tagApi,
  user: userApi,
  userManagement: userManagementApi,
  video: videoApi
};

export default generatedApiService;