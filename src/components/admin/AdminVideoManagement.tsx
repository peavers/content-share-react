import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../../contexts';
import { videoService } from '../../services/videoService';
import { tagService } from '../../services/tagService';
import Navigation from '../shared/Navigation';
import type { Video } from '../../types';
import type { Tag } from '../../generated';

const AdminVideoManagement: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoTagsMap, setVideoTagsMap] = useState<Map<number, Tag[]>>(new Map());
  const [selectedVideos, setSelectedVideos] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentWorkspace) {
      fetchVideos();
    }
  }, [currentWorkspace]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedVideos = await videoService.getOrganizationVideos();
      setVideos(fetchedVideos);

      // Fetch tags for each video
      const tagsMap = new Map<number, Tag[]>();
      for (const video of fetchedVideos) {
        if (video.id) {
          try {
            const tags = await tagService.getVideoTags(video.id);
            tagsMap.set(video.id, tags);
          } catch (error) {
            console.error(`Error fetching tags for video ${video.id}:`, error);
          }
        }
      }
      setVideoTagsMap(tagsMap);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      await videoService.deleteVideo(videoId);
      await fetchVideos();
    } catch (err: any) {
      console.error('Error deleting video:', err);
      setError(err.message || 'Failed to delete video');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVideos.size === 0) {
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedVideos.size} video(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      for (const videoId of selectedVideos) {
        await videoService.deleteVideo(videoId);
      }
      setSelectedVideos(new Set());
      await fetchVideos();
    } catch (err: any) {
      console.error('Error deleting videos:', err);
      setError(err.message || 'Failed to delete videos');
    }
  };

  const toggleVideoSelection = (videoId: number) => {
    const newSelection = new Set(selectedVideos);
    if (newSelection.has(videoId)) {
      newSelection.delete(videoId);
    } else {
      newSelection.add(videoId);
    }
    setSelectedVideos(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedVideos.size === videos.length) {
      setSelectedVideos(new Set());
    } else {
      setSelectedVideos(new Set(videos.map(v => v.id!)));
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleString();
  };

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="hero min-h-[calc(100vh-4rem)]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">No Organization Selected</h1>
              <p className="py-6">Please select an organization to manage videos.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Video Management</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage videos for {currentWorkspace.organization.name}
            </p>
          </div>
          {selectedVideos.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="btn btn-error gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedVideos.size})
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-sm btn-ghost">
              Dismiss
            </button>
          </div>
        )}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-3">Loading videos...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <p>No videos found in this organization.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={videos.length > 0 && selectedVideos.size === videos.length}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Title</th>
                      <th>Filename</th>
                      <th>Tags</th>
                      <th>Size</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedVideos.has(video.id!)}
                            onChange={() => toggleVideoSelection(video.id!)}
                          />
                        </td>
                        <td>
                          <Link to={`/video/${video.id}`} className="link link-hover font-medium">
                            {video.title || video.originalFilename}
                          </Link>
                        </td>
                        <td className="text-sm opacity-60">{video.originalFilename}</td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {videoTagsMap.get(video.id!)?.map(tag => (
                              <div key={tag.id} className="badge badge-sm badge-ghost">
                                {tag.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="text-sm">{formatFileSize(video.fileSize)}</td>
                        <td>
                          <div className={`badge badge-sm ${
                            video.uploadStatus === 'COMPLETED' ? 'badge-success' :
                            video.uploadStatus === 'FAILED' ? 'badge-error' :
                            'badge-warning'
                          }`}>
                            {video.uploadStatus}
                          </div>
                        </td>
                        <td className="text-sm opacity-60">{formatDate(video.createdAt)}</td>
                        <td>
                          <div className="flex gap-2">
                            <Link to={`/video/${video.id}`} className="btn btn-ghost btn-xs">
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteVideo(video.id!)}
                              className="btn btn-ghost btn-xs text-error"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminVideoManagement;
