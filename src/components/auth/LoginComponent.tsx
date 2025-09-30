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
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold">ContentShare</h1>
          <p className="py-6">Sign in to your account</p>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl">
          <form onSubmit={handleSubmit} className="card-body">
            {/* Error Alert */}
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label">
                <a href="/forgot-password" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {/* Register Link */}
            <div className="divider">OR</div>
            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{' '}
                <a href="/register" className="link link-primary">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;