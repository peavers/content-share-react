import React, { useState, useEffect } from 'react';
import { TextInput } from '../forms';

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface RegisterFormData {
  email?: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

interface RegisterFormProps {
  onSubmit: (formData: RegisterFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  title: string;
  subtitle: string;
  submitButtonText: string;
  showEmailField?: boolean;
  emailValue?: string;
  showNameFields?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
  error,
  title,
  subtitle,
  submitButtonText,
  showEmailField = true,
  emailValue,
  showNameFields = false,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: emailValue || '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    fullName: '',
  });

  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    const pwd = formData.password;
    setPasswordValidation({
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  }, [formData.password]);

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(v => v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="py-6">{subtitle}</p>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email field */}
              {showEmailField && (
                <TextInput
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!!emailValue}
                  containerClassName="mb-4"
                />
              )}

              {/* Name fields */}
              {showNameFields ? (
                <>
                  <TextInput
                    label="First Name (Optional)"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    containerClassName="mb-4"
                  />

                  <TextInput
                    label="Last Name (Optional)"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    containerClassName="mb-4"
                  />
                </>
              ) : (
                <TextInput
                  label="Full Name"
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  containerClassName="mb-4"
                />
              )}

              {/* Password field with validation */}
              <div className="mb-4">
                <TextInput
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {/* Password requirements */}
                <div className="mt-2 text-xs space-y-1">
                  <div className={passwordValidation.minLength ? 'text-success' : 'opacity-60'}>
                    {passwordValidation.minLength ? '✓' : '○'} At least 8 characters
                  </div>
                  <div className={passwordValidation.hasUppercase ? 'text-success' : 'opacity-60'}>
                    {passwordValidation.hasUppercase ? '✓' : '○'} One uppercase letter
                  </div>
                  <div className={passwordValidation.hasLowercase ? 'text-success' : 'opacity-60'}>
                    {passwordValidation.hasLowercase ? '✓' : '○'} One lowercase letter
                  </div>
                  <div className={passwordValidation.hasNumber ? 'text-success' : 'opacity-60'}>
                    {passwordValidation.hasNumber ? '✓' : '○'} One number
                  </div>
                  <div className={passwordValidation.hasSpecial ? 'text-success' : 'opacity-60'}>
                    {passwordValidation.hasSpecial ? '✓' : '○'} One special character
                  </div>
                </div>
              </div>

              {/* Confirm Password field */}
              <TextInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined}
                containerClassName="mb-6"
              />

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading || !isPasswordValid() || !passwordsMatch}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    {submitButtonText}...
                  </>
                ) : (
                  submitButtonText
                )}
              </button>
            </form>

            <div className="divider">OR</div>
            <div className="text-center">
              <p className="text-sm">
                Already have an account?{' '}
                <a href="/login" className="link link-primary">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
