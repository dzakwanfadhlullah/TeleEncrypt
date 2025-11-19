import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai' | 'danger';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#4F46E5] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 active:translate-y-0',
    
    secondary: 'bg-white text-[#111827] border border-[rgba(0,0,0,0.08)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.01)] hover:-translate-y-0.5',
    
    ghost: 'bg-transparent text-[#6B7280] hover:bg-[rgba(0,0,0,0.04)] hover:text-[#111827]',
    
    ai: 'bg-white text-[#111827] border border-[rgba(0,0,0,0.08)] hover:border-[#EC4899] hover:text-[#EC4899] hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
    
    danger: 'bg-transparent text-[#EF4444] hover:bg-red-50'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
