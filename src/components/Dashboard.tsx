import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../contexts';
import Navigation from './shared/Navigation';
import { videoService } from '../services/videoService';
import type { Video } from '../types';

const Dashboard: React.FC = () => {
  const { organizations, currentWorkspace, loading } = useOrganization();
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      fetchVideos();
    }
  }, [currentWorkspace]);

  const fetchVideos = async () => {
    setVideosLoading(true);
    try {
      const fetchedVideos = await videoService.getOrganizationVideos();
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setVideosLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Current Organization Videos */}
        {currentWorkspace && (
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-xl font-light text-black">
                Videos in {currentWorkspace.organization.name}
              </h2>
            </div>

            {videosLoading ? (
              <div className="border border-gray-300 p-8">
                <p className="text-gray-600">Loading videos...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="border border-gray-300 p-8">
                <p className="text-gray-600">No videos uploaded yet in this organization.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/video/${video.id}`}
                    className="border border-gray-300 p-6 hover:border-black transition-colors block"
                  >
                    <h3 className="font-light text-lg text-black mb-2">{video.title || video.originalFilename}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description || 'No description'}</p>
                    <div className="text-xs text-gray-500">
                      <p>Status: <span className={
                        video.uploadStatus === 'COMPLETED' ? 'text-green-600' :
                        video.uploadStatus === 'FAILED' ? 'text-red-600' :
                        'text-yellow-600'
                      }>{video.uploadStatus}</span></p>
                      <p>Size: {video.fileSize ? `${(video.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</p>
                      <p>Uploaded: {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Organizations List */}
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-light text-black">Your Organizations</h2>
          </div>

          {organizations.length === 0 ? (
            <div className="border border-black p-8">
              <p className="text-gray-600">No organizations yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className={`border p-8 transition-colors duration-200 ${
                    currentWorkspace?.organization.id === org.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-600">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-light text-lg text-black">{org.name}</h3>
                      <p className="text-xs text-gray-500">
                        {org.organizationType === 'PERSONAL' ? 'Personal Account' : 'Organization'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{org.description || 'No description'}</p>
                  {currentWorkspace?.organization.id === org.id && (
                    <div className="mt-4 text-xs text-black font-light">
                      ✓ Currently selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;