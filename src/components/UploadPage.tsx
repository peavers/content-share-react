import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../contexts';
import { uploadService } from '../services/uploadService';
import { tagService } from '../services/tagService';
import Navigation from './shared/Navigation';
import TagInput from './shared/TagInput';
import type { Tag } from '../generated';

const UploadPage: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      fetchTags();
    }
  }, [currentWorkspace]);

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
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Upload Video</h1>
            <p className="text-sm opacity-60 mt-1">
              Upload to {currentWorkspace.organization.name}
            </p>
          </div>
        </div>

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
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-8">

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
              <TagInput
                allTags={allTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
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