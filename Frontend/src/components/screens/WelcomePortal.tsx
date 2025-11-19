import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../design-system/Button';

interface WelcomePortalProps {
  onNavigate: (screen: string) => void;
}

export function WelcomePortal({ onNavigate }: WelcomePortalProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="flex flex-col items-center">
        {/* Centerpiece Icon with Pulsing Circle */}
        <div className="relative mb-12">
          {/* Pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#EEF2FF] animate-pulse" 
                 style={{ animationDuration: '2s' }} />
          </div>
          
          {/* Icon */}
          <div className="relative w-20 h-20 rounded-2xl bg-[#4F46E5] flex items-center justify-center shadow-[0_20px_25px_-5px_rgba(79,70,229,0.3)]">
            <Shield className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[48px] font-[600] text-[#111827] mb-4 text-center tracking-[-0.03em]" 
            style={{ fontFamily: 'Playfair Display, serif' }}>
          Security, Reimagined.
        </h1>

        {/* Subtitle */}
        <p className="text-[#6B7280] text-base mb-12 text-center max-w-md">
          Client-side encryption meets world-class design.
        </p>

        {/* Button Stack */}
        <div className="flex flex-col gap-3 w-80">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => onNavigate('login')}
          >
            Log In
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => onNavigate('register')}
          >
            Create Account
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => onNavigate('dashboard')}
          >
            Guest Access
          </Button>
        </div>
      </div>
    </div>
  );
}
