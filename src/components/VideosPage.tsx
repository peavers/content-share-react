import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrganization } from '../contexts';
import Navigation from './shared/Navigation';
import { useVideos, useTags } from '../hooks';
import type { Tag } from '../generated';

const VideosPage: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [searchParams] = useSearchParams();
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [expandedTagIds, setExpandedTagIds] = useState<Set<number>>(new Set());

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

  // Filter videos based on selected tags (including hierarchical matching)
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
                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <main className="w-full px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 px-4">
          Videos in {currentWorkspace.organization.name}
        </h2>

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
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0">
              <div className="p-4">
                <h3 className="font-semibold mb-4">Filter by Tags</h3>
                {tagsLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <p className="text-sm opacity-60">Loading tags...</p>
                  </div>
                ) : allTags.length === 0 ? (
                  <p className="text-sm opacity-60">No tags available</p>
                ) : (
                  <div className="space-y-1">
                    {renderTagTree(allTags.filter(t => t.depth === 0))}
                  </div>
                )}
                {selectedTagIds.length > 0 && (
                  <button
                    onClick={() => setSelectedTagIds([])}
                    className="btn btn-sm btn-ghost w-full mt-4"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Video Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredVideos.map((video) => {
                  const thumbnailUrl = video.id ? thumbnailUrlsMap.get(video.id) : undefined;

                  return (
                    <Link
                      key={video.id}
                      to={`/video/${video.id}`}
                      className="group"
                    >
                      {/* Thumbnail */}
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
                        {/* Duration badge */}
                        {formatDuration(video.durationSeconds) && (
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                            {formatDuration(video.durationSeconds)}
                          </div>
                        )}
                      </div>

                      {/* Video details */}
                      <div className="px-1">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary">
                          {video.title || video.originalFilename}
                        </h3>
                        {/* Description */}
                        {video.description && (
                          <p className="text-xs opacity-60 line-clamp-2 mb-2">
                            {video.description}
                          </p>
                        )}
                        {/* Tags */}
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
          </div>
        )}
      </main>
    </div>
  );
};

export default VideosPage;
