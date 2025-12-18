import React from 'react';
import { Cloud, HardDrive, X } from 'lucide-react';

interface StorageOptionModalProps {
  fileName: string;
  onClose: () => void;
  onSelect: (source: 'cloud' | 'local') => void;
}

export function StorageOptionModal({ fileName, onClose, onSelect }: StorageOptionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Choose Storage</h3>
            <p className="text-xs text-gray-500 mt-1">Where do you want to save <span className="font-medium text-gray-700">"{fileName}"</span>?</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {/* Option A: Cloud */}
          <button
            onClick={() => onSelect('cloud')}
            className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cloud className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700">Cloud Storage</h4>
            <p className="text-xs text-center text-gray-500 mt-1">
              Save to centralized database. Accessible from any device.
            </p>
          </button>

          {/* Option B: Local */}
          <button
            onClick={() => onSelect('local')}
            className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <HardDrive className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700">Local Browser</h4>
            <p className="text-xs text-center text-gray-500 mt-1">
              Save to this browser only. Maximum privacy, no server upload.
            </p>
          </button>
        </div>

        {/* Footer info */}
        <div className="px-6 pb-6 text-center">
          <p className="text-[10px] text-gray-400 bg-gray-50 py-2 rounded-lg">
            🔒 Files will be encrypted with AES-256 before storage regardless of your choice.
          </p>
        </div>
      </div>
    </div>
  );
}