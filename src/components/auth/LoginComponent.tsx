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
        navigate('/');
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
            navigate('/');
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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-base-content/60">Sign in to your ContentShare account</p>
        </div>

        {/* Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <form onSubmit={handleSubmit} className="card-body gap-6">
            {/* Error Alert */}
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-12 focus:input-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full pl-12 focus:input-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <label className="label">
                <span className="label-text-alt"></span>
                <a href="/forgot-password" className="label-text-alt link link-hover link-primary">Forgot password?</a>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-lg w-full gap-2" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider text-base-content/40 text-xs">OR</div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-base-content/70">
                Don't have an account?{' '}
                <a href="/register" className="link link-primary font-medium">
                  Create account
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-base-content/40">
          <p>&copy; 2025 ContentShare. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;