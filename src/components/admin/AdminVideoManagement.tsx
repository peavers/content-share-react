import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../../contexts';
import { videoService } from '../../services/videoService';
import { tagService } from '../../services/tagService';
import Navigation from '../shared/Navigation';
import UploadVideoModal from '../upload/UploadVideoModal';
import type { Video } from '../../generated';
import type { Tag } from '../../generated';
import { DataTable, type TableColumn, type TableAction } from '../shared/DataTable';

const AdminVideoManagement: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoTagsMap, setVideoTagsMap] = useState<Map<string, Tag[]>>(new Map());
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

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
      const tagsMap = new Map<string, Tag[]>();
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

  const handleDeleteVideo = async (videoId: string) => {
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

  const handleBulkDelete = async (videoIds: Set<string>) => {
    if (!confirm(`Are you sure you want to delete ${videoIds.size} video(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      for (const videoId of videoIds) {
        await videoService.deleteVideo(videoId);
      }
      setSelectedVideos(new Set());
      await fetchVideos();
    } catch (err: any) {
      console.error('Error deleting videos:', err);
      setError(err.message || 'Failed to delete videos');
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

  // Define table columns
  const columns: TableColumn<Video>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (video) => (
        <Link to={`/video/${video.id}`} className="link link-hover font-medium">
          {video.title || video.originalFilename}
        </Link>
      ),
    },
    {
      key: 'filename',
      header: 'Filename',
      render: (video) => <span className="text-sm opacity-60">{video.originalFilename}</span>,
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (video) => (
        <div className="flex flex-wrap gap-1">
          {videoTagsMap.get(video.id!)?.map(tag => (
            <div key={tag.id} className="badge badge-sm badge-ghost">
              {tag.name}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'size',
      header: 'Size',
      render: (video) => <span className="text-sm">{formatFileSize(video.fileSize)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (video) => (
        <div className={`badge badge-sm ${
          video.uploadStatus === 'COMPLETED' ? 'badge-success' :
          video.uploadStatus === 'FAILED' ? 'badge-error' :
          'badge-warning'
        }`}>
          {video.uploadStatus}
        </div>
      ),
    },
    {
      key: 'uploaded',
      header: 'Uploaded',
      render: (video) => <span className="text-sm opacity-60">{formatDate(video.createdAt)}</span>,
    },
  ];

  // Define table actions
  const actions: TableAction<Video>[] = [
    {
      label: 'View',
      onClick: (video) => window.location.href = `/video/${video.id}`,
      variant: 'ghost',
    },
    {
      label: 'Edit',
      onClick: setEditingVideo,
      variant: 'ghost',
    },
    {
      label: 'Delete',
      onClick: (video) => handleDeleteVideo(video.id!),
      variant: 'error',
    },
  ];

  // Define bulk actions
  const bulkActions = [
    {
      label: `Delete Selected (${selectedVideos.size})`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: handleBulkDelete,
      variant: 'error' as const,
    },
  ];

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

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Video Management</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage videos for {currentWorkspace.organization.name}
            </p>
          </div>
          <button onClick={() => setShowUploadModal(true)} className="btn btn-primary gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Video
          </button>
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
            <DataTable
              data={videos}
              columns={columns}
              actions={actions}
              loading={loading}
              emptyMessage="No videos found in this organization."
              emptyIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              }
              selectable
              selectedItems={selectedVideos}
              onSelectionChange={setSelectedVideos}
              bulkActions={bulkActions}
              getItemId={(video) => video.id!}
              variant="zebra"
            />
          </div>
        </div>
      </main>

      {/* Upload Video Modal */}
      <UploadVideoModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          fetchVideos();
          setShowUploadModal(false);
        }}
      />

      {/* Edit Video Modal */}
      {editingVideo && (
        <UploadVideoModal
          isOpen={!!editingVideo}
          onClose={() => setEditingVideo(null)}
          onSuccess={() => {
            fetchVideos();
            setEditingVideo(null);
          }}
          video={editingVideo}
          videoTags={videoTagsMap.get(editingVideo.id!)?.map(t => t.path!)}
        />
      )}
    </div>
  );
};

export default AdminVideoManagement;
