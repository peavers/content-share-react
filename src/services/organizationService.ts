import type {
    CreateOrganizationRequest,
    InviteMemberRequest,
    Organization,
    OrganizationInvitation,
    OrganizationMembership
} from "../types";
import { OrganizationMembershipRoleEnum } from "../generated";
import { generatedApiService, getAuthenticatedAxios } from './generatedApiService';

class OrganizationService {

  // Organization management
  async getUserOrganizations(): Promise<Organization[]> {
    const response = await generatedApiService.organization.getUserOrganizations();
    return response.data;
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    const response = await generatedApiService.organization.getOrganization(organizationId);
    return response.data;
  }

  async createOrganization(request: CreateOrganizationRequest): Promise<Organization> {
    const response = await generatedApiService.organization.createOrganization(request);
    return response.data;
  }

  async updateOrganization(organizationId: string, request: Partial<CreateOrganizationRequest>): Promise<Organization> {
    const response = await generatedApiService.organization.updateOrganization({
      organizationId,
      createOrganizationRequest: request as CreateOrganizationRequest
    });
    return response.data;
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    await generatedApiService.organization.deleteOrganization(organizationId);
  }

  // Member management
  async getOrganizationMembers(organizationId: string): Promise<OrganizationMembership[]> {
    const response = await generatedApiService.organization.getOrganizationMembers(organizationId);
    return response.data;
  }

  async inviteMember(organizationId: string, request: InviteMemberRequest): Promise<OrganizationInvitation> {
    const response = await generatedApiService.organization.inviteMember(organizationId, request);
    return response.data;
  }

  async updateMemberRole(organizationId: string, targetUserId: string, role: OrganizationMembershipRoleEnum): Promise<OrganizationMembership> {
    const response = await generatedApiService.organization.updateMemberRole(
      organizationId,
      targetUserId,
      { role: role.toLowerCase() }
    );
    return response.data;
  }

  async removeMember(organizationId: string, targetUserId: string): Promise<void> {
    await generatedApiService.organization.removeMember(organizationId, targetUserId);
  }

  // Invitation management
  async getUserInvitations(): Promise<OrganizationInvitation[]> {
    const response = await generatedApiService.organization.getUserInvitations();
    return response.data;
  }

  async acceptInvitation(token: string): Promise<OrganizationMembership> {
    const response = await generatedApiService.organization.acceptInvitation(token);
    return response.data;
  }

  async declineInvitation(token: string): Promise<void> {
    await generatedApiService.organization.declineInvitation(token);
  }

  // Utility methods
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
  }

  async checkSlugAvailability(slug: string): Promise<boolean> {
    try {
      const axios = getAuthenticatedAxios();
      const response = await axios.get<{ available: boolean }>(
        `/api/organizations/check-slug/${encodeURIComponent(slug)}`
      );
      return response.data.available;
    } catch (error) {
      console.error('Failed to check slug availability:', error);
      return false;
    }
  }

  getStorageUsagePercentage(organization: Organization): number {
    const maxBytes = organization.maxStorageGb * 1024 * 1024 * 1024;
    return Math.round((organization.usedStorageBytes / maxBytes) * 100);
  }

  formatStorageSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  getRoleDisplayName(role: OrganizationMembershipRoleEnum): string {
    switch (role) {
      case OrganizationMembershipRoleEnum.Owner:
        return 'Owner';
      case OrganizationMembershipRoleEnum.Admin:
        return 'Admin';
      case OrganizationMembershipRoleEnum.Member:
        return 'Member';
      default:
        return 'Unknown';
    }
  }

  getRoleBadgeColor(role: OrganizationMembershipRoleEnum): string {
    switch (role) {
      case OrganizationMembershipRoleEnum.Owner:
        return 'bg-purple-100 text-purple-800';
      case OrganizationMembershipRoleEnum.Admin:
        return 'bg-blue-100 text-blue-800';
      case OrganizationMembershipRoleEnum.Member:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const organizationService = new OrganizationService();