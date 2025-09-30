import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';
import type { AuthContextType, User, AmplifyAuthSession } from '../types';
import { generatedApiService } from '../services/generatedApiService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userScopes, setUserScopes] = useState<string[]>([]);

  // Note: JWT token handling is now done directly in apiService.js

  // Check authentication status on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      const currentUser = await getCurrentUser();
      const session: AmplifyAuthSession = await fetchAuthSession();

      if (currentUser && session?.tokens) {

        // Map AWS Amplify user to generated User type
        setUser({
          id: currentUser.userId,
          email: currentUser.signInDetails?.loginId || '', // Use loginId as email
          username: currentUser.username,
          firstName: '',
          lastName: '',
          avatarUrl: '',
          personalOrganizationId: '', // Will be set from API
          emailVerified: true,
          active: true,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          personalOrganization: null // Required by generated User type
        });
        setIsAuthenticated(true);

        // Fetch user profile to get scopes
        try {
          const profileResponse = await generatedApiService.user.getUserProfile();
          if (profileResponse.data?.scopes) {
            setUserScopes(profileResponse.data.scopes);
          }
        } catch (error) {
          console.error('Error fetching user profile scopes:', error);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserScopes([]);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserScopes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      const session: AmplifyAuthSession = await fetchAuthSession();
      return session?.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      const session: AmplifyAuthSession = await fetchAuthSession();
      return session?.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  const refreshSession = async (): Promise<any> => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      return session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
  };

  const hasScope = (scope: string): boolean => {
    return userScopes.includes(scope);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    checkAuthState,
    logout: handleLogout,
    getAccessToken,
    getIdToken,
    refreshSession,
    hasScope,
    userScopes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;