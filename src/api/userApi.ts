import type { UserResponse } from '../generated/models/user-response';
import type { UpdateUserProfileRequest } from '../generated/models/update-user-profile-request';
import { userApi } from '../services/generatedApiService';

export const getUserProfile = async (): Promise<UserResponse> => {
  const response = await userApi.getCurrentUser();
  return response.data;
};

export const updateUserProfile = async (data: UpdateUserProfileRequest): Promise<UserResponse> => {
  const response = await userApi.updateCurrentUser(data);
  return response.data;
};

export type { UserResponse, UpdateUserProfileRequest };
