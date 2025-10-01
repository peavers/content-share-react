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
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-2">Confirm Your Email</h2>
            <p className="text-sm opacity-60 mb-4">We've sent a confirmation code to <strong>{email}</strong></p>

            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleConfirmation}>
              <div className="form-control mb-6">
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

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? 'Confirming...' : 'Confirm Email'}
              </button>

              <div className="divider"></div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="link link-primary"
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
