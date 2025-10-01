import React, { useState, type FormEvent } from 'react';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../forms';

const ForgotPasswordComponent: React.FC = () => {
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { nextStep } = await resetPassword({
        username: email
      });

      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setStep('confirm');
        setSuccess('Password reset code sent to your email');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword
      });

      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      console.error('Confirm reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirm') {
    return (
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="text-5xl font-bold">ContentShare</h1>
            <p className="py-6">Reset your password</p>
          </div>

          <div className="card bg-base-100 w-full shadow-2xl">
            <form className="card-body" onSubmit={handleConfirmReset}>
              {error && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <TextInput
                label="Verification Code"
                type="text"
                name="code"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <TextInput
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="New password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <TextInput
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : undefined}
                required
              />

              <div className="form-control mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>

              <div className="divider">OR</div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="link link-primary"
                >
                  Back to request reset
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
          <p className="py-6">Forgot your password?</p>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl">
          <form className="card-body" onSubmit={handleRequestReset}>
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <TextInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>

            <div className="divider">OR</div>
            <div className="text-center">
              <p className="text-sm">
                Remember your password?{' '}
                <a href="/login" className="link link-primary">
                  Back to login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;