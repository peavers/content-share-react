import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../contexts';
import { organizationService } from '../../services/organizationService';
import Navigation from '../shared/Navigation';
import Avatar from '../shared/Avatar';

const OrganizationSettings: React.FC = () => {
  const { currentWorkspace, loadOrganizations } = useOrganization();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load current organization settings
  useEffect(() => {
    if (currentWorkspace?.organization) {
      setName(currentWorkspace.organization.name || '');
      setDescription(currentWorkspace.organization.description || '');
      setAvatarUrl(currentWorkspace.organization.avatarUrl || '');
    }
  }, [currentWorkspace]);

  const handleSave = async () => {
    if (!currentWorkspace?.organization?.id) return;

    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await organizationService.updateOrganization(
        currentWorkspace.organization.id,
        {
          name: name.trim(),
          description: description.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
        }
      );

      setSuccess(true);
      await loadOrganizations(); // Refresh organizations list

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating organization:', err);
      setError(err.response?.data?.message || 'Failed to update organization settings');
    } finally {
      setSaving(false);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="hero min-h-[calc(100vh-4rem)]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">No Organization Selected</h1>
              <p className="py-6">Please select an organization to manage its settings.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const organization = currentWorkspace.organization;

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <div className="alert alert-success mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Organization settings updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Avatar and Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Large Avatar */}
              <div className="mb-6">
                <Avatar
                  name={organization.name || 'Org'}
                  avatarUrl={avatarUrl || organization.avatarUrl}
                  size="2xl"
                />
              </div>

              {/* Organization Info */}
              <div className="space-y-1 mb-6">
                <h1 className="text-2xl font-bold">{organization.name}</h1>
                <p className="text-base-content/60">
                  {organization.organizationType === 'PERSONAL' ? 'Personal Organization' : 'Organization'}
                </p>
              </div>

              {/* Status Badges */}
              <div className="space-y-2 mb-6">
                {organization.isActive ? (
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base-content/70">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-base-content/70">Inactive</span>
                  </div>
                )}
              </div>

              <div className="divider my-4"></div>

              {/* Organization Details */}
              <div className="space-y-3 text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>{organization.slug || 'No slug'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{organization.visibility || 'Private'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Created {new Date(organization.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Edit Form */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="mb-6">
                  <h2 className="text-xl font-bold">Organization settings</h2>
                  <p className="text-sm text-base-content/60 mt-1">Manage your organization information</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                  {/* Organization Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Organization name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter organization name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description</span>
                      <span className="label-text-alt opacity-60">Optional</span>
                    </label>
                    <textarea
                      placeholder="Describe your organization..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="textarea textarea-bordered w-full"
                      rows={4}
                    />
                    <label className="label">
                      <span className="label-text-alt opacity-60">A brief description of your organization</span>
                    </label>
                  </div>

                  {/* Avatar URL */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Avatar URL</span>
                      <span className="label-text-alt opacity-60">Optional</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.png"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="input input-bordered w-full"
                    />
                    <label className="label">
                      <span className="label-text-alt opacity-60">Provide a URL to an image for your organization's avatar</span>
                    </label>
                  </div>

                  <div className="divider"></div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentWorkspace?.organization) {
                          setName(currentWorkspace.organization.name || '');
                          setDescription(currentWorkspace.organization.description || '');
                          setAvatarUrl(currentWorkspace.organization.avatarUrl || '');
                          setError(null);
                          setSuccess(false);
                        }
                      }}
                      className="btn btn-ghost"
                      disabled={saving}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className={`btn btn-primary ${saving ? 'loading' : ''}`}
                      disabled={saving}
                    >
                      {saving ? 'Updating settings...' : 'Update settings'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;
