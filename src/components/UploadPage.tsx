import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../contexts';
import { uploadService } from '../services/uploadService';
import { tagService } from '../services/tagService';
import Navigation from './shared/Navigation';
import Avatar from './shared/Avatar';
import type { Tag } from '../generated';

const UploadPage: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentWorkspace) {
      fetchTags();
    }
  }, [currentWorkspace]);

  useEffect(() => {
    // Filter suggestions based on input
    if (!tagInput.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const input = tagInput.toLowerCase();
    const parts = input.split('/').filter(p => p);

    // Build a combined list of existing tags + locally selected tags
    const localTags = selectedTags.map(path => {
      const pathParts = path.split('/').filter(p => p);
      const name = pathParts[pathParts.length - 1];
      const depth = pathParts.length - 1;
      const parentPath = depth === 0 ? null : '/' + pathParts.slice(0, depth).join('/');

      return {
        id: undefined,
        path,
        name,
        depth,
        parentPath
      } as Tag;
    });

    // Combine and deduplicate (prefer existing tags)
    const existingPaths = new Set(allTags.map(t => t.path));
    const combinedTags = [
      ...allTags,
      ...localTags.filter(t => !existingPaths.has(t.path))
    ];

    if (parts.length === 0) {
      // Show root tags
      const suggestions = combinedTags.filter(t => t.depth === 0);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      // Build the parent path
      const currentDepth = parts.length - 1;
      const parentPath = currentDepth === 0 ? null : '/' + parts.slice(0, currentDepth).join('/');
      const searchTerm = parts[parts.length - 1];

      // Filter tags at the appropriate level
      const suggestions = combinedTags.filter(t => {
        if (t.parentPath !== parentPath) return false;
        if (!t.name) return false;
        return t.name.toLowerCase().includes(searchTerm);
      });

      setFilteredSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    }
  }, [tagInput, allTags, selectedTags]);

  const fetchTags = async () => {
    try {
      const tags = await tagService.getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a video file');
        setSelectedFile(null);
      }
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure it starts with /
    if (value && !value.startsWith('/')) {
      setTagInput('/' + value);
    } else {
      setTagInput(value);
    }
  };

  const selectTag = (tag: Tag) => {
    if (tag.path && !selectedTags.includes(tag.path)) {
      setSelectedTags([...selectedTags, tag.path]);
    }
    setTagInput('');
    setShowSuggestions(false);
    tagInputRef.current?.focus();
  };

  const removeTag = (tagPath: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagPath));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      // If there's exactly one suggestion, use it
      if (filteredSuggestions.length === 1) {
        selectTag(filteredSuggestions[0]);
      } else {
        // Create new tag with the input
        const newTagPath = tagInput.trim();
        if (!selectedTags.includes(newTagPath)) {
          setSelectedTags([...selectedTags, newTagPath]);
        }
        setTagInput('');
        setShowSuggestions(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setError('Please select a video file and provide a title');
      return;
    }

    if (!currentWorkspace) {
      setError('No organization selected');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadService.uploadFile(
        selectedFile,
        {
          title: title,
          description: description,
          tags: selectedTags.length > 0 ? selectedTags : undefined
        },
        (progress) => {
          console.log('Upload progress:', progress);
        }
      );

      setSuccess(true);
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setSelectedTags([]);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">No Organization Selected</h1>
            <p className="py-6">Please select an organization from the dashboard.</p>
            <Link to="/" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation showUploadButton={false} />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Success Alert */}
        {success && (
          <div className="alert alert-success shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Success!</h3>
              <div className="text-sm">Your video has been uploaded successfully.</div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Upload Failed</h3>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-8">
            <div className="flex items-center gap-3 mb-6">
              <Avatar name={currentWorkspace.organization.name} size="md" />
              <div>
                <h2 className="text-2xl font-bold">Upload Video</h2>
                <p className="text-sm opacity-60">
                  to {currentWorkspace.organization.name}
                </p>
              </div>
            </div>

            <div className="divider"></div>

            {/* File Upload */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-base font-medium">Select Video File</span>
                <span className="label-text-alt text-error">* Required</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="file-input file-input-bordered file-input-primary w-full"
              />
              {selectedFile && (
                <label className="label">
                  <span className="label-text-alt text-success">
                    ✓ {selectedFile.name}
                  </span>
                  <span className="label-text-alt opacity-70">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </label>
              )}
            </div>

            {/* Title */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-base font-medium">Video Title</span>
                <span className="label-text-alt text-error">* Required</span>
              </label>
              <input
                type="text"
                placeholder="Give your video a descriptive title"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-base font-medium">Description</span>
                <span className="label-text-alt opacity-70">Optional</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-32 resize-none w-full"
                placeholder="Add a description to help viewers understand your video content..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Tags */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-base font-medium">Tags</span>
                <span className="label-text-alt opacity-70">Optional</span>
              </label>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag) => (
                    <div key={tag} className="badge badge-primary gap-2 p-3">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tag Input with Autocomplete */}
              <div className="relative">
                <input
                  ref={tagInputRef}
                  type="text"
                  placeholder="Type to search tags (e.g., /news or /news/americas)"
                  className="input input-bordered w-full"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onFocus={() => tagInput && setShowSuggestions(filteredSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => selectTag(tag)}
                        className="w-full text-left px-4 py-2 hover:bg-base-200 flex items-center justify-between"
                      >
                        <span className="font-medium">{tag.path}</span>
                        {tag.description && (
                          <span className="text-xs opacity-60 ml-2">{tag.description}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <label className="label">
                <span className="label-text-alt opacity-70">
                  Start typing to search existing tags or create new ones. Press Enter to add.
                </span>
              </label>
            </div>

            <div className="divider"></div>

            {/* Upload Button */}
            <div className="card-actions justify-end">
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !title.trim()}
                className="btn btn-primary btn-lg gap-2"
              >
                {uploading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;