// Minimal organization utility types - use generated types where possible
import type { Organization } from '../generated';
import { OrganizationMembershipRoleEnum } from '../generated';

// Simple workspace context - just wraps the generated Organization
export interface WorkspaceContext {
  type: 'personal' | 'organization';
  organization: Organization;
  currentUserRole?: OrganizationMembershipRoleEnum;
  permissions: string[];
}

// Permission system using generated role enum
export const PERMISSIONS = {
  [OrganizationMembershipRoleEnum.Owner]: [
    'manage_org',
    'delete_org',
    'invite_members',
    'remove_members',
    'manage_uploads',
    'view_analytics',
    'manage_billing'
  ],
  [OrganizationMembershipRoleEnum.Admin]: [
    'invite_members',
    'remove_members',
    'manage_uploads',
    'view_analytics'
  ],
  [OrganizationMembershipRoleEnum.Member]: [
    'view_uploads',
    'upload_files'
  ]
};

export function hasPermission(role: OrganizationMembershipRoleEnum | undefined, permission: string): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(permission) || false;
}