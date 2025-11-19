import React, { useState } from 'react';
import { Lock, ArrowLeft, Shield, Mail, Calendar, Edit } from 'lucide-react';
import { Button } from '../design-system/Button';

interface ProfileScreenProps {
  user: { name: string; email: string; avatar?: string; authMethod?: string; joinedDate?: string };
  onBack: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ user, onBack, onEditProfile, onLogout }: ProfileScreenProps) {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

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
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">Back to Dashboard</span>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[#111827]">TeleEncrypt</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-8 py-12">
        {/* Header */}
        <h2 
          className="text-[32px] font-[600] text-[#111827] mb-12 tracking-[-0.03em]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Profile
        </h2>

        {/* Profile Card */}
        <div className="bg-white rounded-[24px] border border-[rgba(0,0,0,0.08)] p-8 mb-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="flex items-start justify-between mb-8">
            {/* Avatar & Info */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-2xl font-semibold shadow-[0_8px_16px_-4px_rgba(79,70,229,0.3)]">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
              </div>

              {/* Name & Email */}
              <div>
                <h3 
                  className="text-[24px] font-[600] text-[#111827] mb-1 tracking-[-0.02em]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {user.name}
                </h3>
                <p className="text-[#6B7280] text-sm mb-3">{user.email}</p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] rounded-full w-fit">
                  <Shield className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span className="text-xs text-[#4F46E5] font-medium">Verified Account</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button variant="secondary" onClick={onEditProfile}>
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Email Address</p>
                <p className="text-sm text-[#111827] font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Member Since</p>
                <p className="text-sm text-[#111827] font-medium">{user.joinedDate || 'November 2025'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-[24px] border border-[rgba(0,0,0,0.08)] p-8 mb-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">Security Information</h3>

          <div className="space-y-4">
            {/* Authentication Method */}
            <div 
              className="p-4 rounded-2xl border"
              style={{
                background: 'linear-gradient(135deg, #F0F9FF 0%, #FAFAFA 100%)',
                borderColor: 'rgba(79, 70, 229, 0.15)'
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Shield className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#111827] mb-1">Authentication Method</p>
                  <p className="text-xs text-[#6B7280]">
                    {user.authMethod || 'Logged in with Google OAuth 2.0'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-green-100 rounded-full">
                  <span className="text-xs text-green-700 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Encryption Status */}
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[rgba(0,0,0,0.08)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-[#6B7280]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827] mb-1">End-to-End Encryption</p>
                  <p className="text-xs text-[#6B7280]">
                    All your files are encrypted client-side using AES-256 before upload
                  </p>
                </div>
              </div>
            </div>

            {/* Session Security */}
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[rgba(0,0,0,0.08)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#6B7280]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827] mb-1">Session Security</p>
                  <p className="text-xs text-[#6B7280]">
                    HTTPS connection with automatic session timeout after 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-[24px] border border-red-200 p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-semibold text-[#111827] mb-2">Account Actions</h3>
          <p className="text-sm text-[#6B7280] mb-6">
            Sign out of your account or manage your session
          </p>
          <Button variant="danger" onClick={onLogout}>
            <Lock className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
