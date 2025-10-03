import React, { useState, type FormEvent } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { AmplifySignUpResult } from '../../types';
import RegisterForm from './RegisterForm';
import type { RegisterFormData } from './RegisterForm';

const RegisterComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'register' | 'confirm'>('register');
  const [generatedUsername, setGeneratedUsername] = useState<string>('');
  const navigate = useNavigate();
  const { checkAuthState } = useAuth();

  const handleRegister = async (formData: RegisterFormData): Promise<void> => {
    setError('');
    setLoading(true);

    try {
      // Generate a unique username from email
      const username = formData.email!.replace('@', '_').replace(/\./g, '_') + '_' + Date.now();
      setGeneratedUsername(username);
      setEmail(formData.email!);
      setPassword(formData.password);

      const result: AmplifySignUpResult = await signUp({
        username,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email!,
            name: formData.fullName!
          }
        }
      });

      console.log('Sign up result:', result);

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep('confirm');
      } else if (result.isSignUpComplete) {
        // Auto sign in if no confirmation needed
        await signIn({ username, password: formData.password });
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
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Check your email</h1>
            <p className="text-base-content/60">We've sent a confirmation code to</p>
            <p className="text-primary font-medium">{email}</p>
          </div>

          {/* Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <form onSubmit={handleConfirmation} className="card-body gap-6">
              {error && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirmation Code</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="input input-bordered w-full pl-12 focus:input-primary transition-all text-center text-2xl tracking-widest font-mono"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <label className="label">
                  <span className="label-text-alt text-base-content/60">Enter the 6-digit code from your email</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Confirming...
                  </>
                ) : (
                  <>
                    Confirm Email
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>

              <div className="divider text-base-content/40 text-xs">NEED HELP?</div>

              <div className="text-center space-y-2">
                <p className="text-sm text-base-content/70">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="link link-primary font-medium text-sm"
                >
                  ← Back to registration
                </button>
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
  }

  return (
    <RegisterForm
      onSubmit={handleRegister}
      loading={loading}
      error={error}
      title="ContentShare"
      subtitle="Create your account"
      submitButtonText="Create Account"
      showEmailField={true}
      showNameFields={false}
    />
  );
};

export default RegisterComponent;
