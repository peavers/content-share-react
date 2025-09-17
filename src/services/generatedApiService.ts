import { fetchAuthSession } from 'aws-amplify/auth';
import {
  Configuration,
  AwsS3ControllerApi,
  OrganizationControllerApi,
  SecurityControllerApi,
  UserControllerApi
} from '../generated';
import type { AmplifyAuthSession } from '../types';

const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class GeneratedApiService {
  private configuration: Configuration;
  private awsS3Api: AwsS3ControllerApi;
  private organizationApi: OrganizationControllerApi;
  private securityApi: SecurityControllerApi;
  private userApi: UserControllerApi;

  constructor() {
    this.configuration = new Configuration({
      basePath: API_BASE_URL,
      accessToken: this.getAccessToken.bind(this)
    });

    this.awsS3Api = new AwsS3ControllerApi(this.configuration);
    this.organizationApi = new OrganizationControllerApi(this.configuration);
    this.securityApi = new SecurityControllerApi(this.configuration);
    this.userApi = new UserControllerApi(this.configuration);
  }

  private async getAccessToken(): Promise<string> {
    try {
      const session: AmplifyAuthSession = await fetchAuthSession();
      if (session?.tokens?.idToken) {
        return session.tokens.idToken.toString();
      }
      return '';
    } catch (error) {
      console.error('Error fetching auth session for API call:', error);
      return '';
    }
  }

  // AWS S3 Controller methods
  get s3() {
    return this.awsS3Api;
  }

  // Organization Controller methods
  get organization() {
    return this.organizationApi;
  }

  // Security Controller methods
  get security() {
    return this.securityApi;
  }

  // User Controller methods
  get user() {
    return this.userApi;
  }

  // Note: Health check not available in generated API, use original apiService implementation
}

export const generatedApiService = new GeneratedApiService();
export default generatedApiService;