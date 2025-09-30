import {useOrganization} from '../../contexts';
import {useEffect, useRef, useState} from "react";
import type {Organization, WorkspaceContext} from "../../types";
import {OrganizationResponseOrganizationTypeEnum} from "../../generated";
import {CreateOrganizationModal} from './CreateOrganizationModal';


interface WorkspaceSelectorProps {
    className?: string;
}

export function WorkspaceSelector({className = ''}: WorkspaceSelectorProps) {
    const {
        organizations,
        currentWorkspace,
        setCurrentWorkspace,
        loading
    } = useOrganization();

    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleWorkspaceChange = (organization: Organization) => {
        const workspace: WorkspaceContext = {
            type: organization.organizationType === OrganizationResponseOrganizationTypeEnum.Personal ? 'personal' : 'organization',
            organization,
            currentUserRole: undefined, // Will be set by context
            permissions: []
        };
        setCurrentWorkspace(workspace);
        setIsOpen(false);
    };

    if (loading || !currentWorkspace) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    const personalOrgs = organizations.filter(org => org.organizationType === OrganizationResponseOrganizationTypeEnum.Personal);
    const teamOrgs = organizations.filter(org => org.organizationType === OrganizationResponseOrganizationTypeEnum.Organization);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Current workspace display */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <OrganizationAvatar organization={currentWorkspace.organization} size="sm"/>
                <span className="truncate max-w-32">
          {currentWorkspace.organization.name}
        </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                        {/* Personal workspace section */}
                        {personalOrgs.length > 0 && (
                            <>
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Personal
                                </div>
                                {personalOrgs.map((org) => (
                                    <WorkspaceOption
                                        key={org.id}
                                        organization={org}
                                        isSelected={org.id === currentWorkspace.organization.id}
                                        onClick={() => handleWorkspaceChange(org)}
                                    />
                                ))}
                            </>
                        )}

                        {/* Team organizations section */}
                        {teamOrgs.length > 0 && (
                            <>
                                {personalOrgs.length > 0 && <div className="border-t border-gray-200 my-1"></div>}
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Organizations
                                </div>
                                {teamOrgs.map((org) => (
                                    <WorkspaceOption
                                        key={org.id}
                                        organization={org}
                                        isSelected={org.id === currentWorkspace.organization.id}
                                        onClick={() => handleWorkspaceChange(org)}
                                    />
                                ))}
                            </>
                        )}

                        {/* Create new organization option */}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setShowCreateModal(true);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                            <div
                                className="w-6 h-6 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 4v16m8-8H4"/>
                                </svg>
                            </div>
                            <span>Create organization</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Create Organization Modal */}
            <CreateOrganizationModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={(newOrganization) => {
                    // Switch to the newly created organization
                    const workspace: WorkspaceContext = {
                        type: newOrganization.organizationType === OrganizationResponseOrganizationTypeEnum.Personal ? 'personal' : 'organization',
                        organization: newOrganization,
                        currentUserRole: undefined, // Will be set by context
                        permissions: []
                    };
                    setCurrentWorkspace(workspace);
                    setShowCreateModal(false);
                }}
            />
        </div>
    );
}

interface WorkspaceOptionProps {
    organization: Organization;
    isSelected: boolean;
    onClick: () => void;
}

function WorkspaceOption({organization, isSelected, onClick}: WorkspaceOptionProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
        >
            <OrganizationAvatar organization={organization} size="sm"/>
            <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{organization.name}</div>
                {organization.organizationType === OrganizationResponseOrganizationTypeEnum.Organization && (
                    <div className="text-xs text-gray-500">
                        {organization.memberCount || 0} member{(organization.memberCount || 0) !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
            {isSelected && (
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            )}
        </button>
    );
}

interface OrganizationAvatarProps {
    organization: Organization;
    size: 'sm' | 'md' | 'lg';
    className?: string;
}

export function OrganizationAvatar({organization, size, className = ''}: OrganizationAvatarProps) {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-lg'
    };

    if (organization.avatarUrl) {
        return (
            <img
                src={organization.avatarUrl}
                alt={organization.name}
                className={`${sizeClasses[size]} rounded ${className}`}
            />
        );
    }

    // Generate avatar based on organization type and name
    const isPersonal = organization.organizationType === OrganizationResponseOrganizationTypeEnum.Personal;
    const initial = organization.name.charAt(0).toUpperCase();
    const bgColor = isPersonal ? 'bg-blue-500' : 'bg-purple-500';

    return (
        <div
            className={`${sizeClasses[size]} ${bgColor} text-white rounded flex items-center justify-center font-medium ${className}`}
        >
            {isPersonal ? (
                <svg className="w-3/4 h-3/4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            ) : (
                initial
            )}
        </div>
    );
}