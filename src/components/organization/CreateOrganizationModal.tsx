import React, { useState, useCallback } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { organizationService } from '../../services/organizationService';
import { TextInput, Textarea, Select } from '../forms';
import type { CreateOrganizationRequest } from "../../generated";
import {
  CreateOrganizationRequestVisibilityEnum,
  InviteMemberRequestRoleEnum
} from "../../generated";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (organization: any) => void;
}

interface OrgFormData extends CreateOrganizationRequest {
  inviteEmails: string[];
  inviteRoles: InviteMemberRequestRoleEnum[];
}

export function CreateOrganizationModal({ isOpen, onClose, onSuccess }: CreateOrganizationModalProps) {
  const { createOrganization } = useOrganization();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    avatarUrl: '',
    websiteUrl: '',
    visibility: CreateOrganizationRequestVisibilityEnum.Private,
    plan: 'basic',
    settings: {},
    inviteEmails: [],
    inviteRoles: []
  });

  const [inviteList, setInviteList] = useState<Array<{ email: string; role: InviteMemberRequestRoleEnum }>>([]);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        name: '',
        slug: '',
        description: '',
        avatarUrl: '',
        websiteUrl: '',
        visibility: CreateOrganizationRequestVisibilityEnum.Private,
        plan: 'basic',
        settings: {},
        inviteEmails: [],
        inviteRoles: []
      });
      setInviteList([]);
      setError(null);
      setSlugError(null);
      setSlugAvailable(null);
    }
  }, [isOpen]);

  // Auto-generate slug from name
  const handleNameChange = useCallback(async (name: string) => {
    const slug = organizationService.generateSlug(name);
    setFormData(prev => ({ ...prev, name, slug }));
    setSlugAvailable(null); // Reset availability check

    if (slug && !organizationService.validateSlug(slug)) {
      setSlugError('Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only');
    } else if (slug) {
      setSlugError(null);
      // Auto-check availability for generated slug
      setCheckingSlug(true);
      try {
        const isAvailable = await organizationService.checkSlugAvailability(slug);
        setSlugAvailable(isAvailable);
        if (!isAvailable) {
          setSlugError(`${slug} is already taken`);
        }
      } catch (error) {
        console.error('Failed to check slug availability:', error);
      } finally {
        setCheckingSlug(false);
      }
    } else {
      setSlugError(null);
    }
  }, []);

  const handleSlugChange = useCallback((slug: string) => {
    setFormData(prev => ({ ...prev, slug }));
    setSlugAvailable(null); // Reset availability check

    if (slug && !organizationService.validateSlug(slug)) {
      setSlugError('Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only');
    } else {
      setSlugError(null);
    }
  }, []);

  const handleSlugBlur = useCallback(async () => {
    const slug = formData.slug;

    // Don't check if slug is invalid or empty
    if (!slug || !organizationService.validateSlug(slug)) {
      return;
    }

    setCheckingSlug(true);
    setSlugAvailable(null);

    try {
      const isAvailable = await organizationService.checkSlugAvailability(slug);
      setSlugAvailable(isAvailable);

      if (!isAvailable) {
        setSlugError(`${slug} is already taken`);
      } else {
        setSlugError(null);
      }
    } catch (error) {
      console.error('Failed to check slug availability:', error);
    } finally {
      setCheckingSlug(false);
    }
  }, [formData.slug]);

  const addInvite = () => {
    setInviteList(prev => [...prev, { email: '', role: InviteMemberRequestRoleEnum.Member }]);
  };

  const updateInvite = (index: number, field: 'email' | 'role', value: string | InviteMemberRequestRoleEnum) => {
    setInviteList(prev => prev.map((invite, i) =>
      i === index ? { ...invite, [field]: value } : invite
    ));
  };

  const removeInvite = (index: number) => {
    setInviteList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare final form data
      const validInvites = inviteList.filter(invite => invite.email.trim());
      const finalData: CreateOrganizationRequest = {
        ...formData,
        inviteEmails: validInvites.map(invite => invite.email),
        inviteRoles: validInvites.map(invite => invite.role)
      };

      const newOrg = await createOrganization(finalData);
      onSuccess?.(newOrg);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = formData.name.trim() && formData.slug.trim() && !slugError && slugAvailable !== false;
  const canCreateOrganization = canProceedToStep2;

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 text-primary-content">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create Organization</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost text-primary-content"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6 pb-4 bg-base-100 border-b border-base-300">
          <ul className="steps steps-horizontal w-full">
            <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Details</li>
            <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Team</li>
            <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Review</li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <TextInput
                label="Organization Name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Acme Corporation"
                required
              />

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    URL Slug <span className="text-error">*</span>
                  </span>
                </label>
                <div className="join w-full">
                  <span className="join-item btn btn-disabled no-animation bg-base-200 border-base-300">contentshare.app/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    onBlur={handleSlugBlur}
                    className={`input input-bordered join-item flex-1 ${
                      slugError ? 'input-error' :
                      slugAvailable === true ? 'input-success' : ''
                    }`}
                    placeholder="acme-corp"
                  />
                  {checkingSlug && (
                    <span className="join-item btn btn-disabled no-animation bg-base-200 border-base-300">
                      <span className="loading loading-spinner loading-xs"></span>
                    </span>
                  )}
                  {!checkingSlug && slugAvailable === true && (
                    <span className="join-item btn btn-disabled no-animation bg-success text-success-content border-success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                {slugError ? (
                  <label className="label">
                    <span className="label-text-alt text-error">{slugError}</span>
                  </label>
                ) : slugAvailable === true ? (
                  <label className="label">
                    <span className="label-text-alt text-success">{formData.slug} is available!</span>
                  </label>
                ) : (
                  <label className="label">
                    <span className="label-text-alt opacity-70">3-50 characters, lowercase, numbers, and hyphens</span>
                  </label>
                )}
              </div>

              <Textarea
                label="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Tell us about your organization..."
                showCharCount
                maxCharCount={500}
              />
            </div>
          )}

          {/* Step 2: Team Setup */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">You can skip this step and invite team members later from your organization settings.</span>
              </div>

              {inviteList.length > 0 ? (
                <div className="space-y-3">
                  {inviteList.map((invite, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <TextInput
                        label={index === 0 ? "Email Address" : undefined}
                        type="email"
                        value={invite.email}
                        onChange={(e) => updateInvite(index, 'email', e.target.value)}
                        placeholder="colleague@example.com"
                        containerClassName="flex-1"
                      />
                      <Select
                        label={index === 0 ? "Role" : undefined}
                        value={invite.role}
                        onChange={(e) => updateInvite(index, 'role', e.target.value as InviteMemberRequestRoleEnum)}
                        options={[
                          { value: InviteMemberRequestRoleEnum.Member, label: 'Member' },
                          { value: InviteMemberRequestRoleEnum.Admin, label: 'Admin' },
                        ]}
                        containerClassName="w-32"
                      />
                      <button
                        type="button"
                        onClick={() => removeInvite(index)}
                        className="btn btn-ghost btn-square text-error"
                        title="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-base-300 rounded-lg bg-base-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-sm opacity-60">No team members yet</p>
                </div>
              )}

              <button
                type="button"
                onClick={addInvite}
                className="btn btn-outline btn-block gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Team Member
              </button>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Organization Details</h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm opacity-70 mb-1">Organization Name</div>
                    <div className="text-lg font-medium">{formData.name}</div>
                  </div>

                  <div className="divider my-3"></div>

                  <div>
                    <div className="text-sm opacity-70 mb-1">URL</div>
                    <div className="font-mono text-sm">contentshare.app/{formData.slug}</div>
                  </div>

                  {formData.description && (
                    <>
                      <div className="divider my-3"></div>
                      <div>
                        <div className="text-sm opacity-70 mb-1">Description</div>
                        <div className="text-sm">{formData.description}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {inviteList.filter(i => i.email.trim()).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Team Members ({inviteList.filter(i => i.email.trim()).length})
                  </h3>
                  <div className="bg-base-200 rounded-lg p-4 space-y-2">
                    {inviteList.filter(i => i.email.trim()).map((invite, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{invite.email}</span>
                        <span className="badge badge-sm">{invite.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">You'll be automatically added as the organization owner with full permissions.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-base-300 p-4 bg-base-100">
          <div className="flex justify-between items-center">
            <button
              onClick={currentStep === 1 ? onClose : () => setCurrentStep(prev => prev - 1)}
              className="btn btn-ghost"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 1 && !canProceedToStep2}
                className="btn btn-primary"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canCreateOrganization}
                className="btn btn-primary"
              >
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
