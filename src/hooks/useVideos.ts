import { useState, useEffect, useCallback } from 'react';
import { videoService } from '../services/videoService';
import { tagService } from '../services/tagService';
import type { Video } from '../types';
import type { Tag } from '../generated';

interface UseVideosReturn {
  videos: Video[];
  videoTagsMap: Map<number, Tag[]>;
  thumbnailUrlsMap: Map<number, string>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useVideos = (organizationId: string | undefined): UseVideosReturn => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoTagsMap, setVideoTagsMap] = useState<Map<number, Tag[]>>(new Map());
  const [thumbnailUrlsMap, setThumbnailUrlsMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedVideos = await videoService.getOrganizationVideos();
      setVideos(fetchedVideos);

      // Fetch tags and thumbnails for all videos in parallel
      const videoIds = fetchedVideos.filter(v => v.id).map(v => v.id!);

      const tagsPromises = videoIds.map(id =>
        tagService.getVideoTags(id).catch(err => {
          console.error(`Error fetching tags for video ${id}:`, err);
          return [];
        })
      );

      const thumbnailPromises = fetchedVideos
        .filter(v => v.id && v.thumbnailS3Path)
        .map(v =>
          videoService.getThumbnailUrl(v.id!).catch(err => {
            console.error(`Error fetching thumbnail for video ${v.id}:`, err);
            return null;
          })
        );

      const [tagsResults, thumbnailResults] = await Promise.all([
        Promise.all(tagsPromises),
        Promise.all(thumbnailPromises)
      ]);

      // Build maps
      const tagsMap = new Map<number, Tag[]>();
      videoIds.forEach((id, index) => {
        tagsMap.set(id, tagsResults[index]);
      });

      const thumbnailsMap = new Map<number, string>();
      let thumbnailIndex = 0;
      fetchedVideos.forEach(video => {
        if (video.id && video.thumbnailS3Path && thumbnailResults[thumbnailIndex]) {
          thumbnailsMap.set(video.id, thumbnailResults[thumbnailIndex]!);
          thumbnailIndex++;
        }
      });

      setVideoTagsMap(tagsMap);
      setThumbnailUrlsMap(thumbnailsMap);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    videoTagsMap,
    thumbnailUrlsMap,
    loading,
    error,
    refetch: fetchVideos
  };
};
