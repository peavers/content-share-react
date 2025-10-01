import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../contexts';
import { organizationMemberService } from '../../services/organizationMemberService';
import type { OrganizationMembership, OrganizationMembershipRoleEnum, OrganizationInvitation } from '../../generated';
import { TextInput, Select } from '../forms';

const OrganizationMembers: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [members, setMembers] = useState<OrganizationMembership[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<OrganizationInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrganizationMembershipRoleEnum>('MEMBER');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [currentWorkspace]);

  const loadMembers = async () => {
    if (!currentWorkspace?.organization?.id) {
      setError('No organization selected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [membersData, invitationsData] = await Promise.all([
        organizationMemberService.getMembers(currentWorkspace.organization.id),
        organizationMemberService.getPendingInvitations(currentWorkspace.organization.id)
      ]);
      setMembers(membersData);
      setPendingInvitations(invitationsData);
    } catch (err: any) {
      console.error('Failed to load members:', err);
      setError(err.response?.data?.message || 'Failed to load organization members');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!currentWorkspace?.organization?.id || !inviteEmail.trim()) {
      return;
    }

    const email = inviteEmail.trim().toLowerCase();

    // Check if email is already a member
    const existingMember = members.find(m => m.user?.email?.toLowerCase() === email);
    if (existingMember) {
      alert(`${email} is already a member of this organization`);
      return;
    }

    // Check if email already has a pending invitation
    const existingInvitation = pendingInvitations.find(inv => inv.email?.toLowerCase() === email);
    if (existingInvitation) {
      alert(`${email} already has a pending invitation`);
      return;
    }

    try {
      setInviting(true);
      await organizationMemberService.inviteMember(
        currentWorkspace.organization.id,
        email,
        inviteRole
      );
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('MEMBER');
      await loadMembers();
    } catch (err: any) {
      console.error('Failed to invite member:', err);
      alert(err.response?.data?.message || 'Failed to invite member');
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: OrganizationMembershipRoleEnum) => {
    if (!currentWorkspace?.organization?.id) return;

    try {
      await organizationMemberService.updateMemberRole(
        currentWorkspace.organization.id,
        userId,
        newRole
      );
      await loadMembers();
    } catch (err: any) {
      console.error('Failed to update role:', err);
      alert(err.response?.data?.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (userId: string, username: string) => {
    if (!currentWorkspace?.organization?.id) return;

    if (!confirm(`Are you sure you want to remove ${username} from this organization?`)) {
      return;
    }

    try {
      await organizationMemberService.removeMember(currentWorkspace.organization.id, userId);
      await loadMembers();
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleCancelInvitation = async (invitationId: number, email: string) => {
    if (!currentWorkspace?.organization?.id) return;

    if (!confirm(`Are you sure you want to cancel the invitation for ${email}?`)) {
      return;
    }

    try {
      await organizationMemberService.cancelInvitation(currentWorkspace.organization.id, invitationId);
      await loadMembers();
    } catch (err: any) {
      console.error('Failed to cancel invitation:', err);
      alert(err.response?.data?.message || 'Failed to cancel invitation');
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'badge-error';
      case 'ADMIN':
        return 'badge-warning';
      case 'MEMBER':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Organization Members</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage members of {currentWorkspace?.organization?.name}
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn btn-primary gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite Member
          </button>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Pending Invitations ({pendingInvitations.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Invited</th>
                      <th>Expires</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingInvitations.map((invitation) => (
                      <tr key={invitation.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="badge badge-warning badge-sm">Pending</div>
                            {invitation.email}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-sm ${getRoleBadgeClass(invitation.role || 'MEMBER')}`}>
                            {invitation.role}
                          </span>
                        </td>
                        <td>
                          {invitation.createdAt ? new Date(invitation.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          {invitation.expiresAt ? new Date(invitation.expiresAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <button
                            onClick={() => handleCancelInvitation(invitation.id!, invitation.email!)}
                            className="btn btn-ghost btn-sm text-error"
                            title="Cancel invitation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Active Members */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="opacity-60">No members found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span className="text-sm">
                                  {member.user?.username?.substring(0, 2).toUpperCase() || '??'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{member.user?.username || 'Unknown'}</div>
                              <div className="text-sm opacity-50">{member.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td>{member.user?.email || 'N/A'}</td>
                        <td>
                          <select
                            className={`select select-sm select-bordered ${getRoleBadgeClass(member.role || '')}`}
                            value={member.role || 'MEMBER'}
                            onChange={(e) => handleUpdateRole(member.userId!, e.target.value as OrganizationMembershipRoleEnum)}
                            disabled={member.role === 'OWNER'}
                          >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                            <option value="OWNER">Owner</option>
                          </select>
                        </td>
                        <td>
                          {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <button
                            onClick={() => handleRemoveMember(member.userId!, member.user?.username || 'this user')}
                            className="btn btn-ghost btn-sm text-error"
                            disabled={member.role === 'OWNER'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Invite New Member</h3>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                  setInviteRole('MEMBER');
                }}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={inviting}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <TextInput
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                helperText="We'll send an invitation email to this address"
                required
              />

              <Select
                label="Role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as OrganizationMembershipRoleEnum)}
                options={[
                  { value: 'MEMBER', label: 'Member - Read-only access' },
                  { value: 'ADMIN', label: 'Admin - Can manage members and upload content' },
                  { value: 'OWNER', label: 'Owner - Full control' }
                ]}
                required
              />
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                  setInviteRole('MEMBER');
                }}
                className="btn btn-ghost"
                disabled={inviting}
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                className="btn btn-primary"
                disabled={inviting || !inviteEmail.trim()}
              >
                {inviting && <span className="loading loading-spinner"></span>}
                {inviting ? 'Inviting...' : 'Send Invitation'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowInviteModal(false)}></div>
        </div>
      )}
    </>
  );
};

export default OrganizationMembers;
