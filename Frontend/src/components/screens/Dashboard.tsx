import React, { useState } from 'react';
import {
  Lock,
  FileText,
  Image as ImageIcon,
  FileCode,
  Upload,
  ChevronDown,
  Cloud,
  HardDrive
} from 'lucide-react';
import { Button } from '../design-system/Button';
import { Dropdown } from '../design-system/Dropdown';

// Update Interface: Tambah 'source'
interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'document' | 'image' | 'code';
  uploadedAt: string;
  source: 'cloud' | 'local'; // Penanda sumber file
}

interface DashboardProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  files: FileItem[];
  onFileClick: (fileId: string) => void;
  onUploadFile: (file: File) => void | Promise<void>;
  onViewProfile: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export function Dashboard({
  user,
  files,
  onFileClick,
  onUploadFile,
  onViewProfile,
  onEditProfile,
  onLogout,
}: DashboardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // --- Drag & Drop Handlers ---
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

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      onUploadFile(droppedFiles[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles[0]) {
      onUploadFile(selectedFiles[0]);
    }
    // Reset value agar bisa upload file yang sama berturut-turut
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // --- UI Helpers ---
  const getFileIcon = (type: string) => {
    const iconClass = 'w-6 h-6';
    switch (type) {
      case 'image': return <ImageIcon className={iconClass} />;
      case 'code': return <FileCode className={iconClass} />;
      default: return <FileText className={iconClass} />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-purple-100 text-purple-600';
      case 'code': return 'bg-green-100 text-green-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const initials = user.name.trim().split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase() || 'U';

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="min-h-screen">
      {/* --- NAVBAR --- */}
      <nav
        className="sticky top-0 z-40 px-8 py-4 border-b border-[rgba(0,0,0,0.08)]"
        style={{
          background: 'rgba(250, 250, 250, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[#111827]">TeleEncrypt</span>
          </div>

          <button
            onClick={handleAvatarClick}
            className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-[rgba(0,0,0,0.08)] shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#4F46E5] flex items-center justify-center text-white text-xs font-medium">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="text-sm text-[#111827] font-medium">{user.name}</span>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </nav>

      {/* --- DROPDOWN MENU --- */}
      {showDropdown && (
        <Dropdown
          onViewProfile={() => { setShowDropdown(false); onViewProfile(); }}
          onEditProfile={() => { setShowDropdown(false); onEditProfile(); }}
          onLogout={() => { setShowDropdown(false); onLogout(); }}
          onClose={() => setShowDropdown(false)}
          position={dropdownPosition}
        />
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-[1100px] mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-[32px] font-[600] text-[#111827] mb-2 tracking-[-0.03em]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Files
          </h2>
          <p className="text-[#6B7280] text-sm flex items-center gap-2">
            <Lock className="w-3 h-3" />
            End-to-end encrypted storage (Hybrid Cloud/Local)
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleUploadAreaClick}
          className={`mb-10 h-[200px] rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-[#4F46E5] bg-[#EEF2FF]'
              : 'border-[rgba(0,0,0,0.08)] hover:border-[#4F46E5] hover:bg-[#FAFAFA]'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragActive ? 'bg-[#4F46E5]' : 'bg-[#EEF2FF]'}`}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-white' : 'text-[#4F46E5]'}`} />
          </div>
          <p className="text-[#111827] font-medium mb-1">Upload a file</p>
          <p className="text-[#9CA3AF] text-sm">Drag and drop or click to browse (You can choose storage later)</p>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileInputChange} />
        </div>

        {/* --- FILE GRID (UPDATED) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onFileClick(file.id)}
              className="group bg-white rounded-[16px] border border-[rgba(0,0,0,0.08)] p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-500 relative"
            >
              {/* Header: Icon & Source Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getFileColor(file.type)}`}>
                  {getFileIcon(file.type)}
                </div>
                
                {/* Source Indicator Badge */}
                <div 
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border ${
                    file.source === 'cloud' 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}
                  title={file.source === 'cloud' ? 'Stored in Cloud Server' : 'Stored in Local Browser'}
                >
                  {file.source === 'cloud' ? <Cloud className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
                  <span className="uppercase">{file.source}</span>
                </div>
              </div>

              {/* File Info */}
              <h3 className="text-sm font-bold text-[#111827] mb-1 truncate">
                {file.name}
              </h3>
              <p className="text-xs text-[#9CA3AF] mb-4 font-mono">
                {file.size} • {file.uploadedAt}
              </p>

              {/* Footer: Encrypted Badge & Button */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-medium">
                  <Lock className="w-3 h-3" />
                  <span className="hidden sm:inline">AES-256</span>
                </div>
                
                <span className="text-xs text-indigo-600 font-semibold underline decoration-indigo-200 underline-offset-2 group-hover:text-indigo-800 transition-colors">
                  Lihat File →
                </span>
              </div>
            </div>
          ))}

          {files.length === 0 && (
            <div className="col-span-full text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
              No files uploaded yet. Try uploading one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}