import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RegisterForm from './RegisterForm';
import type { RegisterFormData } from './RegisterForm';

const AcceptInvitation: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: RegisterFormData) => {
    setError(null);

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8080/api/organizations/public/invitations/${token}/accept`,
        {
          password: formData.password,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
        }
      );

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Account created successfully! Please log in with your email and password.'
          }
        });
      }, 3000);

    } catch (err: any) {
      console.error('Failed to accept invitation:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to accept invitation. The link may be invalid or expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="card-title justify-center text-2xl">Account Created!</h2>
            <p>Your account has been successfully created.</p>
            <p className="text-sm opacity-60">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      title="Accept Invitation"
      subtitle="Create your account to join the organization"
      submitButtonText="Create Account & Accept Invitation"
      showEmailField={false}
      showNameFields={true}
    />
  );
};

export default AcceptInvitation;
