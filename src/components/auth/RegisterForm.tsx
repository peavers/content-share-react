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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-base-content/60">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body gap-6">
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              {showEmailField && (
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
                      name="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full pl-12 focus:input-primary transition-all"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!!emailValue}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Name fields */}
              {showNameFields ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">First Name</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      className="input input-bordered focus:input-primary transition-all"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Last Name</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      className="input input-bordered focus:input-primary transition-all"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      className="input input-bordered w-full pl-12 focus:input-primary transition-all"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password field with validation */}
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
                    name="password"
                    placeholder="Create a strong password"
                    className="input input-bordered w-full pl-12 focus:input-primary transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password requirements */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-base-200 rounded-lg">
                    <p className="text-xs font-medium mb-2 opacity-70">Password requirements:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div className={`flex items-center gap-1.5 ${passwordValidation.minLength ? 'text-success' : 'opacity-60'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordValidation.hasUppercase ? 'text-success' : 'opacity-60'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Uppercase
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordValidation.hasLowercase ? 'text-success' : 'opacity-60'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Lowercase
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordValidation.hasNumber ? 'text-success' : 'opacity-60'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Number
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordValidation.hasSpecial ? 'text-success' : 'opacity-60'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Special char
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirm Password</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className={`input input-bordered w-full pl-12 transition-all ${
                      formData.confirmPassword && !passwordsMatch ? 'input-error' : 'focus:input-primary'
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <label className="label">
                    <span className="label-text-alt text-error">Passwords do not match</span>
                  </label>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full gap-2 mt-6"
                disabled={loading || !isPasswordValid() || !passwordsMatch}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {submitButtonText}...
                  </>
                ) : (
                  <>
                    {submitButtonText}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-base-content/40 text-xs">OR</div>

            {/* Sign in Link */}
            <div className="text-center">
              <p className="text-sm text-base-content/70">
                Already have an account?{' '}
                <a href="/login" className="link link-primary font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-base-content/40">
          <p>&copy; 2025 ContentShare. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
