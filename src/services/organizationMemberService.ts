import { generatedApiService } from './generatedApiService';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type {
  OrganizationMembership,
  InviteMemberRequest,
  OrganizationInvitation,
  UpdateMemberRoleRequest,
  OrganizationMembershipRoleEnum
} from '../generated';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class OrganizationMemberService {
  /**
   * Get all members of an organization
   */
  async getMembers(organizationId: string): Promise<OrganizationMembership[]> {
    const response = await generatedApiService.organization.getOrganizationMembers(organizationId);
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
    const response = await generatedApiService.organization.inviteMember(organizationId, request);
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
    const response = await generatedApiService.organization.updateMemberRole(
      organizationId,
      userId,
      request
    );
    return response.data;
  }

  /**
   * Remove a member from the organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    await generatedApiService.organization.removeMember(organizationId, userId);
  }

  /**
   * Get pending invitations for the organization
   */
  async getPendingInvitations(organizationId: string): Promise<OrganizationInvitation[]> {
    const response = await generatedApiService.organization.getOrganizationInvitations(organizationId);
    return response.data;
  }

  /**
   * Cancel/delete a pending invitation
   */
  async cancelInvitation(organizationId: string, invitationId: number): Promise<void> {
    const session = await fetchAuthSession();
    const token = session?.tokens?.idToken?.toString();

    await axios.delete(
      `${API_BASE_URL}/api/organizations/${organizationId}/invitations/${invitationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}

export const organizationMemberService = new OrganizationMemberService();
