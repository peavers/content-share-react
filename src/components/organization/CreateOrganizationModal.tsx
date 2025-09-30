import React, { useState, useCallback } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { organizationService } from '../../services/organizationService';
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

interface FormData extends CreateOrganizationRequest {
  inviteEmails: string[];
  inviteRoles: InviteMemberRequestRoleEnum[];
}

export function CreateOrganizationModal({ isOpen, onClose, onSuccess }: CreateOrganizationModalProps) {
  const { createOrganization } = useOrganization();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
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
    }
  }, [isOpen]);

  // Auto-generate slug from name
  const handleNameChange = useCallback((name: string) => {
    const slug = organizationService.generateSlug(name);
    setFormData(prev => ({ ...prev, name, slug }));

    if (slug && !organizationService.validateSlug(slug)) {
      setSlugError('Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only');
    } else {
      setSlugError(null);
    }
  }, []);

  const handleSlugChange = useCallback((slug: string) => {
    setFormData(prev => ({ ...prev, slug }));

    if (slug && !organizationService.validateSlug(slug)) {
      setSlugError('Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only');
    } else {
      setSlugError(null);
    }
  }, []);

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

  const canProceedToStep2 = formData.name.trim() && formData.slug.trim() && !slugError;
  const canCreateOrganization = canProceedToStep2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-black px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-black">Create Organization</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-8">
            <div className="flex items-center space-x-8">
              <StepIndicator step={1} current={currentStep} label="Basic Info" />
              <div className="flex-1 h-px bg-gray-300">
                <div
                  className={`h-full bg-black transition-all ${currentStep >= 2 ? 'w-full' : 'w-0'}`}
                />
              </div>
              <StepIndicator step={2} current={currentStep} label="Team Setup" />
              <div className="flex-1 h-px bg-gray-300">
                <div
                  className={`h-full bg-black transition-all ${currentStep >= 3 ? 'w-full' : 'w-0'}`}
                />
              </div>
              <StepIndicator step={3} current={currentStep} label="Review" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-8 p-4 border border-red-300 bg-red-50">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {currentStep === 1 && (
            <OrganizationBasicInfo
              formData={formData}
              onNameChange={handleNameChange}
              onSlugChange={handleSlugChange}
              onDescriptionChange={(description) => setFormData(prev => ({ ...prev, description }))}
              onVisibilityChange={(visibility) => setFormData(prev => ({ ...prev, visibility }))}
              slugError={slugError}
            />
          )}

          {currentStep === 2 && (
            <TeamSetupStep
              inviteList={inviteList}
              onAddInvite={addInvite}
              onUpdateInvite={updateInvite}
              onRemoveInvite={removeInvite}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              formData={formData}
              inviteList={inviteList}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black px-8 py-6 flex justify-between">
          <button
            onClick={currentStep === 1 ? onClose : () => setCurrentStep(prev => prev - 1)}
            className="text-black border-b border-black hover:border-gray-600 transition-colors duration-200"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex space-x-4">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 1 && !canProceedToStep2}
                className="bg-black text-white px-8 py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canCreateOrganization}
                className="bg-black text-white px-8 py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step, current, label }: { step: number; current: number; label: string }) {
  const isCompleted = current > step;
  const isCurrent = current === step;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 border flex items-center justify-center text-sm font-light transition-colors duration-200 ${
          isCompleted
            ? 'bg-black text-white border-black'
            : isCurrent
            ? 'bg-white text-black border-black'
            : 'bg-white text-gray-500 border-gray-300'
        }`}
      >
        {isCompleted ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          step
        )}
      </div>
      <span className="mt-2 text-xs font-light text-gray-600">{label}</span>
    </div>
  );
}

function OrganizationBasicInfo({
  formData,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
  onVisibilityChange,
  slugError
}: {
  formData: FormData;
  onNameChange: (name: string) => void;
  onSlugChange: (slug: string) => void;
  onDescriptionChange: (description: string) => void;
  onVisibilityChange: (visibility: CreateOrganizationRequestVisibilityEnum) => void;
  slugError: string | null;
}) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-light text-black mb-4">
          Organization name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
          placeholder="My Organization"
        />
      </div>

      <div>
        <label className="block text-sm font-light text-black mb-4">
          Organization slug *
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-4 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm">
            yourapp.com/
          </span>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className={`flex-1 px-4 py-3 border focus:border-black focus:outline-none transition-colors duration-200 ${
              slugError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="my-organization"
          />
        </div>
        {slugError && (
          <p className="mt-2 text-sm text-red-600">{slugError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-light text-black mb-4">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
          placeholder="Brief description of your organization..."
        />
      </div>

      <div>
        <label className="block text-sm font-light text-black mb-4">
          Visibility
        </label>
        <div className="space-y-4">
          {Object.values(CreateOrganizationRequestVisibilityEnum).map((visibility) => (
            <label key={visibility} className="flex items-start border border-gray-300 p-4 hover:border-black cursor-pointer transition-colors duration-200">
              <input
                type="radio"
                name="visibility"
                value={visibility}
                checked={formData.visibility === visibility}
                onChange={(e) => onVisibilityChange(e.target.value as CreateOrganizationRequestVisibilityEnum)}
                className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <div className="ml-4">
                <span className="text-sm font-light text-black">
                  {visibility === CreateOrganizationRequestVisibilityEnum.Public ? 'Public' : 'Private'}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {visibility === CreateOrganizationRequestVisibilityEnum.Public
                    ? 'Anyone can see and join this organization'
                    : 'Only invited members can access this organization'
                  }
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamSetupStep({
  inviteList,
  onAddInvite,
  onUpdateInvite,
  onRemoveInvite
}: {
  inviteList: Array<{ email: string; role: InviteMemberRequestRoleEnum }>;
  onAddInvite: () => void;
  onUpdateInvite: (index: number, field: 'email' | 'role', value: string | InviteMemberRequestRoleEnum) => void;
  onRemoveInvite: (index: number) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-light text-black mb-4">Invite team members</h3>
        <p className="text-sm text-gray-600">
          Invite people to join your organization. You can always add more members later.
        </p>
      </div>

      <div className="space-y-4">
        {inviteList.map((invite, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="email"
              value={invite.email}
              onChange={(e) => onUpdateInvite(index, 'email', e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
            />
            <select
              value={invite.role}
              onChange={(e) => onUpdateInvite(index, 'role', e.target.value as InviteMemberRequestRoleEnum)}
              className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
            >
              <option value={InviteMemberRequestRoleEnum.Member}>Member</option>
              <option value={InviteMemberRequestRoleEnum.Admin}>Admin</option>
            </select>
            <button
              onClick={() => onRemoveInvite(index)}
              className="p-2 text-gray-400 hover:text-black transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onAddInvite}
        className="flex items-center space-x-2 text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add another member</span>
      </button>
    </div>
  );
}

function ReviewStep({
  formData,
  inviteList
}: {
  formData: FormData;
  inviteList: Array<{ email: string; role: InviteMemberRequestRoleEnum }>;
}) {
  const validInvites = inviteList.filter(invite => invite.email.trim());

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-light text-black">Review and create</h3>
      </div>

      <div className="border border-black p-6 space-y-4">
        <div>
          <h4 className="font-light text-lg text-black">{formData.name}</h4>
          <p className="text-sm text-gray-600 mt-1">@{formData.slug}</p>
        </div>

        {formData.description && (
          <div className="pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-600">{formData.description}</p>
          </div>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-600 pt-4 border-t border-gray-300">
          <span className="capitalize">{formData.visibility.toLowerCase()}</span>
          <span>•</span>
          <span>Basic plan</span>
        </div>
      </div>

      {validInvites.length > 0 && (
        <div>
          <h4 className="font-light text-black mb-4">
            Team members ({validInvites.length})
          </h4>
          <div className="space-y-2">
            {validInvites.map((invite, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-4 border border-gray-300">
                <span className="text-sm text-black">{invite.email}</span>
                <span className="text-xs text-gray-600 capitalize">
                  {organizationService.getRoleDisplayName(invite.role as any)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}