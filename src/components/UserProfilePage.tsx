import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import Navigation from './shared/Navigation';
import Avatar from './shared/Avatar';
import { getUserProfile, updateUserProfile } from '../api/userApi';
import type { UserResponse } from '../generated';
import { fetchAuthSession } from 'aws-amplify/auth';

const UserProfilePage: React.FC = () => {
  const { user, logout, userScopes } = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [jwtClaims, setJwtClaims] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    avatarUrl: ''
  });

  useEffect(() => {
    loadProfile();
    loadJwtData();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        avatarUrl: data.avatarUrl || ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadJwtData = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken;
      if (token) {
        // Decode the JWT payload (it's base64 encoded)
        const payload = token.payload;
        setJwtClaims(payload);
      }
    } catch (err) {
      console.error('Error loading JWT data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updated = await updateUserProfile(formData);
      setProfile(updated);
      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="ml-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Profile not found'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
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
                <Avatar name={profile.username || 'User'} size="2xl" />
              </div>

              {/* User Info */}
              <div className="space-y-1 mb-6">
                <h1 className="text-2xl font-bold">{profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.username || 'Unknown User'}</h1>
                <p className="text-base-content/60">{profile.username}</p>
              </div>

              {/* Status Badges */}
              <div className="space-y-2 mb-6">
                {profile.emailVerified ? (
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base-content/70">Email verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-base-content/70">Email not verified</span>
                  </div>
                )}
              </div>

              <div className="divider my-4"></div>

              {/* Account Details */}
              <div className="space-y-3 text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{profile.email || 'No email'}</span>
                </div>

                {profile.lastLoginAt && (
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last active {new Date(profile.lastLoginAt).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Joined {new Date(profile.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>

              <div className="divider my-4"></div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>

          {/* Main Content - Edit Form */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="mb-6">
                  <h2 className="text-xl font-bold">Public profile</h2>
                  <p className="text-sm text-base-content/60 mt-1">This information will be displayed on your profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Last name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  {/* Username and Email Row (read-only) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Username</span>
                        <span className="label-text-alt opacity-60">Cannot be changed</span>
                      </label>
                      <input
                        type="text"
                        value={profile.username || ''}
                        disabled
                        className="input input-bordered bg-base-200/50"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                        <span className="label-text-alt opacity-60">Cannot be changed</span>
                      </label>
                      <input
                        type="email"
                        value={profile.email || ''}
                        disabled
                        className="input input-bordered bg-base-200/50"
                      />
                    </div>
                  </div>

                  {/* Avatar URL */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Avatar URL</span>
                      <span className="label-text-alt opacity-60">Optional</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      className="input input-bordered w-full"
                    />
                    <label className="label">
                      <span className="label-text-alt opacity-60">Provide a URL to an image for your avatar</span>
                    </label>
                  </div>

                  <div className="divider"></div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={`btn btn-primary ${saving ? 'loading' : ''}`}
                      disabled={saving}
                    >
                      {saving ? 'Updating profile...' : 'Update profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Authentication & Permissions Section */}
            <div className="card bg-base-100 shadow-xl mt-6">
              <div className="card-body">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">Authentication & Permissions</h2>
                  <p className="text-sm text-base-content/60 mt-1">Your access scopes and JWT information</p>
                </div>

                {/* User Scopes */}
                {userScopes && userScopes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Access Scopes</h3>
                    <div className="flex flex-wrap gap-2">
                      {userScopes.map((scope, index) => (
                        <div key={index} className="badge badge-primary badge-lg">
                          {scope}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* JWT Claims */}
                {jwtClaims && (
                  <div>
                    <h3 className="font-semibold mb-3">JWT Token Information</h3>
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <tbody>
                          {jwtClaims.sub && (
                            <tr>
                              <td className="font-medium">Subject (sub)</td>
                              <td className="font-mono text-xs">{jwtClaims.sub}</td>
                            </tr>
                          )}
                          {jwtClaims.email && (
                            <tr>
                              <td className="font-medium">Email</td>
                              <td>{jwtClaims.email}</td>
                            </tr>
                          )}
                          {jwtClaims['cognito:username'] && (
                            <tr>
                              <td className="font-medium">Cognito Username</td>
                              <td>{jwtClaims['cognito:username']}</td>
                            </tr>
                          )}
                          {jwtClaims['cognito:groups'] && (
                            <tr>
                              <td className="font-medium">Cognito Groups</td>
                              <td>
                                <div className="flex flex-wrap gap-1">
                                  {jwtClaims['cognito:groups'].map((group: string, idx: number) => (
                                    <span key={idx} className="badge badge-sm">{group}</span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                          {jwtClaims.iss && (
                            <tr>
                              <td className="font-medium">Issuer (iss)</td>
                              <td className="font-mono text-xs break-all">{jwtClaims.iss}</td>
                            </tr>
                          )}
                          {jwtClaims.iat && (
                            <tr>
                              <td className="font-medium">Issued At</td>
                              <td>{new Date(jwtClaims.iat * 1000).toLocaleString()}</td>
                            </tr>
                          )}
                          {jwtClaims.exp && (
                            <tr>
                              <td className="font-medium">Expires At</td>
                              <td>{new Date(jwtClaims.exp * 1000).toLocaleString()}</td>
                            </tr>
                          )}
                          {jwtClaims.token_use && (
                            <tr>
                              <td className="font-medium">Token Use</td>
                              <td>{jwtClaims.token_use}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
