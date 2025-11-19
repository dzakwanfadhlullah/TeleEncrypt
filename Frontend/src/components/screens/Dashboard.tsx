import React, { useState } from 'react';
import { Lock, FileText, Image as ImageIcon, FileCode, Upload, User, ChevronDown } from 'lucide-react';
import { Button } from '../design-system/Button';
import { Dropdown } from '../design-system/Dropdown';

interface DashboardProps {
  user: { name: string; email: string };
  files: FileItem[];
  onFileClick: (fileId: string) => void;
  onUploadFile: (file: File) => void;
  onViewProfile: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'document' | 'image' | 'code';
  uploadedAt: string;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'quarterly-report.pdf', size: '2.4 MB', type: 'document', uploadedAt: 'Nov 15, 2025' },
  { id: '2', name: 'product-screenshot.png', size: '1.8 MB', type: 'image', uploadedAt: 'Nov 14, 2025' },
  { id: '3', name: 'api-documentation.txt', size: '156 KB', type: 'code', uploadedAt: 'Nov 12, 2025' },
  { id: '4', name: 'financial-data.xlsx', size: '890 KB', type: 'document', uploadedAt: 'Nov 10, 2025' },
  { id: '5', name: 'security-audit.pdf', size: '3.2 MB', type: 'document', uploadedAt: 'Nov 8, 2025' },
  { id: '6', name: 'logo-design.svg', size: '245 KB', type: 'image', uploadedAt: 'Nov 5, 2025' },
];

export function Dashboard({ user, files, onFileClick, onUploadFile, onViewProfile, onEditProfile, onLogout }: DashboardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onUploadFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onUploadFile(files[0]);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    const iconClass = 'w-6 h-6';
    switch (type) {
      case 'image':
        return <ImageIcon className={iconClass} />;
      case 'code':
        return <FileCode className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-purple-100 text-purple-600';
      case 'code':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    });
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="min-h-screen">
      {/* Glassmorphic Navbar */}
      <nav 
        className="sticky top-0 z-40 px-8 py-4 border-b border-[rgba(0,0,0,0.08)]"
        style={{
          background: 'rgba(250, 250, 250, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[#111827]">TeleEncrypt</span>
          </div>

          {/* User Badge - Now Clickable */}
          <button 
            onClick={handleAvatarClick}
            className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-[rgba(0,0,0,0.08)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_12px_-2px_rgba(0,0,0,0.08)] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xs font-medium">
              {initials}
            </div>
            <span className="text-sm text-[#111827] font-medium">{user.name}</span>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {showDropdown && (
        <Dropdown
          onViewProfile={() => {
            setShowDropdown(false);
            onViewProfile();
          }}
          onEditProfile={() => {
            setShowDropdown(false);
            onEditProfile();
          }}
          onLogout={() => {
            setShowDropdown(false);
            onLogout();
          }}
          onClose={() => setShowDropdown(false)}
          position={dropdownPosition}
        />
      )}

      {/* Main Content */}
      <div className="max-w-[1100px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-[32px] font-[600] text-[#111827] mb-2 tracking-[-0.03em]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Your Files
          </h2>
          <p className="text-[#6B7280] text-sm">
            Encrypted locally using AES-256
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
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
            dragActive ? 'bg-[#4F46E5]' : 'bg-[#EEF2FF]'
          }`}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-white' : 'text-[#4F46E5]'}`} />
          </div>
          <p className="text-[#111827] font-medium mb-1">Upload a file</p>
          <p className="text-[#9CA3AF] text-sm">Drag and drop or click to browse</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-3 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onFileClick(file.id)}
              className="group bg-white rounded-[16px] border border-[rgba(0,0,0,0.08)] p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.01)] hover:-translate-y-2 hover:border-[#4F46E5]"
            >
              {/* File Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getFileColor(file.type)}`}>
                {getFileIcon(file.type)}
              </div>

              {/* File Name */}
              <h3 className="text-sm font-semibold text-[#111827] mb-1 truncate">
                {file.name}
              </h3>

              {/* File Size */}
              <p className="text-xs text-[#9CA3AF] mb-4 font-mono">
                {file.size}
              </p>

              {/* Encrypted Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF2FF] rounded-full w-fit">
                <Lock className="w-3 h-3 text-[#4F46E5]" />
                <span className="text-xs text-[#4F46E5] font-medium">Encrypted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}