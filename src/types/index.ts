// Re-export generated types directly - no backward compatibility
export type {
  User,
  UserProfileDto,
  Organization,
  OrganizationMembership,
  OrganizationInvitation,
  CreateOrganizationRequest,
  InviteMemberRequest,
  UploadRequest,
  UploadResult,
  UploadCompletionRequest,
  PartInfo,
  PresignedUrlInfo,
  Video,
  VideoMetadata,
  Tag
} from '../generated';

import type { User } from '../generated';

// Auth Context Types - use generated User type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuthState: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getIdToken: () => Promise<string | null>;
  refreshSession: () => Promise<any>;
  hasScope: (scope: string) => boolean;
  userScopes: string[];
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

// Video Upload Types
export interface UploadProgress {
  uploadId: string;
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  status: 'preparing' | 'uploading' | 'completing' | 'completed' | 'error' | 'cancelled';
  error?: string;
  startTime: Date;
  estimatedTimeRemaining?: number;
  uploadSpeed?: number;
}


// Simple component props
export interface VideoUploadProps {}
export interface AppProps {}
export interface DashboardProps {}
export interface LoginComponentProps {}
export interface RegisterComponentProps {}
export interface ForgotPasswordComponentProps {}
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

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

// Re-export organization utilities
export type { WorkspaceContext } from './organization';
export { hasPermission } from './organization';