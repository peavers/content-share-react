import React, { useEffect, useState } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { CreateOrganizationModal } from './CreateOrganizationModal';
import { InviteMemberModal } from './InviteMemberModal';

interface OrganizationMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  status: 'active' | 'pending' | 'suspended';
}

interface OrganizationInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export const OrganizationPage: React.FC = () => {
  const { currentWorkspace, organizations, createOrganization, inviteMember } = useOrganization();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'invitations' | 'settings'>('overview');
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentWorkspace && currentWorkspace.type === 'organization') {
      loadOrganizationData();
    }
  }, [currentWorkspace]);

  const loadOrganizationData = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      setMembers([
        {
          id: '1',
          userId: 'user1',
          username: 'john.doe',
          email: 'john@company.com',
          role: 'owner',
          joinedAt: '2024-01-15T10:00:00Z',
          status: 'active'
        },
        {
          id: '2',
          userId: 'user2',
          username: 'alice.smith',
          email: 'alice@company.com',
          role: 'admin',
          joinedAt: '2024-02-01T14:30:00Z',
          status: 'active'
        },
        {
          id: '3',
          userId: 'user3',
          username: 'bob.wilson',
          email: 'bob@company.com',
          role: 'member',
          joinedAt: '2024-02-15T09:15:00Z',
          status: 'active'
        }
      ]);

      setInvitations([
        {
          id: '1',
          email: 'sarah@company.com',
          role: 'member',
          invitedBy: 'john.doe',
          status: 'pending',
          createdAt: '2024-03-01T10:00:00Z',
          expiresAt: '2024-03-08T10:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (data: { name: string; description: string }) => {
    try {
      await createOrganization(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleInviteMember = async (data: { email: string; role: 'admin' | 'member' }) => {
    if (!currentWorkspace) return;

    try {
      await inviteMember(currentWorkspace.organization.id, {
        email: data.email,
        role: data.role.toUpperCase()
      });
      setShowInviteModal(false);
      loadOrganizationData();
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!currentWorkspace) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Organization Selected</h3>
          <p className="text-gray-600 mb-6">Create a new organization or select an existing one to manage members and settings.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  if (currentWorkspace.organizationType === 'personal') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Workspace</h3>
          <p className="text-gray-600 mb-6">This is your personal workspace. Create an organization to collaborate with team members.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentWorkspace.name}</h1>
            <p className="mt-2 text-gray-600">{currentWorkspace.description || 'Manage your organization settings and members'}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Invite Member</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Organization</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'members', name: 'Members', icon: '👥' },
            { id: 'invitations', name: 'Invitations', icon: '✉️' },
            { id: 'settings', name: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Organization Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-3xl font-bold text-gray-900">{members.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Invitations</p>
                  <p className="text-3xl font-bold text-gray-900">{invitations.filter(inv => inv.status === 'pending').length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-3xl font-bold text-gray-900 capitalize">{currentWorkspace.plan || 'Basic'}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentWorkspace.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Visibility</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentWorkspace.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentWorkspace.visibility || 'Private'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentWorkspace.createdAt ? formatDate(currentWorkspace.createdAt) : 'Unknown'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Storage Used</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentWorkspace.usedStorageBytes || 0} bytes of {currentWorkspace.maxStorageGb || 100} GB
                </dd>
              </div>
              {currentWorkspace.description && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentWorkspace.description}</dd>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Organization Members</h3>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Invite Member
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                          <span className="text-sm font-medium text-gray-700">
                            {member.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.username}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.joinedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {member.role !== 'owner' && (
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'invitations' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Send Invitation
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invited By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invitation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(invitation.role)}`}>
                        {invitation.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invitation.invitedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invitation.expiresAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {invitations.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No pending invitations
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Settings</h3>
            <p className="text-gray-600">Organization settings management coming soon...</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateOrganizationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrganization}
        />
      )}

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteMember}
        />
      )}
    </div>
  );
};

export default OrganizationPage;