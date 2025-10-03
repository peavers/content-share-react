// Types matching OpenSearch document structures

export interface VideoSearchResult {
  videoId: string;
  organizationId: string;
  organizationName: string | null;
  organizationType: string | null;
  userId: string;
  userEmail: string | null;
  userUsername: string | null;
  userFullName: string | null;
  title: string | null;
  description: string | null;
  originalFilename: string | null;
  fileSize: number | null;
  contentType: string | null;
  durationSeconds: number | null;
  width: number | null;
  height: number | null;
  uploadStatus: string | null;
  processingStatus: string | null;
  visibility: string | null;
  tags: string[];
  createdAt: string | null;
  updatedAt: string | null;
  searchableText: string;
}

export interface UserSearchResult {
  userId: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
  searchableText: string;
}

export interface OrganizationSearchResult {
  organizationId: string;
  name: string;
  description: string | null;
  organizationType: string | null;
  visibility: string | null;
  plan: string | null;
  usedStorageGb: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type SearchResult = VideoSearchResult | UserSearchResult | OrganizationSearchResult;

export interface SearchResponse {
  videos: VideoSearchResult[];
  users: UserSearchResult[];
  organizations: OrganizationSearchResult[];
  totalResults: number;
}
