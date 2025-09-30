import React, { useState, type FormEvent } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { AmplifySignUpResult } from '../../types';

const RegisterComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'register' | 'confirm'>('register');
  const [generatedUsername, setGeneratedUsername] = useState<string>('');
  const navigate = useNavigate();
  const { checkAuthState } = useAuth();

  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Generate a unique username from email
      const username = email.replace('@', '_').replace(/\./g, '_') + '_' + Date.now();
      setGeneratedUsername(username);

      const result: AmplifySignUpResult = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name
          }
        }
      });

      console.log('Sign up result:', result);

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep('confirm');
      } else if (result.isSignUpComplete) {
        // Auto sign in if no confirmation needed
        await signIn({ username, password });
        await checkAuthState();
        navigate('/');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.name === 'UsernameExistsException') {
        setError('An account with this email already exists');
      } else if (err.name === 'InvalidPasswordException') {
        setError('Password does not meet requirements');
      } else {
        setError(err.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmSignUp({
        username: generatedUsername,
        confirmationCode
      });

      console.log('Confirmation successful');

      // Auto sign in after confirmation
      await signIn({ username: generatedUsername, password });
      await checkAuthState();
      navigate('/');
    } catch (err: any) {
      console.error('Confirmation error:', err);
      if (err.name === 'CodeMismatchException') {
        setError('Invalid confirmation code');
      } else if (err.name === 'ExpiredCodeException') {
        setError('Confirmation code has expired');
      } else {
        setError(err.message || 'An error occurred during confirmation');
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirm') {
    return (
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold">Confirm Your Email</h1>
            <p className="py-6">We've sent a confirmation code to <strong>{email}</strong></p>
          </div>

          <div className="card bg-base-100 w-full shadow-2xl">
            <form onSubmit={handleConfirmation} className="card-body">
              {/* Error Alert */}
              {error && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Confirmation Code Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirmation Code</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter confirmation code"
                  className="input input-bordered"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading && <span className="loading loading-spinner"></span>}
                  {loading ? 'Confirming...' : 'Confirm Email'}
                </button>
              </div>

              {/* Back Link */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="link link-hover"
                >
                  Back to registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold">ContentShare</h1>
          <p className="py-6">Create your account</p>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl">
          <form onSubmit={handleRegister} className="card-body">
            {/* Error Alert */}
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                <span className="label-text-alt">Must be at least 8 characters</span>
              </label>
            </div>

            {/* Confirm Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="confirm password"
                className="input input-bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>

            {/* Login Link */}
            <div className="divider">OR</div>
            <div className="text-center">
              <p className="text-sm">
                Already have an account?{' '}
                <a href="/login" className="link link-primary">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;