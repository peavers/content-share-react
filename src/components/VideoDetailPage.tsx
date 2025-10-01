import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrganization } from '../contexts';
import Navigation from './shared/Navigation';
import { tagService } from '../services/tagService';
import { videoService } from '../services/videoService';
import type { Tag, VideoWithMetadataDTO } from '../generated';

const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { currentWorkspace } = useOrganization();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<VideoWithMetadataDTO | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchingMetadata, setRefetchingMetadata] = useState(false);
  const [videoTags, setVideoTags] = useState<Tag[]>([]);

  const video = videoData?.video;
  const metadata = videoData?.metadata;

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId || !currentWorkspace) return;

      try {
        setLoading(true);

        const data = await videoService.getVideoWithMetadata(parseInt(videoId));
        setVideoData(data);

        const url = await videoService.getVideoPresignedUrl(parseInt(videoId));
        setPresignedUrl(url);

        if (data.video?.thumbnailS3Path) {
          try {
            const thumb = await videoService.getThumbnailUrl(parseInt(videoId));
            setThumbnailUrl(thumb);
          } catch (err) {
            console.error('Error fetching thumbnail:', err);
          }
        }

        try {
          const tags = await tagService.getVideoTags(parseInt(videoId));
          setVideoTags(tags);
        } catch (tagErr) {
          console.error('Error fetching video tags:', tagErr);
        }
      } catch (err: any) {
        console.error('Error fetching video:', err);
        setError(err.response?.data?.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, currentWorkspace]);

  const handleRefetchMetadata = async () => {
    if (!videoId || !currentWorkspace) return;

    try {
      setRefetchingMetadata(true);
      const data = await videoService.getVideoWithMetadata(parseInt(videoId));
      setVideoData(data);

      if (data.video?.thumbnailS3Path && !thumbnailUrl) {
        try {
          const thumb = await videoService.getThumbnailUrl(parseInt(videoId));
          setThumbnailUrl(thumb);
        } catch (err) {
          console.error('Error fetching thumbnail:', err);
        }
      }
    } catch (err: any) {
      console.error('Error refetching metadata:', err);
    } finally {
      setRefetchingMetadata(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const formatBitrate = (bitrate: number): string => {
    if (!bitrate) return 'N/A';
    if (bitrate >= 1000000) {
      return `${(bitrate / 1000000).toFixed(2)} Mbps`;
    }
    return `${(bitrate / 1000).toFixed(0)} Kbps`;
  };

  const formatProcessingTime = (ms: number): string => {
    if (!ms) return 'N/A';
    const seconds = ms / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation showUploadButton={true} />
        <div className="flex items-center justify-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation showUploadButton={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Video not found'}</span>
          </div>
          <Link to="/" className="btn btn-ghost mt-4">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation showUploadButton={true} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/" className="btn btn-ghost mb-6">
          &larr; Back to Dashboard
        </Link>

        {/* Video Player Section */}
        <div className="mb-8">
          {presignedUrl && video.uploadStatus === 'COMPLETED' ? (
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
              <video
                controls
                className="w-full"
                style={{ maxHeight: '70vh' }}
                poster={thumbnailUrl || undefined}
              >
                <source src={presignedUrl} type={video.contentType} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="bg-base-100 rounded-xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                  {video.uploadStatus === 'PENDING' && <span className="loading loading-spinner loading-lg mb-4"></span>}
                  <p className="text-lg">
                    {video.uploadStatus === 'PENDING' ? 'Video is being processed...' : 'Video not available'}
                  </p>
                  <div className="badge badge-warning mt-4">Status: {video.uploadStatus}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Title and Meta */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{video.title}</h1>

          {videoTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {videoTags.map((tag) => {
                const segments = tag.path?.split('/').filter(p => p) || [];
                return (
                  <div key={tag.id} className="breadcrumbs text-sm bg-base-100 rounded-lg px-3 py-2 shadow">
                    <ul>
                      {segments.map((segment, index) => {
                        const pathUpToSegment = '/' + segments.slice(0, index + 1).join('/');
                        return (
                          <li key={index}>
                            <Link
                              to={`/?tag=${encodeURIComponent(pathUpToSegment)}`}
                              className="hover:text-primary"
                            >
                              {segment}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {video.description && (
            <p className="text-base opacity-80 whitespace-pre-wrap mb-4">{video.description}</p>
          )}

          <div className="flex flex-wrap gap-3 text-sm opacity-70">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(video.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {formatDuration(video.durationSeconds)}
            </div>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              {formatFileSize(video.fileSize)}
            </div>
            {video.width && video.height && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                {video.width} × {video.height}
              </div>
            )}
          </div>
        </div>

        {/* Rich Metadata Display */}
        {metadata ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Technical Information</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Stream Info */}
              <div className="bg-base-100 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  Video Stream
                </h3>
                <dl className="space-y-3">
                  {metadata.videoCodec && (
                    <div>
                      <dt className="text-sm opacity-60">Codec</dt>
                      <dd className="font-mono text-sm">{metadata.videoCodec}</dd>
                    </div>
                  )}
                  {metadata.videoBitrate && (
                    <div>
                      <dt className="text-sm opacity-60">Bitrate</dt>
                      <dd className="font-mono text-sm">{formatBitrate(metadata.videoBitrate)}</dd>
                    </div>
                  )}
                  {metadata.frameRate && (
                    <div>
                      <dt className="text-sm opacity-60">Frame Rate</dt>
                      <dd className="font-mono text-sm">{metadata.frameRate.toFixed(2)} fps</dd>
                    </div>
                  )}
                  {metadata.aspectRatio && (
                    <div>
                      <dt className="text-sm opacity-60">Aspect Ratio</dt>
                      <dd className="font-mono text-sm">{metadata.aspectRatio}</dd>
                    </div>
                  )}
                  {metadata.colorSpace && (
                    <div>
                      <dt className="text-sm opacity-60">Color Space</dt>
                      <dd className="font-mono text-sm">{metadata.colorSpace}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Audio Stream Info */}
              <div className="bg-base-100 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  Audio Stream
                </h3>
                {metadata.hasAudio === false ? (
                  <div className="text-center py-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    <p className="text-sm opacity-60">No audio stream</p>
                  </div>
                ) : (
                  <dl className="space-y-3">
                    {metadata.audioCodec && (
                      <div>
                        <dt className="text-sm opacity-60">Codec</dt>
                        <dd className="font-mono text-sm">{metadata.audioCodec}</dd>
                      </div>
                    )}
                    {metadata.audioBitrate && (
                      <div>
                        <dt className="text-sm opacity-60">Bitrate</dt>
                        <dd className="font-mono text-sm">{formatBitrate(metadata.audioBitrate)}</dd>
                      </div>
                    )}
                    {metadata.sampleRate && (
                      <div>
                        <dt className="text-sm opacity-60">Sample Rate</dt>
                        <dd className="font-mono text-sm">{(metadata.sampleRate / 1000).toFixed(1)} kHz</dd>
                      </div>
                    )}
                    {metadata.audioChannels && (
                      <div>
                        <dt className="text-sm opacity-60">Channels</dt>
                        <dd className="font-mono text-sm">{metadata.audioChannels}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>

              {/* Processing Info */}
              <div className="bg-base-100 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Processing
                </h3>
                <dl className="space-y-3">
                  {metadata.processingDurationMs && (
                    <div>
                      <dt className="text-sm opacity-60">Processing Time</dt>
                      <dd className="font-mono text-sm">{formatProcessingTime(metadata.processingDurationMs)}</dd>
                    </div>
                  )}
                  {metadata.ffmpegVersion && (
                    <div>
                      <dt className="text-sm opacity-60">FFmpeg Version</dt>
                      <dd className="font-mono text-sm">{metadata.ffmpegVersion}</dd>
                    </div>
                  )}
                  {metadata.thumbnailPath && (
                    <div>
                      <dt className="text-sm opacity-60">Thumbnail Generated</dt>
                      <dd className="text-sm">✓ Yes</dd>
                    </div>
                  )}
                  {metadata.processedAt && (
                    <div>
                      <dt className="text-sm opacity-60">Processed At</dt>
                      <dd className="text-sm">{formatDate(metadata.processedAt)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* File Details */}
              <div className="bg-base-100 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  File Details
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm opacity-60">Original Filename</dt>
                    <dd className="font-mono text-sm break-all">{video.originalFilename}</dd>
                  </div>
                  <div>
                    <dt className="text-sm opacity-60">Content Type</dt>
                    <dd className="font-mono text-sm">{video.contentType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm opacity-60">Storage</dt>
                    <dd className="font-mono text-xs break-all opacity-70">
                      s3://{video.s3Bucket}/{video.s3Key}
                    </dd>
                  </div>
                  {video.etag && (
                    <div>
                      <dt className="text-sm opacity-60">ETag</dt>
                      <dd className="font-mono text-xs break-all opacity-70">{video.etag}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex justify-center">
            <div className="bg-base-100 rounded-xl p-8 shadow-lg max-w-md text-center">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Processing Metadata</h3>
              <p className="text-sm opacity-70 mb-6">
                Your video is being processed. Technical metadata should be available really soon!
              </p>
              <button
                onClick={handleRefetchMetadata}
                disabled={refetchingMetadata}
                className="btn btn-primary"
              >
                {refetchingMetadata && <span className="loading loading-spinner"></span>}
                {refetchingMetadata ? 'Checking...' : 'Check Again'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoDetailPage;
