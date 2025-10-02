import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth, useOrganization } from '../contexts';
import Navigation from './shared/Navigation';
import { CreateOrganizationModal } from './organization/CreateOrganizationModal';
import Avatar from './shared/Avatar';
import SidebarSection from './shared/SidebarSection';
import ExpandableContent from './shared/ExpandableContent';
import ActionButton from './shared/ActionButton';
import { useVideos, useTags } from '../hooks';
import type { Tag } from '../generated';

type CategoryFilter = 'all' | 'recent' | 'featured';

const VideosPage: React.FC = () => {
  const auth = useAuth();
  const { user, logout } = auth;
  const { currentWorkspace, organizations, setCurrentWorkspace } = useOrganization();
  const [searchParams] = useSearchParams();
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [expandedTagIds, setExpandedTagIds] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workspacesExpanded, setWorkspacesExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(false);

  const {
    videos,
    videoTagsMap,
    thumbnailUrlsMap,
    loading: videosLoading
  } = useVideos(currentWorkspace?.organization.id);

  const {
    tags: allTags,
    loading: tagsLoading
  } = useTags(currentWorkspace?.organization.id);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam && allTags.length > 0) {
      const matchingTag = allTags.find(t => t.path === tagParam);
      if (matchingTag && matchingTag.id) {
        setSelectedTagIds([matchingTag.id]);
        expandParentTags(matchingTag.path, allTags);
      }
    }
  }, [searchParams, allTags]);

  const expandParentTags = useCallback((tagPath: string | undefined, tagsList: Tag[]) => {
    if (!tagPath) return;
    const segments = tagPath.split('/').filter(p => p);
    const parentPaths: string[] = [];

    // Build all parent paths including the current tag itself
    for (let i = 0; i < segments.length; i++) {
      parentPaths.push('/' + segments.slice(0, i + 1).join('/'));
    }

    // Find and expand all parent tag IDs
    const parentTagIds = tagsList
      .filter(t => parentPaths.includes(t.path || ''))
      .map(t => t.id!)
      .filter(id => id !== undefined);

    setExpandedTagIds(new Set(parentTagIds));
  }, []);

  // Get featured videos (videos with tags for now)
  const featuredVideos = useMemo(() => {
    return videos.filter(video =>
      video.id && videoTagsMap.get(video.id) && videoTagsMap.get(video.id)!.length > 0
    );
  }, [videos, videoTagsMap]);

  // Get recent videos (last 7 days)
  const recentVideos = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return videos.filter(video =>
      video.createdAt && new Date(video.createdAt) >= sevenDaysAgo
    );
  }, [videos]);

  // Filter videos based on selected tags (for the "All Videos" section)
  const filteredVideos = useMemo(() => {
    if (selectedTagIds.length === 0) return videos;

    return videos.filter(video => {
      if (!video.id) return false;
      const videoTags = videoTagsMap.get(video.id) || [];
      return selectedTagIds.some(selectedTagId => {
        const selectedTag = allTags.find(t => t.id === selectedTagId);
        if (!selectedTag) return false;

        // Match if video has the exact tag OR any child tag
        return videoTags.some(vTag =>
          vTag.id === selectedTagId ||
          (vTag.path && selectedTag.path && vTag.path.startsWith(selectedTag.path + '/'))
        );
      });
    });
  }, [videos, selectedTagIds, videoTagsMap, allTags]);

  const toggleTag = useCallback((tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  }, []);

  const toggleExpanded = useCallback((tagId: number) => {
    setExpandedTagIds(prev => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }, []);

  const getChildTags = useCallback((parentTag: Tag): Tag[] => {
    return allTags.filter(t => t.parentPath === parentTag.path);
  }, [allTags]);

  const renderTagTree = useCallback((tags: Tag[]): React.ReactNode => {
    return tags.map((tag) => {
      const children = getChildTags(tag);
      const hasChildren = children.length > 0;
      const isExpanded = expandedTagIds.has(tag.id!);

      return (
        <div key={tag.id} className="select-none">
          <div className="flex items-center gap-1 hover:bg-base-200 rounded py-1 px-2">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(tag.id!)}
                className="p-0.5 hover:bg-base-300 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <span className="w-5" />
            )}
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-primary"
                checked={selectedTagIds.includes(tag.id!)}
                onChange={() => toggleTag(tag.id!)}
              />
              <span className="text-sm">{tag.name}</span>
            </label>
          </div>
          {hasChildren && isExpanded && (
            <div className="ml-5 mt-1">
              {renderTagTree(children)}
            </div>
          )}
        </div>
      );
    });
  }, [getChildTags, expandedTagIds, selectedTagIds, toggleTag, toggleExpanded]);

  const formatDuration = useCallback((seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const switchToOrganization = (org: any) => {
    const workspace = {
      type: org.organizationType === 'PERSONAL' ? 'personal' : 'organization',
      organization: org,
      currentUserRole: undefined,
      permissions: []
    };
    setCurrentWorkspace(workspace);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="hero min-h-[calc(100vh-4rem)] bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">No Organization Selected</h1>
              <p className="py-6">Please select an organization to view videos.</p>
              <Link to="/" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="drawer lg:drawer-open min-h-screen">
        <input id="tag-drawer" type="checkbox" className="drawer-toggle" />

        {/* Main Content */}
        <div className="drawer-content flex flex-col bg-base-200">
          {/* Navbar */}
          <Navigation />

          <main className="flex-1 py-8 lg:pl-6">
          {videosLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="ml-3">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="alert alert-info max-w-2xl mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No videos uploaded yet in this organization.</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured Section */}
              {featuredVideos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 px-4">Featured</h2>
                <div className="px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {featuredVideos.slice(0, 10).map((video) => {
                      const thumbnailUrl = video.id ? thumbnailUrlsMap.get(video.id) : undefined;
                      return (
                        <Link
                          key={video.id}
                          to={`/video/${video.id}`}
                          className="group"
                        >
                          <div className="relative bg-base-300 rounded-lg overflow-hidden aspect-video mb-2">
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={video.title || video.originalFilename}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                            {formatDuration(video.durationSeconds) && (
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                                {formatDuration(video.durationSeconds)}
                              </div>
                            )}
                          </div>
                          <div className="px-1">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary">
                              {video.title || video.originalFilename}
                            </h3>
                            {video.description && (
                              <p className="text-xs opacity-60 line-clamp-2 mb-2">
                                {video.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1.5 text-xs opacity-70">
                              {video.id && videoTagsMap.get(video.id)?.slice(0, 2).map(tag => (
                                <span key={tag.id} className="text-primary">
                                  {tag.path?.replace(/^\//, '').replace(/\//g, ' › ') || tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
              )}

              {/* Recent Section */}
              {recentVideos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 px-4">Recent</h2>
                <div className="px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {recentVideos.slice(0, 10).map((video) => {
                      const thumbnailUrl = video.id ? thumbnailUrlsMap.get(video.id) : undefined;
                      return (
                        <Link
                          key={video.id}
                          to={`/video/${video.id}`}
                          className="group"
                        >
                          <div className="relative bg-base-300 rounded-lg overflow-hidden aspect-video mb-2">
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={video.title || video.originalFilename}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                            {formatDuration(video.durationSeconds) && (
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                                {formatDuration(video.durationSeconds)}
                              </div>
                            )}
                          </div>
                          <div className="px-1">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary">
                              {video.title || video.originalFilename}
                            </h3>
                            {video.description && (
                              <p className="text-xs opacity-60 line-clamp-2 mb-2">
                                {video.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1.5 text-xs opacity-70">
                              {video.id && videoTagsMap.get(video.id)?.slice(0, 2).map(tag => (
                                <span key={tag.id} className="text-primary">
                                  {tag.path?.replace(/^\//, '').replace(/\//g, ' › ') || tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
              )}

              {/* All Videos Section */}
              <section>
              <h2 className="text-2xl font-bold mb-4 px-4">All Videos</h2>
              <div className="px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredVideos.map((video) => {
                    const thumbnailUrl = video.id ? thumbnailUrlsMap.get(video.id) : undefined;
                    return (
                      <Link
                        key={video.id}
                        to={`/video/${video.id}`}
                        className="group"
                      >
                        <div className="relative bg-base-300 rounded-lg overflow-hidden aspect-video mb-2">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={video.title || video.originalFilename}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          {formatDuration(video.durationSeconds) && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                              {formatDuration(video.durationSeconds)}
                            </div>
                          )}
                        </div>
                        <div className="px-1">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary">
                            {video.title || video.originalFilename}
                          </h3>
                          {video.description && (
                            <p className="text-xs opacity-60 line-clamp-2 mb-2">
                              {video.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1.5 text-xs opacity-70">
                            {video.id && videoTagsMap.get(video.id)?.slice(0, 3).map(tag => (
                              <span key={tag.id} className="text-primary">
                                {tag.path?.replace(/^\//, '').replace(/\//g, ' › ') || tag.name}
                              </span>
                            ))}
                            {video.id && videoTagsMap.get(video.id) && videoTagsMap.get(video.id)!.length > 3 && (
                              <span className="opacity-50">
                                +{videoTagsMap.get(video.id)!.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {filteredVideos.length === 0 && selectedTagIds.length > 0 && (
                  <div className="text-center py-12 opacity-60">
                    <p>No videos match the selected filters</p>
                  </div>
                )}
              </div>
              </section>
            </div>
          )}
          </main>
        </div>

        {/* Sidebar Drawer */}
        <div className="drawer-side z-20">
          <label htmlFor="tag-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <aside className="bg-base-100 w-80 min-h-full p-4 flex flex-col">
            {/* Site Title */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-base-300">
              <Link to="/" className="flex items-center gap-2 flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-xl font-bold">ContentShare</span>
              </Link>
              <label htmlFor="tag-drawer" className="btn btn-sm btn-circle btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </label>
            </div>

            {/* Main content - scrollable */}
            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Workspace Section */}
              {currentWorkspace && (
                <SidebarSection
                  title="Workspace"
                  isExpanded={workspacesExpanded}
                  onToggle={() => setWorkspacesExpanded(!workspacesExpanded)}
                >
                  {/* Current workspace display */}
                  <div className="px-2 py-3 bg-base-200 rounded-lg mb-2 flex items-center gap-2">
                    <Avatar name={currentWorkspace.organization.name} size="sm" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm truncate">{currentWorkspace.organization.name}</div>
                      <div className="text-xs opacity-60">{currentWorkspace.organization.organizationType === 'PERSONAL' ? 'Personal' : 'Team'}</div>
                    </div>
                  </div>

                  <ExpandableContent isExpanded={workspacesExpanded}>
                    <div className="space-y-1">
                      {organizations
                        .filter((org) => org.id !== currentWorkspace?.organization.id)
                        .map((org) => (
                          <button
                            key={org.id}
                            onClick={() => {
                              switchToOrganization(org);
                              setWorkspacesExpanded(false);
                            }}
                            className="w-full px-3 py-2 rounded-lg flex items-start gap-3 hover:bg-base-200 transition-colors"
                          >
                            <Avatar name={org.name} size="sm" />
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-sm truncate">{org.name}</div>
                              <div className="text-xs opacity-60">{org.organizationType === 'PERSONAL' ? 'Personal' : 'Team'}</div>
                            </div>
                          </button>
                        ))}
                      <ActionButton
                        onClick={() => {
                          setShowCreateModal(true);
                          setWorkspacesExpanded(false);
                        }}
                        variant="primary"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        }
                      >
                        Create Workspace
                      </ActionButton>
                    </div>
                  </ExpandableContent>
                </SidebarSection>
              )}

              {/* Filters Section */}
              <SidebarSection
                title="Filters"
                isExpanded={filtersExpanded}
                onToggle={() => setFiltersExpanded(!filtersExpanded)}
              >
                <ExpandableContent isExpanded={filtersExpanded} maxHeight="max-h-[600px]">
                  <div className="mt-3">
                    {tagsLoading ? (
                      <div className="flex items-center gap-2 px-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        <p className="text-sm opacity-60">Loading tags...</p>
                      </div>
                    ) : allTags.length === 0 ? (
                      <p className="text-sm opacity-60 px-2">No tags available</p>
                    ) : (
                      <div className="space-y-1">
                        {renderTagTree(allTags.filter(t => t.depth === 0))}
                      </div>
                    )}
                    {selectedTagIds.length > 0 && (
                      <ActionButton
                        onClick={() => setSelectedTagIds([])}
                        variant="secondary"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        }
                      >
                        Clear Filters
                      </ActionButton>
                    )}
                  </div>
                </ExpandableContent>
              </SidebarSection>
            </div>

            {/* User Profile - Bottom */}
            <div className="pt-4 mt-4 border-t border-base-300">
              <SidebarSection
                title="Account"
                isExpanded={accountExpanded}
                onToggle={() => setAccountExpanded(!accountExpanded)}
              >
                {/* Current user display */}
                <div className="px-2 py-3 bg-base-200 rounded-lg mb-2 flex items-center gap-2">
                  <Avatar name={user?.username || ''} size="sm" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm truncate">{user?.username}</div>
                    <div className="text-xs opacity-60">Signed in</div>
                  </div>
                </div>

                <ExpandableContent isExpanded={accountExpanded} maxHeight="max-h-48">
                  <ActionButton
                    onClick={handleLogout}
                    variant="error"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    }
                  >
                    Logout
                  </ActionButton>
                </ExpandableContent>
              </SidebarSection>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newOrg) => {
          switchToOrganization(newOrg);
          setShowCreateModal(false);
        }}
      />
    </>
  );
};

export default VideosPage;
