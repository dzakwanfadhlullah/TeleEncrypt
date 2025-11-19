import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-[#111827]">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[rgba(0,0,0,0.08)] text-[#111827] placeholder:text-[#9CA3AF] transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.15)] ${error ? 'border-[#EF4444]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
