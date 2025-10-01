import { generatedApiService } from './generatedApiService';
import type { CognitoUserDto, UserListResponse, UpdateUserRequest } from '../generated';

export class UserManagementService {
  /**
   * List all users with pagination
   */
  async listUsers(paginationToken?: string, limit: number = 60): Promise<UserListResponse> {
    const response = await generatedApiService.userManagement.listUsers(paginationToken, limit);
    return response.data;
  }

  /**
   * Get detailed information about a specific user
   */
  async getUser(username: string): Promise<CognitoUserDto> {
    const response = await generatedApiService.userManagement.getUser(username);
    return response.data;
  }

  /**
   * Update user details
   */
  async updateUser(username: string, updateRequest: UpdateUserRequest): Promise<CognitoUserDto> {
    const response = await generatedApiService.userManagement.updateUser(username, updateRequest);
    return response.data;
  }

  /**
   * Delete a user
   */
  async deleteUser(username: string): Promise<void> {
    await generatedApiService.userManagement.deleteUser(username);
  }

  /**
   * Add user to a group
   */
  async addUserToGroup(username: string, groupName: string): Promise<void> {
    await generatedApiService.userManagement.addUserToGroup(username, groupName);
  }

  /**
   * Remove user from a group
   */
  async removeUserFromGroup(username: string, groupName: string): Promise<void> {
    await generatedApiService.userManagement.removeUserFromGroup(username, groupName);
  }

  /**
   * Enable a user account
   */
  async enableUser(username: string): Promise<void> {
    await generatedApiService.userManagement.enableUser(username);
  }

  /**
   * Disable a user account
   */
  async disableUser(username: string): Promise<void> {
    await generatedApiService.userManagement.disableUser(username);
  }

  /**
   * List all available groups
   */
  async listGroups(): Promise<string[]> {
    const response = await generatedApiService.userManagement.listGroups();
    return response.data;
  }
}

export const userManagementService = new UserManagementService();
