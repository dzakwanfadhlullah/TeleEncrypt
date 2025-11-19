import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error';
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'default', icon }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-[var(--text-secondary)]',
    success: 'bg-green-50 text-[var(--success)]',
    error: 'bg-red-50 text-[var(--error)]'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${variants[variant]}`}>
      {icon}
      {children}
    </span>
  );
}
