import { generatedApiService, getAuthenticatedAxios } from './generatedApiService';
import type {
  OrganizationMembership,
  InviteMemberRequest,
  OrganizationInvitation,
  UpdateMemberRoleRequest,
  OrganizationMembershipRoleEnum
} from '../generated';

export class OrganizationMemberService {
  /**
   * Get all members of an organization
   */
  async getMembers(organizationId: string): Promise<OrganizationMembership[]> {
    const response = await generatedApiService.organization.getOrganizationMembers({ organizationId });
    return response.data;
  }

  /**
   * Invite a new member to the organization
   */
  async inviteMember(
    organizationId: string,
    email: string,
    role: OrganizationMembershipRoleEnum
  ): Promise<OrganizationInvitation> {
    const request: InviteMemberRequest = { email, role };
    const response = await generatedApiService.organization.inviteMember({ organizationId, inviteMemberRequest: request });
    return response.data;
  }

  /**
   * Update a member's role in the organization
   */
  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: OrganizationMembershipRoleEnum
  ): Promise<OrganizationMembership> {
    const request: UpdateMemberRoleRequest = { role };
    const response = await generatedApiService.organization.updateMemberRole({
      organizationId,
      targetUserId: userId,
      updateMemberRoleRequest: request
    });
    return response.data;
  }

  /**
   * Remove a member from the organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    await generatedApiService.organization.removeMember({ organizationId, targetUserId: userId });
  }

  /**
   * Get pending invitations for the organization
   */
  async getPendingInvitations(organizationId: string): Promise<OrganizationInvitation[]> {
    const response = await generatedApiService.organization.getOrganizationInvitations({ organizationId });
    return response.data;
  }

  /**
   * Cancel/delete a pending invitation
   */
  async cancelInvitation(organizationId: string, invitationId: number): Promise<void> {
    const axios = getAuthenticatedAxios();
    await axios.delete(
      `/api/organizations/${organizationId}/invitations/${invitationId}`
    );
  }
}

export const organizationMemberService = new OrganizationMemberService();
