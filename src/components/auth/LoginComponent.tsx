import React, { useState, type FormEvent } from 'react';
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginComponentProps, AmplifySignInResult } from '../../types';

const LoginComponent: React.FC<LoginComponentProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { checkAuthState } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, check if there's already a signed-in user and sign them out
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('Found existing signed-in user, signing out first...');
          await signOut();
        }
      } catch (error) {
        // No current user, which is what we want - continue with sign in
        console.log('No existing user session found, proceeding with sign in');
      }

      const result: AmplifySignInResult = await signIn({
        username: email,
        password
      });

      console.log('Sign in result:', result);

      if (result.isSignedIn) {
        // Refresh the auth context state
        await checkAuthState();
        navigate('/dashboard');
      } else if (result.nextStep) {
        console.log('Next step required:', result.nextStep);
        setError(`Login incomplete. Next step: ${result.nextStep.signInStep || 'Unknown step required'}`);
      }
    } catch (err: any) {
      // Handle the specific "already signed in user" error
      if (err.message && err.message.includes('already signed in user')) {
        try {
          console.log('Handling "already signed in user" error by signing out and retrying...');
          await signOut();
          // Retry the sign in after sign out
          const result: AmplifySignInResult = await signIn({
            username: email,
            password
          });

          if (result.isSignedIn) {
            await checkAuthState();
            navigate('/dashboard');
          } else if (result.nextStep) {
            setError(`Login incomplete. Next step: ${result.nextStep.signInStep || 'Unknown step required'}`);
          }
        } catch (retryError: any) {
          setError(retryError.message || 'An error occurred during login retry');
          console.error('Login retry error:', retryError);
        }
      } else {
        setError(err.message || 'An error occurred during login');
        console.error('Login error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="border border-black p-12 space-y-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-light text-black mb-4">ContentShare</h2>
            <p className="text-gray-600 font-light">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="border border-red-300 p-4 bg-red-50">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-light text-black mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-light text-black mb-3">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-4 hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Links */}
            <div className="flex flex-col space-y-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-black border-b border-black hover:border-gray-600 transition-colors duration-200 inline-block"
              >
                Forgot your password?
              </a>
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-black border-b border-black hover:border-gray-600 transition-colors duration-200"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;