import { useState, useEffect, useCallback } from 'react';
import { tagService } from '../services/tagService';
import type { Tag } from '../generated';

interface UseTagsReturn {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTags = (organizationId: string | undefined): UseTagsReturn => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedTags = await tagService.getAllTags();
      setTags(fetchedTags);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags
  };
};
