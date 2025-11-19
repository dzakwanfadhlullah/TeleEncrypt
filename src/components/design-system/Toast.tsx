import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  emoji?: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, emoji = '✅', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white rounded-full px-6 py-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] flex items-center gap-3 border border-[rgba(0,0,0,0.08)]">
        <span className="text-xl">{emoji}</span>
        <p className="text-sm font-medium text-[#111827]">{message}</p>
      </div>
    </div>
  );
}
