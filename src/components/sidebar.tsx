import React from 'react';
import { Files, Upload, User, Shield } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'files', icon: Files, label: 'Files' },
    { id: 'upload', icon: Upload, label: 'Upload File' },
    { id: 'account', icon: User, label: 'Account' }
  ];

  return (
    <aside className="w-56 bg-white border-r border-[var(--border-light)] flex flex-col py-3">
      <div className="flex-1 px-3">
        <nav className="space-y-0.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-[var(--accent-primary)] bg-opacity-10 text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-gray-50 hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pt-3 border-t border-[var(--border-light)]">
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50">
          <Shield className="w-3.5 h-3.5 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">AES-256 encryption at rest</p>
          </div>
        </div>
      </div>
    </aside>
  );
}