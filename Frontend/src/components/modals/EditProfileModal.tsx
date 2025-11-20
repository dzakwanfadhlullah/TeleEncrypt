import React, { useState } from 'react';
import { X, Upload, User } from 'lucide-react';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';

interface EditProfileModalProps {
  user: { name: string; email: string };
  onClose: () => void;
  onSave: (name: string) => void;
}

export function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div 
      className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      {/* Modal Sheet */}
      <div
        className="bg-white rounded-[24px] w-full max-w-[520px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(0,0,0,0.08)]">
          <h3 
            className="text-[24px] font-[600] text-[#111827] tracking-[-0.02em]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Edit Profile
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              {/* Current Avatar */}
              <div className="relative">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-xl font-semibold">
                    {initials}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="cursor-pointer">
                  <div className="px-6 py-3 bg-[#F9FAFB] border border-[rgba(0,0,0,0.08)] rounded-full hover:bg-white transition-colors inline-flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-sm text-[#111827] font-medium">Upload New Photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Email Address
            </label>
            <div className="px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[rgba(0,0,0,0.08)] text-[#9CA3AF] text-sm">
              {user.email}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1.5">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Info Box */}
          <div 
            className="p-4 rounded-2xl border"
            style={{
              background: 'linear-gradient(135deg, #EEF2FF 0%, #FAFAFA 100%)',
              borderColor: 'rgba(79, 70, 229, 0.15)'
            }}
          >
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#111827] font-medium mb-1">Profile Visibility</p>
                <p className="text-xs text-[#6B7280]">
                  Your profile information is private and only visible to you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[rgba(0,0,0,0.08)] bg-[#FAFAFA]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
