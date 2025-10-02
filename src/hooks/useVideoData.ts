import { useState, useEffect } from 'react';
import { videoService } from '../services/videoService';
import { tagService } from '../services/tagService';
import type { VideoWithMetadataDTO, Tag } from '../generated';

interface UseVideoDataReturn {
  videoData: VideoWithMetadataDTO | null;
  presignedUrl: string | null;
  thumbnailUrl: string | null;
  videoTags: Tag[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useVideoData = (videoId: string | undefined): UseVideoDataReturn => {
  const [videoData, setVideoData] = useState<VideoWithMetadataDTO | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoTags, setVideoTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoData = async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [data, url, tags] = await Promise.all([
        videoService.getVideoWithMetadata(videoId),
        videoService.getVideoPresignedUrl(videoId),
        tagService.getVideoTags(videoId).catch(() => [])
      ]);

      setVideoData(data);
      setPresignedUrl(url);
      setVideoTags(tags);

      // Fetch thumbnail if available
      if (data.video?.thumbnailS3Path) {
        try {
          const thumb = await videoService.getThumbnailUrl(videoId);
          setThumbnailUrl(thumb);
        } catch (err) {
          console.error('Error fetching thumbnail:', err);
        }
      }
    } catch (err: any) {
      console.error('Error fetching video:', err);
      setError(err.response?.data?.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  return {
    videoData,
    presignedUrl,
    thumbnailUrl,
    videoTags,
    loading,
    error,
    refetch: fetchVideoData
  };
};
