import { useState, useRef, useEffect } from 'react';
import { useOrganization } from '../../contexts';
import type { Organization, WorkspaceContext } from '../../types';
import { OrganizationResponseOrganizationTypeEnum } from '../../generated';
import { CreateOrganizationModal } from './CreateOrganizationModal';

interface GitHubStyleOrgSwitcherProps {
  className?: string;
}

export function GitHubStyleOrgSwitcher({ className = '' }: GitHubStyleOrgSwitcherProps) {
  const {
    organizations,
    currentWorkspace,
    setCurrentWorkspace,
    loading
  } = useOrganization();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleOrgSwitch = (organization: Organization) => {
    const workspace: WorkspaceContext = {
      type: organization.organizationType === OrganizationResponseOrganizationTypeEnum.Personal ? 'personal' : 'organization',
      organization,
      currentUserRole: undefined,
      permissions: []
    };
    setCurrentWorkspace(workspace);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const personalOrgs = filteredOrganizations.filter(
    org => org.organizationType === OrganizationResponseOrganizationTypeEnum.Personal
  );
  const teamOrgs = filteredOrganizations.filter(
    org => org.organizationType === OrganizationResponseOrganizationTypeEnum.Organization
  );

  if (loading || !currentWorkspace) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Current org button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
      >
        <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-600">
          {currentWorkspace.organization.name.charAt(0).toUpperCase()}
        </div>
        <span className="truncate flex-1 text-left">
          {currentWorkspace.organization.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Find organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Organizations list */}
          <div className="max-h-64 overflow-y-auto">
            {/* Personal */}
            {personalOrgs.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  Personal Account
                </div>
                {personalOrgs.map((org) => (
                  <OrganizationOption
                    key={org.id}
                    organization={org}
                    isSelected={org.id === currentWorkspace.organization.id}
                    onClick={() => handleOrgSwitch(org)}
                  />
                ))}
              </div>
            )}

            {/* Organizations */}
            {teamOrgs.length > 0 && (
              <div>
                {personalOrgs.length > 0 && <div className="border-t border-gray-200" />}
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  Organizations
                </div>
                {teamOrgs.map((org) => (
                  <OrganizationOption
                    key={org.id}
                    organization={org}
                    isSelected={org.id === currentWorkspace.organization.id}
                    onClick={() => handleOrgSwitch(org)}
                  />
                ))}
              </div>
            )}

            {/* No results */}
            {filteredOrganizations.length === 0 && searchQuery && (
              <div className="px-3 py-8 text-center text-sm text-gray-500">
                No organizations found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Create org button */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowCreateModal(true);
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="w-6 h-6 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              Create organization
            </button>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newOrganization) => {
          handleOrgSwitch(newOrganization);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}

interface OrganizationOptionProps {
  organization: Organization;
  isSelected: boolean;
  onClick: () => void;
}

function OrganizationOption({ organization, isSelected, onClick }: OrganizationOptionProps) {
  const isPersonal = organization.organizationType === OrganizationResponseOrganizationTypeEnum.Personal;

  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-3 text-left hover:bg-gray-50 flex items-center focus:outline-none focus:bg-gray-50 transition-colors duration-150 ${
        isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
      }`}
    >
      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 ${
        isPersonal ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
      }`}>
        {isPersonal ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        ) : (
          organization.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium truncate ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}>
            {organization.name}
          </p>
          {isSelected && (
            <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        {!isPersonal && (
          <p className="text-xs text-gray-500 mt-0.5">
            {/* Members count not available */}
          </p>
        )}
      </div>
    </button>
  );
}