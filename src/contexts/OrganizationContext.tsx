import type {
    Organization,
    OrganizationInvitation,
    WorkspaceContext
} from '../types';
import { OrganizationMembershipRoleEnum, OrganizationOrganizationTypeEnum } from '../generated';
import { hasPermission } from '../types';
import {organizationService} from '../services/organizationService';
import {useAuth} from './AuthContext';
import {createContext, type ReactNode, useEffect, useState} from "react";

interface OrganizationContextType {
    // State
    organizations: Organization[];
    currentWorkspace: WorkspaceContext | null;
    invitations: OrganizationInvitation[];
    loading: boolean;
    error: string | null;

    // Actions
    loadOrganizations: () => Promise<void>;
    loadInvitations: () => Promise<void>;
    setCurrentWorkspace: (workspace: WorkspaceContext) => void;
    createOrganization: (request: any) => Promise<Organization>;
    inviteMember: (organizationId: string, request: any) => Promise<OrganizationInvitation>;
    acceptInvitation: (token: string) => Promise<void>;
    declineInvitation: (token: string) => Promise<void>;

    // Utilities
    hasPermissionInCurrentWorkspace: (permission: string) => boolean;
    getUserRoleInOrganization: (organizationId: string) => OrganizationMembershipRoleEnum | undefined;
    getPersonalWorkspace: () => WorkspaceContext | null;
}

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
    children: ReactNode;
}

// Re-export useOrganization for convenience
export { useOrganization } from './useOrganization';

export function OrganizationProvider({children}: OrganizationProviderProps) {
    const {user, isAuthenticated} = useAuth();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [currentWorkspace, setCurrentWorkspaceState] = useState<WorkspaceContext | null>(null);
    const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load user's organizations
    const loadOrganizations = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            const orgs = await organizationService.getUserOrganizations();
            setOrganizations(orgs);

            // Set default workspace to personal workspace if none selected
            if (!currentWorkspace && orgs.length > 0) {
                const personalOrg = orgs.find(org => org.organizationType === OrganizationOrganizationTypeEnum.Personal);
                if (personalOrg) {
                    setCurrentWorkspace(createWorkspaceContext(personalOrg));
                }
            }
        } catch (err) {
            setError('Failed to load organizations');
            console.error('Error loading organizations:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load user's invitations
    const loadInvitations = async () => {
        if (!isAuthenticated) return;

        try {
            const invs = await organizationService.getUserInvitations();
            setInvitations(invs);
        } catch (err) {
            console.error('Error loading invitations:', err);
        }
    };

    // Set current workspace
    const setCurrentWorkspace = (workspace: WorkspaceContext) => {
        setCurrentWorkspaceState(workspace);
        localStorage.setItem('currentWorkspace', JSON.stringify({
            organizationId: workspace.organization.id,
            type: workspace.type
        }));
    };

    // Create new organization
    const createOrganization = async (request: any): Promise<Organization> => {
        const newOrg = await organizationService.createOrganization(request);
        await loadOrganizations(); // Refresh organizations list
        return newOrg;
    };

    // Invite member
    const inviteMember = async (organizationId: string, request: any): Promise<OrganizationInvitation> => {
        return await organizationService.inviteMember(organizationId, request);
    };

    // Accept invitation
    const acceptInvitation = async (token: string): Promise<void> => {
        await organizationService.acceptInvitation(token);
        await loadOrganizations();
        await loadInvitations();
    };

    // Decline invitation
    const declineInvitation = async (token: string): Promise<void> => {
        await organizationService.declineInvitation(token);
        await loadInvitations();
    };

    // Check if user has permission in current workspace
    const hasPermissionInCurrentWorkspace = (permission: string): boolean => {
        if (!currentWorkspace?.currentUserRole) return false;
        return hasPermission(currentWorkspace.currentUserRole, permission);
    };

    // Get user's role in specific organization
    const getUserRoleInOrganization = (organizationId: string): OrganizationMembershipRoleEnum | undefined => {
        const org = organizations.find(o => o.id === organizationId);
        if (!org?.memberships || !user?.id) return undefined;

        const membership = org.memberships.find(m => m.userId === user.id);
        return membership?.role;
    };

    // Get personal workspace
    const getPersonalWorkspace = (): WorkspaceContext | null => {
        const personalOrg = organizations.find(org => org.organizationType === OrganizationOrganizationTypeEnum.Personal);
        return personalOrg ? createWorkspaceContext(personalOrg) : null;
    };

    // Helper to create workspace context
    const createWorkspaceContext = (organization: Organization): WorkspaceContext => {
        const userRole = getUserRoleInOrganization(organization.id);
        return {
            type: organization.organizationType === OrganizationOrganizationTypeEnum.Personal ? 'personal' : 'organization',
            organization,
            currentUserRole: userRole,
            permissions: userRole ? (hasPermission as any)(userRole, '') || [] : []
        };
    };

    // Load data on mount and when authentication changes
    useEffect(() => {
        if (isAuthenticated) {
            loadOrganizations();
            loadInvitations();
        } else {
            setOrganizations([]);
            setCurrentWorkspaceState(null);
            setInvitations([]);
        }
    }, [isAuthenticated]);

    // Restore workspace from localStorage
    useEffect(() => {
        if (organizations.length > 0 && !currentWorkspace) {
            const saved = localStorage.getItem('currentWorkspace');
            if (saved) {
                try {
                    const {organizationId} = JSON.parse(saved);
                    const org = organizations.find(o => o.id === organizationId);
                    if (org) {
                        setCurrentWorkspaceState(createWorkspaceContext(org));
                        return;
                    }
                } catch (err) {
                    console.error('Error restoring workspace:', err);
                }
            }

            // Fallback to personal workspace
            const personalOrg = organizations.find(org => org.organizationType === OrganizationOrganizationTypeEnum.Personal);
            if (personalOrg) {
                setCurrentWorkspaceState(createWorkspaceContext(personalOrg));
            }
        }
    }, [organizations]);

    const value: OrganizationContextType = {
        organizations,
        currentWorkspace,
        invitations,
        loading,
        error,
        loadOrganizations,
        loadInvitations,
        setCurrentWorkspace,
        createOrganization,
        inviteMember,
        acceptInvitation,
        declineInvitation,
        hasPermissionInCurrentWorkspace,
        getUserRoleInOrganization,
        getPersonalWorkspace
    };

    return (
        <OrganizationContext.Provider value={value}>
            {children}
        </OrganizationContext.Provider>
    );
}

// Hook is exported from a separate module to maintain Fast Refresh compatibility
// Use the hook from './useOrganization' instead