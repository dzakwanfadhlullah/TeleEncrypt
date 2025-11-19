import React, { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface UploadModalProps {
  onClose: () => void;
}

export function UploadModal({ onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setStatus('uploading');
    // Simulate upload
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-[var(--success)]" />
          </div>
          <h2 className="mb-2">File uploaded successfully</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Your file has been encrypted and securely stored
          </p>
          <div className="flex gap-2.5">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1" onClick={onClose}>
              View file
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)]">
          <h2>Upload & Encrypt File</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            disabled={status === 'uploading'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <p className="text-sm text-[var(--text-secondary)]">
            Your file will be encrypted before being stored in the database
          </p>

          {/* Drag and drop area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
              dragActive
                ? 'border-[var(--accent-primary)] bg-blue-50'
                : 'border-[var(--border)] hover:border-gray-300'
            } ${status === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={status === 'uploading'}
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
            />
            
            <div className="pointer-events-none">
              {file ? (
                <>
                  <div className="w-11 h-11 rounded-lg bg-[var(--accent-primary)] bg-opacity-10 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <p className="text-sm mb-1">{file.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm mb-1">Drop your file here or click to browse</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Max 50 MB · PDF, DOCX, TXT, images
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes about this file..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              rows={3}
              disabled={status === 'uploading'}
            />
          </div>

          {status === 'uploading' && (
            <div className="flex items-center justify-center gap-2.5 p-3 bg-blue-50 rounded-lg">
              <Loader2 className="w-4 h-4 text-[var(--accent-primary)] animate-spin" />
              <p className="text-sm text-blue-900">Encrypting file...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 text-[var(--error)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900">Upload failed. Please try again.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 p-5 border-t border-[var(--border-light)]">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={status === 'uploading'}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleUpload}
            disabled={!file || status === 'uploading'}
          >
            {status === 'uploading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Encrypting...
              </>
            ) : (
              'Encrypt & Upload'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}