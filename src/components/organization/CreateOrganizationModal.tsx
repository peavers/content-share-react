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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Organization</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <StepIndicator step={1} current={currentStep} label="Basic Info" />
              <div className="flex-1 h-0.5 bg-gray-200">
                <div
                  className={`h-full bg-indigo-600 transition-all ${currentStep >= 2 ? 'w-full' : 'w-0'}`}
                />
              </div>
              <StepIndicator step={2} current={currentStep} label="Team Setup" />
              <div className="flex-1 h-0.5 bg-gray-200">
                <div
                  className={`h-full bg-indigo-600 transition-all ${currentStep >= 3 ? 'w-full' : 'w-0'}`}
                />
              </div>
              <StepIndicator step={3} current={currentStep} label="Review" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
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
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <button
            onClick={currentStep === 1 ? onClose : () => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex space-x-3">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 1 && !canProceedToStep2}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canCreateOrganization}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          isCompleted
            ? 'bg-indigo-600 text-white'
            : isCurrent
            ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {isCompleted ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          step
        )}
      </div>
      <span className="mt-1 text-xs font-medium text-gray-500">{label}</span>
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="My Organization"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization slug *
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            yourapp.com/
          </span>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 ${
              slugError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="my-organization"
          />
        </div>
        {slugError && (
          <p className="mt-1 text-sm text-red-600">{slugError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Brief description of your organization..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <div className="space-y-3">
          {Object.values(CreateOrganizationRequestVisibilityEnum).map((visibility) => (
            <label key={visibility} className="flex items-start">
              <input
                type="radio"
                name="visibility"
                value={visibility}
                checked={formData.visibility === visibility}
                onChange={(e) => onVisibilityChange(e.target.value as CreateOrganizationRequestVisibilityEnum)}
                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">
                  {visibility === CreateOrganizationRequestVisibilityEnum.Public ? 'Public' : 'Private'}
                </span>
                <p className="text-sm text-gray-500">
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Invite team members</h3>
        <p className="text-sm text-gray-600 mb-4">
          Invite people to join your organization. You can always add more members later.
        </p>
      </div>

      <div className="space-y-3">
        {inviteList.map((invite, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="email"
              value={invite.email}
              onChange={(e) => onUpdateInvite(index, 'email', e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              value={invite.role}
              onChange={(e) => onUpdateInvite(index, 'role', e.target.value as InviteMemberRequestRoleEnum)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={InviteMemberRequestRoleEnum.Member}>Member</option>
              <option value={InviteMemberRequestRoleEnum.Admin}>Admin</option>
            </select>
            <button
              onClick={() => onRemoveInvite(index)}
              className="p-2 text-gray-400 hover:text-red-600"
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
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50"
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Review and create</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">{formData.name}</h4>
          <p className="text-sm text-gray-600">@{formData.slug}</p>
        </div>

        {formData.description && (
          <div>
            <p className="text-sm text-gray-600">{formData.description}</p>
          </div>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="capitalize">{formData.visibility.toLowerCase()}</span>
          <span>•</span>
          <span>Basic plan</span>
        </div>
      </div>

      {validInvites.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Team members ({validInvites.length})
          </h4>
          <div className="space-y-2">
            {validInvites.map((invite, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-900">{invite.email}</span>
                <span className="text-xs text-gray-500 capitalize">
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