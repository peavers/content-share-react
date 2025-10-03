import React, { useEffect, useState } from 'react';
import { useOrganization } from '../../contexts';
import { tagService } from '../../services/tagService';
import Navigation from '../shared/Navigation';
import TagInput from '../shared/TagInput';
import type { Tag } from '../../generated';

const TagManagement: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTagIds, setExpandedTagIds] = useState<Set<number>>(new Set());
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editName, setEditName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTags, setNewTags] = useState<string[]>([]);

  useEffect(() => {
    // AdminRoute ensures currentWorkspace exists before rendering this component
    fetchTags();
  }, [currentWorkspace]);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTags = await tagService.getAllTags();
      setTags(fetchedTags);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
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
    return tags.filter(t => t.parentPath === parentTag.path);
  };

  const handleCreateTag = async () => {
    if (newTags.length === 0) {
      setError('Please add at least one tag');
      return;
    }

    try {
      // Create all selected tags
      for (const tagPath of newTags) {
        await tagService.createTag({
          path: tagPath.startsWith('/') ? tagPath : '/' + tagPath,
          description: undefined
        });
      }

      setShowCreateModal(false);
      setNewTags([]);
      await fetchTags();
    } catch (err: any) {
      console.error('Error creating tag:', err);
      setError(err.message || 'Failed to create tag');
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag);
    setEditName(tag.name || '');
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditName('');
  };

  const handleSaveEdit = async () => {
    if (!editingTag || !editName.trim()) {
      setError('Tag name is required');
      return;
    }

    try {
      // Build new path with updated name
      const pathParts = editingTag.path?.split('/').filter(p => p) || [];
      pathParts[pathParts.length - 1] = editName;
      const newPath = '/' + pathParts.join('/');

      await tagService.updateTag(editingTag.id!, {
        path: newPath,
        description: undefined
      });

      setEditingTag(null);
      setEditName('');
      await fetchTags();
    } catch (err: any) {
      console.error('Error updating tag:', err);
      setError(err.message || 'Failed to update tag');
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (!confirm(`Are you sure you want to delete "${tag.path}"? This will also remove it from all videos.`)) {
      return;
    }

    try {
      await tagService.deleteTag(tag.id!);
      await fetchTags();
    } catch (err: any) {
      console.error('Error deleting tag:', err);
      setError(err.message || 'Failed to delete tag');
    }
  };

  const renderTagTree = (tagList: Tag[]): React.ReactNode => {
    return tagList.map((tag) => {
      const children = getChildTags(tag);
      const hasChildren = children.length > 0;
      const isExpanded = expandedTagIds.has(tag.id!);
      const isEditing = editingTag?.id === tag.id;

      return (
        <div key={tag.id} className="select-none">
          <div className="flex items-center gap-2 hover:bg-base-200 rounded py-2 px-3 group">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(tag.id!)}
                className="p-1 hover:bg-base-300 rounded"
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
              <span className="w-6" />
            )}

            {isEditing ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  className="input input-sm input-bordered flex-1"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Tag name"
                />
                <button onClick={handleSaveEdit} className="btn btn-primary btn-sm">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium">{tag.name}</div>
                  <div className="text-xs opacity-40">{tag.path}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                  <button
                    onClick={() => handleStartEdit(tag)}
                    className="btn btn-ghost btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div className="ml-6 mt-1">
              {renderTagTree(children)}
            </div>
          )}
        </div>
      );
    });
  };

  // AdminRoute ensures currentWorkspace exists before rendering this component
  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tag Management</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage tags for {currentWorkspace.organization.name}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Tag
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

        <div className="card bg-base-100">
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-3">Loading tags...</p>
              </div>
            ) : tags.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <p>No tags created yet. Create your first tag to get started.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {renderTagTree(tags.filter(t => t.depth === 0))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Tag Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Tags</h3>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Add Tags</span>
              </label>
              <TagInput
                allTags={tags}
                selectedTags={newTags}
                onTagsChange={setNewTags}
                placeholder="Type to search or create tags (e.g., /news or /news/americas)"
              />
            </div>

            <div className="modal-action">
              <button onClick={handleCreateTag} className="btn btn-primary">
                Create {newTags.length > 0 && `(${newTags.length})`}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTags([]);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowCreateModal(false)} />
        </div>
      )}
    </div>
  );
};

export default TagManagement;
