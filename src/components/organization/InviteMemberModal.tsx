import React, { useState } from 'react';
import { TextInput, RadioGroup } from '../forms';

interface InviteMemberModalProps {
  onClose: () => void;
  onSubmit: (data: { email: string; role: 'admin' | 'member' }) => Promise<void>;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'member' as 'admin' | 'member'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    {
      value: 'member',
      label: 'Member',
      description: 'Can view content only'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Can manage members, upload content, and organization settings'
    }
  ];

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Invite Team Member</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
            <TextInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="member@company.com"
              helperText="We'll send an invitation email to this address"
              required
            />

            {/* Role Selection */}
            <RadioGroup
              label="Role"
              name="role"
              value={formData.role}
              onChange={(value) => setFormData(prev => ({ ...prev, role: value as 'admin' | 'member' }))}
              options={roleOptions}
              orientation="vertical"
              color="primary"
            />
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting && <span className="loading loading-spinner"></span>}
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default InviteMemberModal;