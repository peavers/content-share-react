import { generatedApiService } from './generatedApiService';
import type { SearchResponse } from '../generated';

export class SearchService {
  /**
   * Search across videos, users, and organizations
   */
  async search(query: string, limit: number = 10): Promise<SearchResponse> {
    const response = await generatedApiService.search.search(query, limit);
    return response.data;
  }
}

export const searchService = new SearchService();
