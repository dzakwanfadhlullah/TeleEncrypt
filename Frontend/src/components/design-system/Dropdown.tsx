import React, { useEffect, useRef } from 'react';
import { User, Edit, LogOut } from 'lucide-react';

interface DropdownProps {
  onViewProfile: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onClose: () => void;
  position: { top: number; right: number };
}

export function Dropdown({ onViewProfile, onEditProfile, onLogout, onClose, position }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 w-56 bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.08)] overflow-hidden animate-in"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
        animation: 'slideDown 0.2s ease-out'
      }}
    >
      <div className="py-2">
        <button
          onClick={onViewProfile}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#FAFAFA] transition-colors text-left"
        >
          <User className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#111827]">View Profile</span>
        </button>

        <button
          onClick={onEditProfile}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#FAFAFA] transition-colors text-left"
        >
          <Edit className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#111827]">Edit Profile</span>
        </button>

        <div className="h-px bg-[rgba(0,0,0,0.08)] my-2" />

        <button
          onClick={onLogout}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-[#EF4444]" />
          <span className="text-sm text-[#EF4444]">Log Out</span>
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
