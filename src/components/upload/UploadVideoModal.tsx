import React, { useState, useEffect, useRef } from 'react';
import { useOrganization } from '../../contexts';
import { uploadService } from '../../services/uploadService';
import { tagService } from '../../services/tagService';
import TagInput from '../shared/TagInput';
import type { Tag } from '../../generated';
import type { UploadProgress } from '../../types';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ isOpen, onClose, onSuccess }) => {
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

  useEffect(() => {
    if (currentWorkspace && isOpen) {
      fetchTags();
    }
  }, [currentWorkspace, isOpen]);

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
    if (!selectedFile || !title.trim()) {
      setError('Please select a video file and provide a title');
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

      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setUploadProgress(null);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
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
        className="modal-box max-w-2xl"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Upload Video</h3>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={uploading}
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && uploadProgress && (
          <div className="mb-4">
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

        <div className="space-y-4">
          {/* Drag and Drop Area */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Video File</span>
              <span className="label-text-alt text-error">* Required</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
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
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm opacity-70">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="btn btn-sm btn-ghost text-error"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="font-medium">Drop your video here or click to browse</p>
                  <p className="text-sm opacity-70">Supports all video formats</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="form-control">
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
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Description</span>
              <span className="label-text-alt opacity-70">Optional</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 resize-none w-full"
              placeholder="Add a description to help viewers understand your video content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Tags */}
          <div className="form-control">
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
        </div>

        <div className="modal-action">
          <button
            onClick={handleClose}
            className="btn btn-ghost"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !title.trim()}
            className="btn btn-primary gap-2"
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
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default UploadVideoModal;
