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
        setIsAuthenticated(true);

        // Fetch full user data from database
        try {
          const [userResponse, profileResponse] = await Promise.all([
            generatedApiService.user.getCurrentUser(),
            generatedApiService.user.getUserProfile()
          ]);

          if (userResponse.data) {
            // Use database user data
            setUser({
              id: userResponse.data.id || currentUser.userId,
              email: userResponse.data.email || currentUser.signInDetails?.loginId || '',
              username: userResponse.data.username || currentUser.username,
              firstName: userResponse.data.firstName || '',
              lastName: userResponse.data.lastName || '',
              avatarUrl: userResponse.data.avatarUrl || '',
              personalOrganizationId: '', // Will be set from API later if needed
              emailVerified: userResponse.data.emailVerified ?? true,
              active: userResponse.data.isActive ?? true,
              lastLoginAt: userResponse.data.lastLoginAt || new Date().toISOString(),
              createdAt: userResponse.data.createdAt || new Date().toISOString(),
              updatedAt: userResponse.data.updatedAt || new Date().toISOString(),
              personalOrganization: null
            });

            // Get scopes from profile response
            if (profileResponse.data?.scopes) {
              setUserScopes(profileResponse.data.scopes);
            }
          } else {
            // Fallback to Cognito user if API fails
            setUser({
              id: currentUser.userId,
              email: currentUser.signInDetails?.loginId || '',
              username: currentUser.username,
              firstName: '',
              lastName: '',
              avatarUrl: '',
              personalOrganizationId: '',
              emailVerified: true,
              active: true,
              lastLoginAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              personalOrganization: null
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to Cognito user if API fails
          setUser({
            id: currentUser.userId,
            email: currentUser.signInDetails?.loginId || '',
            username: currentUser.username,
            firstName: '',
            lastName: '',
            avatarUrl: '',
            personalOrganizationId: '',
            emailVerified: true,
            active: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            personalOrganization: null
          });
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