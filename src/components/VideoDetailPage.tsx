import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrganization } from '../contexts';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import Navigation from './shared/Navigation';

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
      navigate('/dashboard');
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
      <div className="min-h-screen bg-white">
        <Navigation showUploadButton={true} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation showUploadButton={true} />
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="border border-red-300 bg-red-50 p-4">
            <p className="text-red-600">{error || 'Video not found'}</p>
          </div>
          <Link
            to="/dashboard"
            className="mt-4 inline-block text-black hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation showUploadButton={true} />

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-block mb-8 text-black hover:underline"
        >
          &larr; Back to Dashboard
        </Link>

        {/* Video Player */}
        <div className="mb-8">
          {presignedUrl && video.uploadStatus === 'COMPLETED' ? (
            <div className="border border-black">
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
            <div className="border border-black bg-gray-100 flex items-center justify-center" style={{ height: '400px' }}>
              <div className="text-center">
                <p className="text-gray-600">
                  {video.uploadStatus === 'PENDING' ? 'Video is being processed...' : 'Video not available'}
                </p>
                <p className="text-sm text-gray-500 mt-2">Status: {video.uploadStatus}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content - Video Info */}
          <div className="col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-black mb-2">{video.title}</h1>
              {video.description && (
                <p className="text-gray-700 mt-4 whitespace-pre-wrap">{video.description}</p>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="border border-black p-6">
              <h2 className="text-xl font-light text-black mb-4">Video Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Original Filename</p>
                  <p className="text-black">{video.originalFilename}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="text-black">{formatFileSize(video.fileSize)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-black">{formatDuration(video.durationSeconds)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Resolution</p>
                  <p className="text-black">
                    {video.width && video.height ? `${video.width} x ${video.height}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Content Type</p>
                  <p className="text-black">{video.contentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uploaded</p>
                  <p className="text-black">{formatDate(video.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Status & Actions */}
          <div className="col-span-1">
            {/* Status Card */}
            <div className="border border-black p-6 mb-4">
              <h2 className="text-xl font-light text-black mb-4">Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Upload Status</p>
                  <p className={`font-medium ${
                    video.uploadStatus === 'COMPLETED' ? 'text-green-600' :
                    video.uploadStatus === 'FAILED' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {video.uploadStatus}
                  </p>
                </div>
                {video.processingStatus && (
                  <div>
                    <p className="text-sm text-gray-600">Processing Status</p>
                    <p className={`font-medium ${
                      video.processingStatus === 'COMPLETED' ? 'text-green-600' :
                      video.processingStatus === 'FAILED' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {video.processingStatus}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Visibility</p>
                  <p className="text-black font-medium">{video.visibility.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="border border-black p-6 mb-4">
              <h2 className="text-xl font-light text-black mb-4">Technical Details</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">S3 Bucket</p>
                  <p className="text-xs text-black break-all">{video.s3Bucket}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">S3 Key</p>
                  <p className="text-xs text-black break-all">{video.s3Key}</p>
                </div>
                {video.etag && (
                  <div>
                    <p className="text-xs text-gray-600">ETag</p>
                    <p className="text-xs text-black break-all">{video.etag}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border border-black p-6">
              <h2 className="text-xl font-light text-black mb-4">Actions</h2>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full bg-red-600 text-white px-4 py-3 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {deleting ? 'Deleting...' : 'Delete Video'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoDetailPage;