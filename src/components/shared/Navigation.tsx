import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useOrganization } from '../../contexts';
import { CreateOrganizationModal } from '../organization/CreateOrganizationModal';
import Avatar from './Avatar';
import ThemeSwitcher from './ThemeSwitcher';
import { OrganizationMembershipRoleEnum } from '../../generated';

interface NavigationProps {
  showUploadButton?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ showUploadButton = true }) => {
  const auth = useAuth();
  const { user, logout, hasScope = () => false } = auth;
  const { organizations, currentWorkspace, setCurrentWorkspace } = useOrganization();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const switchToOrganization = (org: any) => {
    const workspace = {
      type: org.organizationType === 'PERSONAL' ? 'personal' : 'organization',
      organization: org,
      currentUserRole: undefined,
      permissions: []
    };
    setCurrentWorkspace(workspace);
  };

  const { hasPermissionInCurrentWorkspace } = useOrganization();

  // Platform admin check (from Cognito groups) - they have access to everything
  const isPlatformAdmin = hasScope('ROLE_PLATFORM_ADMIN');

  // Check if current user has admin permissions (or is platform admin)
  const canManageTags = isPlatformAdmin || hasPermissionInCurrentWorkspace('manage_tags');
  const canManageUploads = isPlatformAdmin || hasPermissionInCurrentWorkspace('manage_uploads');
  const canInviteMembers = isPlatformAdmin || hasPermissionInCurrentWorkspace('invite_members');
  const canUploadFiles = isPlatformAdmin || hasPermissionInCurrentWorkspace('upload_files');
  const hasViewAdmin = isPlatformAdmin || hasPermissionInCurrentWorkspace('view_admin');

  // Show admin dropdown if user has any admin permissions
  const showAdminDropdown = canManageTags || canManageUploads || canInviteMembers || hasViewAdmin || isPlatformAdmin;

  return (
    <>
      <div className="navbar bg-base-200 px-4 py-3">
        <div className="flex-1 gap-2">
          <Link to="/" className="btn btn-ghost text-xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">ContentShare</span>
          </Link>

          {/* Organization Dropdown - moved to left side */}
          {currentWorkspace ? (
            <div className="dropdown dropdown-bottom">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
                <Avatar name={currentWorkspace.organization.name} size="sm" />
                <span className="hidden md:inline max-w-[120px] truncate">{currentWorkspace.organization.name}</span>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-72 shadow-lg border border-base-300">
                <div className="px-4 py-2 border-b border-base-200">
                  <span className="text-xs uppercase font-semibold opacity-60">Workspaces</span>
                </div>
                <ul className="menu menu-sm p-2 w-full">
                {organizations.map((org) => (
                  <li key={org.id}>
                    <button
                      onClick={() => switchToOrganization(org)}
                      className={`justify-start gap-3 ${currentWorkspace?.organization.id === org.id ? 'active' : ''}`}
                    >
                      <Avatar name={org.name} size="sm" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{org.name}</div>
                        <div className="text-xs opacity-60">{org.organizationType === 'PERSONAL' ? 'Personal' : 'Team'}</div>
                      </div>
                      {currentWorkspace?.organization.id === org.id && (
                        <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
                </ul>
                <div className="border-t border-base-200"></div>
                <ul className="menu menu-sm p-2 w-full">
                  <li>
                    <button onClick={() => setShowCreateModal(true)} className="justify-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create workspace
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : organizations.length === 0 ? (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-ghost btn-sm">
              Create workspace
            </button>
          ) : null}
        </div>

        <div className="flex-none flex items-center space-x-2">

          {/* Admin Dropdown - only show if user has admin permissions */}
          {showAdminDropdown && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 shadow-lg border border-base-300">
                <div className="px-4 py-2 border-b border-base-200">
                  <span className="text-xs uppercase font-semibold opacity-60">Admin</span>
                </div>
                <ul className="menu menu-sm p-2 w-full">
                  {canManageUploads && (
                    <li>
                      <Link to="/admin/videos" className="justify-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Videos
                      </Link>
                    </li>
                  )}
                  {canManageTags && (
                    <li>
                      <Link to="/admin/tag-management" className="justify-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Tags
                      </Link>
                    </li>
                  )}
                  {/* Organization Members - only for users who can invite members */}
                  {canInviteMembers && (
                    <li>
                      <Link to="/admin/organization-members" className="justify-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Members
                      </Link>
                    </li>
                  )}
                  {/* Users menu item - only for platform admins */}
                  {isPlatformAdmin && (
                    <li>
                      <Link to="/admin/users" className="justify-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Users
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 shadow-lg border border-base-300">
              <div className="px-4 py-2 border-b border-base-200">
                <span className="text-xs uppercase font-semibold opacity-60">Account</span>
              </div>
              <div className="px-4 py-2 border-b border-base-200">
                <span className="text-sm font-medium break-all">{user?.username}</span>
              </div>
              <ul className="menu menu-sm p-2 w-full">
                <li>
                  <Link to="/" className="justify-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Videos
                  </Link>
                </li>
              </ul>
              <div className="border-t border-base-200"></div>
              <ul className="menu menu-sm p-2 w-full">
                <li>
                  <button onClick={handleLogout} className="justify-start gap-2 text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newOrg) => {
          switchToOrganization(newOrg);
          setShowCreateModal(false);
        }}
      />
    </>
  );
};

export default Navigation;