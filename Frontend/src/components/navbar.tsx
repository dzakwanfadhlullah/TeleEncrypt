import React from 'react';
import { Lock, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  user?: { name: string; email: string };
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <nav className="h-14 bg-white border-b border-[var(--border-light)] px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
          <Lock className="w-4 h-4 text-white" />
        </div>
        <span className="text-base">TeleEncrypt</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs">
            {initials}
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{user.email}</span>
        </div>
        <Button variant="text" onClick={onLogout} className="text-xs">
          Log out
        </Button>
      </div>
    </nav>
  );
}