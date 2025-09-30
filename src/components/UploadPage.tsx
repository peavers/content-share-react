import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../contexts';
import { uploadService } from '../services/uploadService';
import Navigation from './shared/Navigation';

const UploadPage: React.FC = () => {
  const { currentWorkspace } = useOrganization();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
          description: description
        },
        (progress) => {
          console.log('Upload progress:', progress);
        }
      );

      setSuccess(true);
      setSelectedFile(null);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-light text-black mb-4">No Organization Selected</h2>
          <Link
            to="/dashboard"
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation showUploadButton={false} />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-black mb-4">Upload Video</h1>
          <div className="flex items-center space-x-3 text-gray-600">
            <div className="w-6 h-6 bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
              {currentWorkspace.organization.name.charAt(0).toUpperCase()}
            </div>
            <span>
              This video will be uploaded to <strong>{currentWorkspace.organization.name}</strong>
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 border border-green-300 bg-green-50 p-4">
            <p className="text-green-600">Video uploaded successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 border border-red-300 bg-red-50 p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Upload Form */}
        <div className="border border-black p-8">
          <div className="space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-light text-black mb-4">
                Video File *
              </label>
              <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer"
                >
                  {selectedFile ? (
                    <div>
                      <p className="text-black font-light">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Click to choose a different file</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600">Click to select a video file</p>
                      <p className="text-sm text-gray-500 mt-1">MP4, MOV, AVI, etc.</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-light text-black mb-4">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                placeholder="Enter video title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-light text-black mb-4">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                placeholder="Enter video description (optional)"
              />
            </div>

            {/* Upload Button */}
            <div className="flex justify-end items-center pt-4">
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !title.trim()}
                className="bg-black text-white px-8 py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;