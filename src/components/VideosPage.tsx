import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrganization } from '../contexts';
import Navigation from './shared/Navigation';
import { videoService } from '../services/videoService';
import { tagService } from '../services/tagService';
import type { Video } from '../types';
import type { Tag } from '../generated';

const VideosPage: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [videoTagsMap, setVideoTagsMap] = useState<Map<number, Tag[]>>(new Map());
  const [expandedTagIds, setExpandedTagIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentWorkspace) {
      fetchVideos();
      fetchTags();
    }
  }, [currentWorkspace]);

  const fetchVideos = async () => {
    setVideosLoading(true);
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
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setVideosLoading(false);
    }
  };

  const fetchTags = async () => {
    setTagsLoading(true);
    try {
      const tags = await tagService.getAllTags();
      setAllTags(tags);

      // Check for tag query parameter and preselect
      const tagParam = searchParams.get('tag');
      if (tagParam) {
        const matchingTag = tags.find(t => t.path === tagParam);
        if (matchingTag && matchingTag.id) {
          setSelectedTagIds([matchingTag.id]);
          // Expand parent tags using the fetched tags
          expandParentTags(matchingTag.path, tags);
        }
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setTagsLoading(false);
    }
  };

  const expandParentTags = (tagPath: string | undefined, tagsList: Tag[]) => {
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
  };

  // Filter videos based on selected tags (including hierarchical matching)
  const filteredVideos = selectedTagIds.length === 0
    ? videos
    : videos.filter(video => {
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

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleExpanded = (tagId: number) => {
    setExpandedTagIds(prev => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  const getChildTags = (parentTag: Tag): Tag[] => {
    return allTags.filter(t => t.parentPath === parentTag.path);
  };

  const renderTagTree = (tags: Tag[]): React.ReactNode => {
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
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <div className="bg-base-100 rounded-lg p-4">
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
                {filteredVideos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/video/${video.id}`}
                    className="group"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="relative bg-base-300 rounded-lg overflow-hidden aspect-video mb-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {/* Duration badge */}
                      {formatDuration(video.durationSeconds) && (
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                          {formatDuration(video.durationSeconds)}
                        </div>
                      )}
                    </div>

                    {/* Video details */}
                    <div className="px-1">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary">
                        {video.title || video.originalFilename}
                      </h3>
                      <div className="text-xs opacity-60 space-y-0.5">
                        <p>{video.contentType || 'Video'}</p>
                        {video.width && video.height && (
                          <p>{video.width}x{video.height}</p>
                        )}
                        <p>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                      </div>
                    </div>
                  </Link>
                ))}
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
