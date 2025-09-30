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
        navigate('/dashboard');
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
      navigate('/dashboard');
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
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="border border-black p-12 space-y-12">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-light text-black mb-4">Confirm Your Email</h2>
              <p className="text-gray-600 font-light">
                We've sent a confirmation code to <strong>{email}</strong>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-red-300 p-4 bg-red-50">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Confirmation Form */}
            <form onSubmit={handleConfirmation} className="space-y-8">
              <div>
                <label htmlFor="confirmationCode" className="block text-sm font-light text-black mb-3">
                  Confirmation Code
                </label>
                <input
                  id="confirmationCode"
                  name="confirmationCode"
                  type="text"
                  required
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                  placeholder="Enter confirmation code"
                />
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
                    Confirming...
                  </div>
                ) : (
                  'Confirm Email'
                )}
              </button>

              {/* Link back */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="text-sm text-black border-b border-black hover:border-gray-600 transition-colors duration-200"
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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="border border-black p-12 space-y-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-light text-black mb-4">ContentShare</h2>
            <p className="text-gray-600 font-light">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="border border-red-300 p-4 bg-red-50">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-light text-black mb-3">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                  placeholder="Create a password"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-light text-black mb-3">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                  placeholder="Confirm your password"
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
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Links */}
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-black border-b border-black hover:border-gray-600 transition-colors duration-200"
                >
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;