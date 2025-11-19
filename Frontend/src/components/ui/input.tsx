import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 rounded-lg border text-sm ${
          error ? 'border-[var(--error)]' : 'border-[var(--border)]'
        } bg-white text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}