import { generatedApiService } from './generatedApiService';
import type { Tag } from '../generated';

export class TagService {
  /**
   * Get all tags for the current organization
   */
  async getAllTags(): Promise<Tag[]> {
    const response = await generatedApiService.tag.getAllTags();
    return response.data;
  }

  /**
   * Get hierarchical tag tree
   */
  async getTagTree(): Promise<any[]> {
    const response = await generatedApiService.tag.getTagTree();
    return response.data;
  }

  /**
   * Get root level tags
   */
  async getRootTags(): Promise<Tag[]> {
    const response = await generatedApiService.tag.getRootTags();
    return response.data;
  }

  /**
   * Get child tags for a given parent path
   */
  async getChildTags(parentPath: string): Promise<Tag[]> {
    const response = await generatedApiService.tag.getChildTags(parentPath);
    return response.data;
  }

  /**
   * Create or get a tag by path
   */
  async createTag(request: { path: string; description?: string; color?: string }): Promise<Tag> {
    const response = await generatedApiService.tag.createTag({
      path: request.path,
      description: request.description,
      color: request.color
    });
    return response.data;
  }

  /**
   * Update a tag
   */
  async updateTag(tagId: number, request: { path: string; description?: string }): Promise<Tag> {
    const response = await generatedApiService.tag.updateTag(tagId, {
      path: request.path,
      description: request.description
    });
    return response.data;
  }

  /**
   * Delete a tag by ID
   */
  async deleteTag(tagId: number): Promise<void> {
    await generatedApiService.tag.deleteTagById(tagId);
  }

  /**
   * Delete a tag by path
   */
  async deleteTagByPath(path: string, deleteChildren: boolean = false): Promise<void> {
    await generatedApiService.tag.deleteTag(path, deleteChildren);
  }

  /**
   * Get tags for a specific video
   */
  async getVideoTags(videoId: number): Promise<Tag[]> {
    const response = await generatedApiService.tag.getVideoTags(videoId);
    return response.data;
  }

  /**
   * Add tags to a video
   */
  async addTagsToVideo(videoId: number, tagPaths: string[]): Promise<void> {
    await generatedApiService.tag.addTagsToVideo(videoId, { tagPaths });
  }

  /**
   * Replace all tags on a video
   */
  async replaceVideoTags(videoId: number, tagPaths: string[]): Promise<void> {
    await generatedApiService.tag.replaceVideoTags(videoId, { tagPaths });
  }

  /**
   * Remove a tag from a video
   */
  async removeTagFromVideo(videoId: number, path: string): Promise<void> {
    await generatedApiService.tag.removeTagFromVideo(videoId, path);
  }
}

export const tagService = new TagService();
