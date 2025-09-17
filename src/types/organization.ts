// Organization-related utility types and enums
// Note: Main types (User, Organization, etc.) are now imported from generated API types
import type { Organization } from '../generated';

export interface WorkspaceContext {
  type: 'personal' | 'organization';
  organization: Organization;
  currentUserRole?: MemberRole;
  permissions: string[];
}

// Enums
export enum OrganizationType {
  PERSONAL = 'PERSONAL',
  ORGANIZATION = 'ORGANIZATION'
}

export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export enum MemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED'
}

// Permission system
export const PERMISSIONS = {
  [MemberRole.OWNER]: [
    'manage_org',
    'delete_org',
    'invite_members',
    'remove_members',
    'manage_uploads',
    'view_analytics',
    'manage_billing'
  ],
  [MemberRole.ADMIN]: [
    'invite_members',
    'remove_members',
    'manage_uploads',
    'view_analytics'
  ],
  [MemberRole.MEMBER]: [
    'view_uploads',
    'upload_files'
  ]
};

export function hasPermission(role: MemberRole | undefined, permission: string): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(permission) || false;
}