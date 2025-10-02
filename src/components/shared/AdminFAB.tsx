import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useOrganization } from '../../contexts';

const AdminFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const { hasScope = () => false } = auth;
  const { hasPermissionInCurrentWorkspace } = useOrganization();

  // Platform admin check (from Cognito groups) - they have access to everything
  const isPlatformAdmin = hasScope('ROLE_PLATFORM_ADMIN');

  // Check if current user has admin permissions (or is platform admin)
  const canManageTags = isPlatformAdmin || hasPermissionInCurrentWorkspace('manage_tags');
  const canManageUploads = isPlatformAdmin || hasPermissionInCurrentWorkspace('manage_uploads');
  const canInviteMembers = isPlatformAdmin || hasPermissionInCurrentWorkspace('invite_members');
  const hasViewAdmin = isPlatformAdmin || hasPermissionInCurrentWorkspace('view_admin');

  // Show admin FAB if user has any admin permissions
  const showAdminFAB = canManageTags || canManageUploads || canInviteMembers || hasViewAdmin || isPlatformAdmin;

  // Don't render if user doesn't have admin permissions
  if (!showAdminFAB) return null;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Speed Dial Menu Items */}
      <div className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-200 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>

        {/* Platform Admin - Users */}
        {isPlatformAdmin && (
          <Link
            to="/admin/users"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="tooltip tooltip-left" data-tip="Users">
              <button className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </Link>
        )}

        {/* Organization Members */}
        {canInviteMembers && (
          <Link
            to="/admin/organization-members"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="tooltip tooltip-left" data-tip="Members">
              <button className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </Link>
        )}

        {/* Tags Management */}
        {canManageTags && (
          <Link
            to="/admin/tag-management"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="tooltip tooltip-left" data-tip="Tags">
              <button className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </button>
            </div>
          </Link>
        )}

        {/* Videos Management */}
        {canManageUploads && (
          <Link
            to="/admin/videos"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="tooltip tooltip-left" data-tip="Videos">
              <button className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </Link>
        )}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className={`btn btn-circle btn-lg shadow-xl hover:shadow-2xl transition-all duration-300 ${
          isOpen ? 'btn-secondary rotate-45' : 'btn-accent'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>

      {/* Backdrop to close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={closeMenu}
        />
      )}
    </div>
  );
};

export default AdminFAB;
