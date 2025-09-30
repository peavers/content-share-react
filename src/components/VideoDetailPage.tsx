import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrganization } from '../contexts';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import Navigation from './shared/Navigation';
import { tagService } from '../services/tagService';
import type { Tag } from '../generated';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface Video {
  id: number;
  organizationId: string;
  userId: string;
  title: string;
  description: string;
  s3Bucket: string;
  s3Key: string;
  fileSize: number;
  contentType: string;
  originalFilename: string;
  etag: string;
  uploadId: string;
  durationSeconds: number;
  width: number;
  height: number;
  thumbnailS3Path: string;
  uploadStatus: string;
  processingStatus: string;
  visibility: string;
  sharedWith: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { currentWorkspace } = useOrganization();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [videoTags, setVideoTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId || !currentWorkspace) return;

      try {
        setLoading(true);

        // Get fresh token from Amplify
        const session = await fetchAuthSession();
        const token = session?.tokens?.idToken?.toString();

        if (!token) {
          setError('Not authenticated');
          return;
        }

        // Fetch video metadata
        const videoResponse = await axios.get(
          `${API_BASE_URL}/api/videos/${videoId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-Organization-Id': currentWorkspace.organization.id
            }
          }
        );
        setVideo(videoResponse.data);

        // Fetch presigned URL for video playback
        const urlResponse = await axios.get(
          `${API_BASE_URL}/api/videos/${videoId}/presigned-url`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-Organization-Id': currentWorkspace.organization.id
            }
          }
        );
        setPresignedUrl(urlResponse.data);

        // Fetch video tags
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

  const handleDelete = async () => {
    if (!video || !currentWorkspace) return;

    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);

      // Get fresh token from Amplify
      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();

      if (!token) {
        setError('Not authenticated');
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/api/videos/${video.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Organization-Id': currentWorkspace.organization.id
          }
        }
      );

      // Redirect to dashboard after successful deletion
      navigate('/');
    } catch (err: any) {
      console.error('Error deleting video:', err);
      setError(err.response?.data?.message || 'Failed to delete video');
    } finally {
      setDeleting(false);
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

      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="btn btn-ghost mb-6">
          &larr; Back to Dashboard
        </Link>

        {/* Video Player */}
        <div className="mb-8">
          {presignedUrl && video.uploadStatus === 'COMPLETED' ? (
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <video
                controls
                className="w-full bg-black"
                style={{ maxHeight: '600px' }}
              >
                <source src={presignedUrl} type={video.contentType} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center justify-center" style={{ minHeight: '400px' }}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Video Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h1 className="card-title text-3xl mb-4">{video.title}</h1>

                {/* Tags as Breadcrumbs */}
                {videoTags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {videoTags.map((tag) => {
                        // Parse tag path into breadcrumb segments
                        const segments = tag.path?.split('/').filter(p => p) || [];
                        return (
                          <div key={tag.id} className="breadcrumbs text-sm bg-base-200 rounded-lg px-3 py-2">
                            <ul>
                              {segments.map((segment, index) => {
                                // Build the path up to this segment
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
                  </div>
                )}

                {video.description && (
                  <p className="opacity-70 whitespace-pre-wrap">{video.description}</p>
                )}
              </div>
            </div>

            {/* Video Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Video Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-60">Original Filename</p>
                    <p className="font-semibold">{video.originalFilename}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">File Size</p>
                    <p className="font-semibold">{formatFileSize(video.fileSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Duration</p>
                    <p className="font-semibold">{formatDuration(video.durationSeconds)}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Resolution</p>
                    <p className="font-semibold">
                      {video.width && video.height ? `${video.width} x ${video.height}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Content Type</p>
                    <p className="font-semibold">{video.contentType}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Uploaded</p>
                    <p className="font-semibold">{formatDate(video.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Status & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Status</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-60">Upload Status</p>
                    <div className={`badge ${
                      video.uploadStatus === 'COMPLETED' ? 'badge-success' :
                      video.uploadStatus === 'FAILED' ? 'badge-error' :
                      'badge-warning'
                    }`}>
                      {video.uploadStatus}
                    </div>
                  </div>
                  {video.processingStatus && (
                    <div>
                      <p className="text-sm opacity-60">Processing Status</p>
                      <div className={`badge ${
                        video.processingStatus === 'COMPLETED' ? 'badge-success' :
                        video.processingStatus === 'FAILED' ? 'badge-error' :
                        'badge-warning'
                      }`}>
                        {video.processingStatus}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm opacity-60">Visibility</p>
                    <div className="badge badge-outline">{video.visibility.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-sm">Technical Details</h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs opacity-60">S3 Bucket</p>
                    <p className="text-xs break-all">{video.s3Bucket}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-60">S3 Key</p>
                    <p className="text-xs break-all">{video.s3Key}</p>
                  </div>
                  {video.etag && (
                    <div>
                      <p className="text-xs opacity-60">ETag</p>
                      <p className="text-xs break-all">{video.etag}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Actions</h2>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-error w-full"
                >
                  {deleting && <span className="loading loading-spinner"></span>}
                  {deleting ? 'Deleting...' : 'Delete Video'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoDetailPage;