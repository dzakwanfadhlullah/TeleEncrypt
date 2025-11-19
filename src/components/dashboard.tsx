import React, { useState } from 'react';
import { Plus, Eye, Lock, Shield, FileText, Image as ImageIcon, FileType } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface File {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  type: string;
}

interface DashboardProps {
  onViewFile: (fileId: string) => void;
  onUpload: () => void;
}

export function Dashboard({ onViewFile, onUpload }: DashboardProps) {
  const [files] = useState<File[]>([
    {
      id: '1',
      name: 'Q4_Financial_Report.pdf',
      size: '2.4 MB',
      uploadedAt: '2025-11-15 14:32',
      uploadedBy: 'John Doe',
      type: 'pdf'
    },
    {
      id: '2',
      name: 'Vehicle_Telemetry_Data.xlsx',
      size: '5.1 MB',
      uploadedAt: '2025-11-14 09:15',
      uploadedBy: 'Jane Smith',
      type: 'xlsx'
    },
    {
      id: '3',
      name: 'Security_Protocol.docx',
      size: '892 KB',
      uploadedAt: '2025-11-12 16:48',
      uploadedBy: 'John Doe',
      type: 'docx'
    },
    {
      id: '4',
      name: 'Dashboard_Screenshot.png',
      size: '1.2 MB',
      uploadedAt: '2025-11-10 11:23',
      uploadedBy: 'Mike Johnson',
      type: 'png'
    }
  ]);

  const getFileIcon = (type: string) => {
    if (type.includes('png') || type.includes('jpg') || type.includes('jpeg')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    if (type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <FileType className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="flex-1 bg-[var(--bg-page)] overflow-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1>Encrypted Files</h1>
          <Button onClick={onUpload}>
            <Plus className="w-4 h-4" />
            Upload file
          </Button>
        </div>

        {/* Info text */}
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Files are stored as encrypted data in the database
        </p>

        {/* Files list */}
        {files.length > 0 ? (
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--bg-page)] border-b border-[var(--border-light)]">
                <tr>
                  <th className="text-left px-5 py-3 text-xs text-[var(--text-secondary)]">File name</th>
                  <th className="text-left px-5 py-3 text-xs text-[var(--text-secondary)]">Size</th>
                  <th className="text-left px-5 py-3 text-xs text-[var(--text-secondary)]">Uploaded</th>
                  <th className="text-left px-5 py-3 text-xs text-[var(--text-secondary)]">Status</th>
                  <th className="text-left px-5 py-3 text-xs text-[var(--text-secondary)]">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr
                    key={file.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      index !== files.length - 1 ? 'border-b border-[var(--border-light)]' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {getFileIcon(file.type)}
                        <span className="text-sm">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{file.size}</td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{file.uploadedAt}</td>
                    <td className="px-5 py-3.5">
                      <Badge icon={<Lock className="w-3 h-3" />}>Encrypted</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Button variant="text" onClick={() => onViewFile(file.id)} className="text-xs">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[var(--border)] p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="mb-2">No files yet</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Upload your first file to get started
            </p>
            <Button onClick={onUpload}>
              <Plus className="w-4 h-4" />
              Upload a file
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}