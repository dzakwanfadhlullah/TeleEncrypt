import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 text-sm';
  
  const variants = {
    primary: 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 shadow-sm',
    secondary: 'bg-white text-[var(--text-primary)] border border-[var(--border)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2',
    text: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}