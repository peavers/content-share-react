import React, { useEffect, useState } from 'react';
import { useOrganization } from '../../contexts';
import { userManagementService } from '../../services/userManagementService';
import type { CognitoUserDto } from '../../generated';
import Navigation from '../shared/Navigation';

const UserManagement: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [users, setUsers] = useState<CognitoUserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationToken, setPaginationToken] = useState<string | undefined>();
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<CognitoUserDto | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchUsers();
      fetchGroups();
    }
  }, [currentWorkspace]);

  const fetchUsers = async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userManagementService.listUsers(token);
      setUsers(response.users);
      setPaginationToken(response.paginationToken);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const groups = await userManagementService.listGroups();
      setAvailableGroups(groups);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await userManagementService.deleteUser(username);
      await fetchUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleEnabled = async (user: CognitoUserDto) => {
    try {
      if (user.enabled) {
        await userManagementService.disableUser(user.username);
      } else {
        await userManagementService.enableUser(user.username);
      }
      await fetchUsers();
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleOpenEditModal = (user: CognitoUserDto) => {
    setSelectedUser(user);
    setEditEmail(user.email);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      await userManagementService.updateUser(selectedUser.username, {
        email: editEmail !== selectedUser.email ? editEmail : undefined,
      });
      setShowEditModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleOpenGroupModal = async (user: CognitoUserDto) => {
    setSelectedUser(user);
    // Fetch fresh user data to get current groups
    try {
      const freshUser = await userManagementService.getUser(user.username);
      setSelectedGroups(freshUser.groups);
      setShowGroupModal(true);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError(err.response?.data?.message || 'Failed to load user details');
    }
  };

  const handleSaveGroups = async () => {
    if (!selectedUser) return;

    try {
      const currentGroups = selectedUser.groups;
      const groupsToAdd = selectedGroups.filter(g => !currentGroups.includes(g));
      const groupsToRemove = currentGroups.filter(g => !selectedGroups.includes(g));

      await userManagementService.updateUser(selectedUser.username, {
        groupsToAdd,
        groupsToRemove,
      });

      setShowGroupModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      console.error('Error updating user groups:', err);
      setError(err.response?.data?.message || 'Failed to update user groups');
    }
  };

  const toggleGroup = (groupName: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const getGroupInfo = (groupName: string) => {
    const groupDefinitions: Record<string, {
      name: string;
      level: string;
      badgeColor: string;
      description: string;
      permissions: string[];
    }> = {
      'PLATFORM_ADMIN': {
        name: 'Platform Administrator',
        level: 'System',
        badgeColor: 'badge-error',
        description: 'Full system access across all organizations. Can manage all users, groups, and platform settings.',
        permissions: ['Manage Users', 'Manage Groups', 'System Settings', 'Cross-Org Access']
      },
      'SUPPORT': {
        name: 'Support Staff',
        level: 'System',
        badgeColor: 'badge-info',
        description: 'Read-only access to user information for customer support purposes.',
        permissions: ['View Users', 'View Organizations', 'Read-Only Access']
      },
      'DEVELOPER': {
        name: 'Developer',
        level: 'System',
        badgeColor: 'badge-secondary',
        description: 'Technical access for development and debugging purposes.',
        permissions: ['API Access', 'Debug Tools', 'View Logs']
      }
    };

    return groupDefinitions[groupName] || {
      name: groupName,
      level: 'Custom',
      badgeColor: 'badge-ghost',
      description: `Custom role: ${groupName}`,
      permissions: ['Custom Permissions']
    };
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'badge-success';
      case 'UNCONFIRMED':
        return 'badge-warning';
      case 'ARCHIVED':
        return 'badge-error';
      default:
        return 'badge-ghost';
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
              <p className="py-6">Please select an organization to manage users.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage Cognito users and their permissions
            </p>
          </div>
          <button
            onClick={() => fetchUsers()}
            className="btn btn-outline gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-sm btn-ghost">
              Dismiss
            </button>
          </div>
        )}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-3">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <p>No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Groups</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.username} className="hover">
                        <td className="font-medium">{user.username}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            {user.email}
                            {user.emailVerified && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                              {user.status}
                            </span>
                            {!user.enabled && (
                              <span className="badge badge-error">Disabled</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-1 flex-wrap">
                            {user.groups.length > 0 ? (
                              user.groups.map(group => (
                                <span key={group} className="badge badge-primary badge-sm">
                                  {group}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs opacity-60">No groups</span>
                            )}
                          </div>
                        </td>
                        <td className="text-sm opacity-60">
                          {new Date(user.createdDate).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="btn btn-ghost btn-xs"
                              title="Edit user"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleOpenGroupModal(user)}
                              className="btn btn-ghost btn-xs"
                              title="Manage groups"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleToggleEnabled(user)}
                              className={`btn btn-ghost btn-xs ${!user.enabled ? 'text-success' : 'text-warning'}`}
                              title={user.enabled ? 'Disable user' : 'Enable user'}
                            >
                              {user.enabled ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.username)}
                              className="btn btn-ghost btn-xs text-error"
                              title="Delete user"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {paginationToken && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => fetchUsers(paginationToken)}
                      className="btn btn-outline btn-sm"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit User: {selectedUser.username}</h3>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>

            <div className="modal-action">
              <button onClick={handleSaveEdit} className="btn btn-primary">
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowEditModal(false)} />
        </div>
      )}

      {/* Manage Groups Modal */}
      {showGroupModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-2">Manage Platform Roles</h3>
            <p className="text-sm opacity-60 mb-6">
              Assign platform-level permissions to <span className="font-semibold">{selectedUser.username}</span>
            </p>

            {availableGroups.length > 0 ? (
              <div className="space-y-3">
                {availableGroups.map(group => {
                  const isSelected = selectedGroups.includes(group);
                  const groupInfo = getGroupInfo(group);

                  return (
                    <div
                      key={group}
                      className={`card bg-base-200 cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary' : 'hover:bg-base-300'
                      }`}
                      onClick={() => toggleGroup(group)}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary mt-1"
                            checked={isSelected}
                            onChange={() => toggleGroup(group)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-base">{groupInfo.name}</h4>
                              <span className={`badge badge-sm ${groupInfo.badgeColor}`}>
                                {groupInfo.level}
                              </span>
                            </div>
                            <p className="text-sm opacity-70 mt-1">{groupInfo.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {groupInfo.permissions.map((permission, idx) => (
                                <span key={idx} className="badge badge-outline badge-xs">
                                  {permission}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm opacity-60 mt-2">No platform roles available</p>
              </div>
            )}

            <div className="modal-action mt-6">
              <button onClick={handleSaveGroups} className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setSelectedUser(null);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowGroupModal(false)} />
        </div>
      )}
    </div>
  );
};

export default UserManagement;
