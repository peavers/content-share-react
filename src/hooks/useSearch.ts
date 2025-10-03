import { useState, useCallback } from 'react';
import { searchService } from '../services/searchService';
import type { SearchResponse } from '../generated';

interface UseSearchReturn {
  results: SearchResponse | null;
  loading: boolean;
  error: string | null;
  search: (query: string, limit?: number) => Promise<void>;
}

export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, limit: number = 10) => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchService.search(query, limit);
      setResults(searchResults);
    } catch (err) {
      console.error('Error searching:', err);
      setError('Failed to search');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    search
  };
};
