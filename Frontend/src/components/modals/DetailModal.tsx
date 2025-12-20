import { useEffect, useState } from 'react';
import { X, Download, Trash2, Lock, FileText, Play } from 'lucide-react';
// import { Button } from '../ui/button'; // Removed - using native buttons
import { downloadFile, FileSource } from '../../api';
import { getOrCreateKey, decryptFile } from '../../utils/crypto';

interface DetailModalProps {
  fileId: string;
  fileName: string;
  fileSize: string;
  fileSource: FileSource;
  onClose: () => void;
  onDelete: () => void | Promise<void>;
}

export function DetailModal({
  fileId,
  fileName,
  fileSize,
  fileSource,
  onClose,
  onDelete,
}: DetailModalProps) {
  const [contentUrl, setContentUrl] = useState<string | null>(null);
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // File type helpers
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  const isPdf = ext === 'pdf';
  const isVideo = ['mp4', 'webm', 'mov'].includes(ext);
  const isAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
  const isTextFile = ['txt', 'json', 'js', 'ts', 'md', 'html', 'css', 'csv', 'xml', 'log'].includes(ext);

  // ----------------- AUTO DECRYPT LOGIC -----------------
  useEffect(() => {
    let active = true;

    const fetchAndDecrypt = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Download File Terenkripsi
        const encryptedBlob = await downloadFile(fileId, fileSource);

        if (!active) return;

        // 2. Ambil Key dari LocalStorage
        const key = await getOrCreateKey();

        // 3. Lakukan Dekripsi di Browser
        const originalBlob = await decryptFile(encryptedBlob, key);

        // 4. Buat URL Object
        const url = URL.createObjectURL(originalBlob);
        setContentUrl(url);

        // 5. Jika file teks, baca isinya untuk preview
        if (isTextFile) {
          const text = await originalBlob.text();
          setTextPreview(text.slice(0, 5000));
        }

      } catch (err: any) {
        console.error(err);
        if (active) setError('Failed to decrypt. Key mismatch or corrupted file.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAndDecrypt();

    return () => {
      active = false;
      if (contentUrl) URL.revokeObjectURL(contentUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  // ----------------- HANDLERS -----------------
  const handleDownload = () => {
    if (!contentUrl) return;
    const a = document.createElement('a');
    a.href = contentUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      await onDelete();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] w-full max-w-[640px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3
              className="text-xl font-bold text-gray-900 truncate max-w-[400px]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {fileName}
            </h3>
            <p className="text-sm text-gray-500 mt-1 font-mono">{fileSize}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content Area - constrained height to ensure footer is visible */}
        <div className="p-6 overflow-y-auto bg-gray-50/50 min-h-[150px] max-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-indigo-600 font-medium animate-pulse">
                Decrypting secure content...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <p className="text-sm text-gray-400 mt-2">Try re-uploading the file.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full w-fit text-xs font-bold mx-auto mb-4">
                <Lock className="w-3 h-3" />
                Decrypted Successfully
              </div>

              {/* Image Preview */}
              {isImage && contentUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <img src={contentUrl} alt="Preview" className="w-full h-auto object-contain max-h-[400px]" />
                </div>
              )}

              {/* PDF Preview */}
              {isPdf && contentUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <iframe
                    src={contentUrl}
                    title="PDF Preview"
                    className="w-full h-[500px]"
                  />
                </div>
              )}

              {/* Video Preview */}
              {isVideo && contentUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <video
                    src={contentUrl}
                    controls
                    className="w-full max-h-[400px]"
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              )}

              {/* Audio Preview */}
              {isAudio && contentUrl && (
                <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-indigo-600" />
                  </div>
                  <audio src={contentUrl} controls className="w-full" />
                </div>
              )}

              {/* Text Preview */}
              {textPreview && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto max-h-[400px]">
                    {textPreview}
                  </pre>
                </div>
              )}

              {/* Fallback for unsupported files */}
              {!isImage && !isPdf && !isVideo && !isAudio && !textPreview && (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-900 font-medium">Preview not available</p>
                  <p className="text-sm text-gray-500">Please download the file to view its contents.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions - ALWAYS VISIBLE */}
        <div
          className="flex items-center justify-between p-6 border-t border-gray-100 bg-white gap-4"
          style={{ flexShrink: 0, position: 'relative', zIndex: 100 }}
        >
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <button
            onClick={handleDownload}
            disabled={loading || !!error || !contentUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: loading || error || !contentUrl ? '#9ca3af' : '#4f46e5',
              color: 'white',
              border: 'none',
              cursor: loading || error || !contentUrl ? 'not-allowed' : 'pointer',
              minWidth: '180px'
            }}
          >
            <Download className="w-4 h-4" />
            Download Original
          </button>
        </div>
      </div>
    </div>
  );
}
