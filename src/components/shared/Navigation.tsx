import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useOrganization } from '../../contexts';
import { CreateOrganizationModal } from '../organization/CreateOrganizationModal';

interface NavigationProps {
  showUploadButton?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ showUploadButton = true }) => {
  const { user, logout } = useAuth();
  const { organizations, currentWorkspace, setCurrentWorkspace } = useOrganization();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOrgSwitcher(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setShowOrgSwitcher(false);
  };

  return (
    <>
      <header className="border-b border-black">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/dashboard" className="text-2xl font-light text-black hover:text-gray-600 transition-colors">
              ContentShare
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-8">
              {/* Upload Button */}
              {currentWorkspace && showUploadButton && location.pathname !== '/upload' && (
                <Link
                  to="/upload"
                  className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors duration-200"
                >
                  Upload Video
                </Link>
              )}

              {/* Back to Dashboard when on upload page */}
              {location.pathname === '/upload' && (
                <Link
                  to="/dashboard"
                  className="text-black border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors duration-200"
                >
                  ← Dashboard
                </Link>
              )}

              {/* Organization Dropdown or Create Button */}
              {currentWorkspace ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
                    className="flex items-center space-x-3 text-black hover:text-gray-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
                      {currentWorkspace.organization.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-light">{currentWorkspace.organization.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showOrgSwitcher ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {showOrgSwitcher && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-black shadow-lg z-50">
                      <div className="p-4 border-b border-gray-300">
                        <h3 className="font-light text-black mb-3">Switch Organization</h3>
                        <div className="space-y-2">
                          {organizations.map((org) => (
                            <button
                              key={org.id}
                              onClick={() => switchToOrganization(org)}
                              className={`w-full text-left p-3 border transition-colors duration-200 ${
                                currentWorkspace?.organization.id === org.id
                                  ? 'border-black bg-gray-50'
                                  : 'border-gray-300 hover:border-black'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
                                  {org.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-light text-black">{org.name}</div>
                                  <div className="text-sm text-gray-600 truncate">
                                    {org.description || 'No description'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {org.organizationType === 'PERSONAL' ? 'Personal Account' : 'Organization'}
                                  </div>
                                </div>
                                {currentWorkspace?.organization.id === org.id && (
                                  <svg className="h-4 w-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <button
                            onClick={() => {
                              setShowOrgSwitcher(false);
                              setShowCreateModal(true);
                            }}
                            className="w-full bg-black text-white px-4 py-3 hover:bg-gray-800 transition-colors duration-200"
                          >
                            Create New Organization
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : organizations.length === 0 ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors duration-200"
                >
                  Create Organization
                </button>
              ) : null}

              {/* User menu */}
              <span className="text-black font-light">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-black border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

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