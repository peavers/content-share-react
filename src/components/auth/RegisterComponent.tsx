import React, { useState, type FormEvent, type MouseEvent } from 'react';
import { signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import type { RegisterComponentProps, AmplifySignUpResult } from '../../types';

const RegisterComponent: React.FC<RegisterComponentProps> = () => {
  const [step, setStep] = useState<'signup' | 'confirm'>('signup');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [generatedUsername, setGeneratedUsername] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // Generate a unique username from email (remove @ and .)
      const username = email.replace('@', '_').replace(/\./g, '_') + '_' + Date.now();

      const result: AmplifySignUpResult = await signUp({
        username: username,
        password,
        options: {
          userAttributes: {
            email
          },
          autoSignIn: false
        }
      });

      setGeneratedUsername(username); // Store for confirmation step

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep('confirm');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      console.error('SignUp error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await confirmSignUp({
        username: generatedUsername,
        confirmationCode
      });

      if (result.isSignUpComplete) {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during confirmation');
      console.error('Confirmation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resendSignUpCode({
        username: generatedUsername
      });
      setError('Verification code resent successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Confirm your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a verification code to {email}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleConfirmSignUp}>
            {error && (
              <div className={`border px-4 py-3 rounded relative ${
                error.includes('successfully')
                  ? 'bg-green-100 border-green-400 text-green-700'
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}>
                {error}
              </div>
            )}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter verification code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Confirm Account'}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm">
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;