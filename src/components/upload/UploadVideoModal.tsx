import React, { useState, useEffect, useRef } from 'react';
import { useOrganization } from '../../contexts';
import { uploadService } from '../../services/uploadService';
import { videoService } from '../../services/videoService';
import { tagService } from '../../services/tagService';
import TagInput from '../shared/TagInput';
import type { Tag } from '../../generated';
import type { Video } from '../../generated';
import type { UploadProgress } from '../../types';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  video?: Video; // If provided, modal is in edit mode
  videoTags?: string[]; // Current tags for the video (tag paths)
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ isOpen, onClose, onSuccess, video, videoTags }) => {
  const { currentWorkspace } = useOrganization();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!video;

  useEffect(() => {
    if (currentWorkspace && isOpen) {
      fetchTags();
    }
  }, [currentWorkspace, isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (isOpen && video) {
      setTitle(video.title || '');
      setDescription(video.description || '');
      setSelectedTags(videoTags || []);
    } else if (isOpen && !video) {
      // Reset form for create mode
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setSelectedFile(null);
    }
  }, [isOpen, video, videoTags]);

  const fetchTags = async () => {
    try {
      const tags = await tagService.getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a video file');
      setSelectedFile(null);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }

    if (!isEditMode && !selectedFile) {
      setError('Please select a video file');
      return;
    }

    if (!currentWorkspace) {
      setError('No organization selected');
      return;
    }

    setUploading(true);
    setUploadProgress(null);
    setError(null);

    try {
      if (isEditMode && video) {
        // Update existing video
        await videoService.updateVideo(video.id!, {
          title: title,
          description: description
        });

        // Update tags
        await tagService.replaceVideoTags(video.id!, selectedTags);
      } else if (selectedFile) {
        // Upload new video
        await uploadService.uploadFile(
          selectedFile,
          {
            title: title,
            description: description,
            tags: selectedTags.length > 0 ? selectedTags : undefined
          },
          (progress) => {
            setUploadProgress(progress);
          }
        );
      }

      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setUploadProgress(null);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(isEditMode ? 'Update error:' : 'Upload error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || (isEditMode ? 'Update failed' : 'Upload failed');
      setError(errorMessage);
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setError(null);
      setUploadProgress(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div
        className="modal-box p-0 overflow-hidden"
        style={{ width: '85vw', maxWidth: '85vw', height: '85vh', maxHeight: '85vh' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-content">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">{isEditMode ? 'Edit Video' : 'Upload Video'}</h2>
              <p className="text-base-content/80 text-sm">
                {isEditMode ? 'Update your video details' : 'Share your video with your team'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost text-primary-content hover:bg-base-content/20"
              disabled={uploading}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area - Two Column Layout */}
        <div className="flex h-[calc(85vh-180px)] overflow-hidden">
          {/* Left Column - Video Details */}
          <div className="flex-1 p-8 overflow-y-auto border-r border-base-300">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold mb-6">Video Details</h3>

              {error && (
                <div className="alert alert-error mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && uploadProgress && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {uploadProgress.status === 'preparing' && 'Preparing upload...'}
                      {uploadProgress.status === 'uploading' && 'Uploading...'}
                      {uploadProgress.status === 'completing' && 'Finalizing...'}
                      {uploadProgress.status === 'completed' && 'Complete!'}
                    </span>
                    <span className="text-sm font-medium">{uploadProgress.percentage}%</span>
                  </div>
                  <progress className="progress progress-primary w-full" value={uploadProgress.percentage} max="100"></progress>
                  {uploadProgress.uploadSpeed && uploadProgress.uploadSpeed > 0 && (
                    <div className="flex justify-between text-xs opacity-70 mt-1">
                      <span>{uploadService.formatFileSize(uploadProgress.uploadSpeed)}/s</span>
                      {uploadProgress.estimatedTimeRemaining && (
                        <span>~{uploadService.formatTime(uploadProgress.estimatedTimeRemaining)} remaining</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-6">
                {/* Drag and Drop Area - Hidden in edit mode */}
                {!isEditMode && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Video File</span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-primary bg-primary/10'
                          : selectedFile
                          ? 'border-success bg-success/10'
                          : 'border-base-300 hover:border-primary hover:bg-base-200'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="font-medium text-lg">{selectedFile.name}</p>
                          <p className="text-sm opacity-70">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                            className="btn btn-sm btn-ghost text-error mt-2"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="font-medium text-lg">Drop your video here or click to browse</p>
                          <p className="text-sm opacity-60">Supports all video formats</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Video Title</span>
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32 resize-none w-full"
                    placeholder="Add a description to help viewers understand your video content..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tags */}
          <div className="flex-1 p-8 overflow-y-auto bg-base-50">
            <div className="max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Tags</h3>
                <span className="badge badge-lg">{selectedTags.length} Selected</span>
              </div>

              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">Optional: Add tags to help organize and categorize your video content.</span>
              </div>

              <div className="form-control">
                <TagInput
                  allTags={allTags}
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-base-300 px-6 py-4 bg-base-100 flex justify-between items-center">
          <button
            onClick={handleClose}
            className="btn btn-ghost"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || (!isEditMode && !selectedFile) || !title.trim()}
            className="btn btn-primary px-6"
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner"></span>
                {isEditMode ? 'Saving...' : 'Uploading...'}
              </>
            ) : (
              <>
                {isEditMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Video
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default UploadVideoModal;
