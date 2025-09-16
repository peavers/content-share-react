// User and Authentication Types
export interface User {
  username: string;
  userId: string;
  signInDetails?: any;
}

export interface UserProfile {
  username: string;
  email: string;
  groups?: string[];
  scopes?: string[];
  attributes?: Record<string, any>;
}

// Content Types
export interface ContentDto {
  id: string;
  title: string;
  description: string;
  content: string;
  owner: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  shared: boolean;
  status: string;
  sharedWith?: string[];
}

export interface ShareRequestDto {
  usernames: string[];
}

// API Call Tracking
export interface ApiCall {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: 'success' | 'error';
  data: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuthState: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getIdToken: () => Promise<string | null>;
  refreshSession: () => Promise<any>;
}

// API Service Types
export interface ApiServiceType {
  getUserProfile: () => Promise<UserProfile>;
  updateUserProfile: (profileData: UserProfile) => Promise<UserProfile>;
  getSharedContent: () => Promise<ContentDto[]>;
  createContent: (contentData: Partial<ContentDto>) => Promise<ContentDto>;
  updateContent: (contentId: string, contentData: Partial<ContentDto>) => Promise<ContentDto>;
  deleteContent: (contentId: string) => Promise<void>;
  shareContent: (contentId: string, shareData: ShareRequestDto) => Promise<any>;
  healthCheck: () => Promise<{ timestamp: string; service: string; status: string; version: string }>;
}

// Component Props Types
export interface DashboardProps {}

export interface LoginComponentProps {}

export interface RegisterComponentProps {}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface ForgotPasswordComponentProps {}

export interface AppProps {}

// Form State Types
export interface LoginFormState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
}

export interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  loading: boolean;
  step: 'register' | 'verify';
  verificationCode: string;
}

// AWS Amplify Types
export interface AmplifySignInResult {
  isSignedIn: boolean;
  nextStep?: {
    signInStep: string;
  };
}

export interface AmplifySignUpResult {
  isSignUpComplete: boolean;
  nextStep?: {
    signUpStep: string;
  };
}

export interface AmplifyAuthSession {
  tokens?: {
    idToken?: {
      toString(): string;
    };
    accessToken?: {
      toString(): string;
    };
  };
}

// Health Check Response
export interface HealthCheckResponse {
  timestamp: string;
  service: string;
  status: string;
  version: string;
}