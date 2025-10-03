import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navigation from './shared/Navigation';
import { useSearch } from '../hooks';
import type { VideoSearchDocument } from '../generated';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'users' | 'organizations'>('all');

  const { results, loading, search } = useSearch();

  // Search on mount and when query changes
  useEffect(() => {
    if (query) {
      search(query, 100); // Get more results for full page
    }
  }, [query, search]);

  const filteredVideos = results?.videos || [];
  const filteredUsers = results?.users || [];
  const filteredOrganizations = results?.organizations || [];

  const totalResults = filteredVideos.length + filteredUsers.length + filteredOrganizations.length;

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const VideoCard: React.FC<{ video: VideoSearchDocument }> = ({ video }) => (
    <Link
      to={`/video/${video.videoId}`}
      className="card card-compact bg-base-100 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group"
    >
      {/* Thumbnail */}
      <figure className="relative aspect-video bg-base-300 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-base-content/20 group-hover:text-base-content/30 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        {/* Duration badge */}
        {video.durationSeconds && (
          <div className="absolute bottom-2 right-2 badge badge-neutral badge-sm font-mono">
            {formatDuration(video.durationSeconds)}
          </div>
        )}
        {/* Resolution badge */}
        {video.width && video.height && (
          <div className="absolute top-2 right-2 badge badge-sm bg-black/60 text-white border-none">
            {video.height}p
          </div>
        )}
      </figure>

      <div className="card-body">
        {/* Title */}
        <h3 className="card-title text-base line-clamp-2 group-hover:text-primary transition-colors">
          {video.title || 'Untitled Video'}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-base-content/60">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{video.userFullName || video.userUsername}</span>
          </div>
          <span>•</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>

        {/* Description */}
        {video.description && (
          <p className="text-sm text-base-content/70 line-clamp-2">
            {video.description}
          </p>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="badge badge-sm badge-ghost">
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="badge badge-sm badge-ghost">
                +{video.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Organization */}
        {video.organizationName && (
          <div className="flex items-center gap-1 text-xs text-base-content/50 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{video.organizationName}</span>
          </div>
        )}

        {/* File info */}
        <div className="text-xs text-base-content/40 mt-1">
          {formatFileSize(video.fileSize)}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {query ? `Search results for "${query}"` : 'All Results'}
          </h1>
          <p className="text-base-content/60">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 inline-flex bg-base-100">
          <button
            className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({totalResults})
          </button>
          <button
            className={`tab ${activeTab === 'videos' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos ({filteredVideos.length})
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({filteredUsers.length})
          </button>
          <button
            className={`tab ${activeTab === 'organizations' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('organizations')}
          >
            Organizations ({filteredOrganizations.length})
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center p-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* No results */}
        {!loading && totalResults === 0 && (
          <div className="card bg-base-100 shadow-md p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-base-content/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-base-content/60">
                  Try adjusting your search terms or browse all content
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Videos Section */}
        {!loading && (activeTab === 'all' || activeTab === 'videos') && filteredVideos.length > 0 && (
          <div className="mb-8">
            {activeTab === 'all' && (
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Videos
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos.map(video => (
                <VideoCard key={video.videoId} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* Users Section */}
        {!loading && (activeTab === 'all' || activeTab === 'users') && filteredUsers.length > 0 && (
          <div className="mb-8">
            {activeTab === 'all' && (
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map(user => (
                <div key={user.userId} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                  <div className="card-body">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12 h-12">
                          <span className="text-lg">
                            {user.firstName?.[0] || user.username[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{user.fullName}</h3>
                        <p className="text-sm text-base-content/60 truncate">@{user.username}</p>
                      </div>
                    </div>
                    <p className="text-sm text-base-content/70 truncate">{user.email}</p>
                    {user.lastLoginAt && (
                      <p className="text-xs text-base-content/50">
                        Last active {formatDate(user.lastLoginAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organizations Section */}
        {!loading && (activeTab === 'all' || activeTab === 'organizations') && filteredOrganizations.length > 0 && (
          <div className="mb-8">
            {activeTab === 'all' && (
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Organizations
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrganizations.map(org => (
                <div key={org.organizationId} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content rounded-lg w-12 h-12">
                          <span className="text-lg">
                            {org.name[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{org.name}</h3>
                        {org.organizationType && (
                          <span className="badge badge-sm badge-outline mt-1">
                            {org.organizationType}
                          </span>
                        )}
                      </div>
                    </div>
                    {org.description && (
                      <p className="text-sm text-base-content/70 line-clamp-2 mt-2">
                        {org.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2 text-xs text-base-content/60">
                      {org.plan && <span className="badge badge-sm">{org.plan}</span>}
                      {org.usedStorageGb !== null && (
                        <span>{org.usedStorageGb.toFixed(1)} GB used</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
