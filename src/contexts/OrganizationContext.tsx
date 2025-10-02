import type {
    Organization,
    OrganizationInvitation,
    WorkspaceContext,
    CreateOrganizationRequest,
    InviteMemberRequest
} from '../types';
import { OrganizationMembershipRoleEnum, OrganizationResponseOrganizationTypeEnum } from '../generated';
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
    createOrganization: (request: CreateOrganizationRequest) => Promise<Organization>;
    inviteMember: (organizationId: string, request: InviteMemberRequest) => Promise<OrganizationInvitation>;
    acceptInvitation: (token: string) => Promise<void>;
    declineInvitation: (token: string) => Promise<void>;

    // Utilities
    hasPermissionInCurrentWorkspace: (permission: string) => boolean;
    getUserRoleInOrganization: (organizationId: string) => OrganizationMembershipRoleEnum | undefined;
    getPersonalWorkspace: () => WorkspaceContext | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
    children: ReactNode;
}

// Re-export useOrganization for convenience
// eslint-disable-next-line react-refresh/only-export-components
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
        if (!isAuthenticated || !user?.id) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const orgs = await organizationService.getUserOrganizations();
            setOrganizations(orgs);

            // Set default workspace to personal workspace if none selected
            if (!currentWorkspace && orgs.length > 0) {
                const personalOrg = orgs.find(org => org.organizationType === OrganizationResponseOrganizationTypeEnum.Personal);
                if (personalOrg) {
                    const workspace = createWorkspaceContext(personalOrg);
                    setCurrentWorkspace(workspace);
                } else {
                    // If no personal org, set the first organization as default
                    const workspace = createWorkspaceContext(orgs[0]);
                    setCurrentWorkspace(workspace);
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
    const createOrganization = async (request: CreateOrganizationRequest): Promise<Organization> => {
        const newOrg = await organizationService.createOrganization(request);
        await loadOrganizations(); // Refresh organizations list
        return newOrg;
    };

    // Invite member
    const inviteMember = async (organizationId: string, request: InviteMemberRequest): Promise<OrganizationInvitation> => {
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
        return membership?.role as OrganizationMembershipRoleEnum | undefined;
    };

    // Get personal workspace
    const getPersonalWorkspace = (): WorkspaceContext | null => {
        const personalOrg = organizations.find(org => org.organizationType === OrganizationResponseOrganizationTypeEnum.Personal);
        return personalOrg ? createWorkspaceContext(personalOrg) : null;
    };

    // Helper to create workspace context
    const createWorkspaceContext = (organization: Organization): WorkspaceContext => {
        // Get user role from organization's memberships array
        const membership = organization.memberships?.find(m => m.userId === user?.id);
        // Convert role to uppercase to match enum (API returns lowercase, enum is uppercase)
        const roleString = membership?.role?.toString().toUpperCase();
        const userRole = roleString as OrganizationMembershipRoleEnum | undefined;

        return {
            type: organization.organizationType === OrganizationResponseOrganizationTypeEnum.Personal ? 'personal' : 'organization',
            organization,
            currentUserRole: userRole,
            permissions: [] // Permissions are checked via hasPermission function
        };
    };

    // Load data on mount and when authentication changes
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            loadOrganizations();
            loadInvitations();
        } else if (!isAuthenticated) {
            setOrganizations([]);
            setCurrentWorkspaceState(null);
            setInvitations([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user?.id]);

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
            const personalOrg = organizations.find(org => org.organizationType === OrganizationResponseOrganizationTypeEnum.Personal);
            if (personalOrg) {
                setCurrentWorkspaceState(createWorkspaceContext(personalOrg));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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