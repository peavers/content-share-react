import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useOrganization } from '../../contexts';
import { CreateOrganizationModal } from '../organization/CreateOrganizationModal';
import Avatar from './Avatar';

interface NavigationProps {
  showUploadButton?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ showUploadButton = true }) => {
  const { user, logout } = useAuth();
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

  return (
    <>
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            ContentShare
          </Link>
        </div>

        <div className="flex-none">
          {/* Upload Button */}
          {currentWorkspace && showUploadButton && location.pathname !== '/upload' && (
            <Link to="/upload" className="btn btn-primary mr-2">
              Upload Video
            </Link>
          )}

          {/* Back to Videos when on upload page */}
          {location.pathname === '/upload' && (
            <Link to="/" className="btn btn-outline mr-2">
              Back to Videos
            </Link>
          )}

          {/* Organization Dropdown or Create Button */}
          {currentWorkspace ? (
            <div className="dropdown dropdown-end mr-2">
              <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
                <Avatar name={currentWorkspace.organization.name} size="sm" />
                <span>{currentWorkspace.organization.name}</span>
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-80 p-2 shadow-2xl">
                <li className="menu-title">
                  <span>Switch Organization</span>
                </li>
                {organizations.map((org) => (
                  <li key={org.id}>
                    <button
                      onClick={() => switchToOrganization(org)}
                      className={currentWorkspace?.organization.id === org.id ? 'active' : ''}
                    >
                      <Avatar name={org.name} size="sm" />
                      <div className="flex-1">
                        <div className="font-bold">{org.name}</div>
                        <div className="text-xs opacity-50">{org.organizationType === 'PERSONAL' ? 'Personal' : 'Organization'}</div>
                      </div>
                      {currentWorkspace?.organization.id === org.id && (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
                <li className="mt-2 border-t pt-2">
                  <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
                    Create New Organization
                  </button>
                </li>
              </ul>
            </div>
          ) : organizations.length === 0 ? (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              Create Organization
            </button>
          ) : null}

          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <Avatar name={user?.username || 'User'} size="md" rounded />
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-2xl">
              <li className="menu-title">
                <span className="break-all">{user?.username}</span>
              </li>
              <li><Link to="/">Videos</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
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