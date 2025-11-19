import React from 'react';
import { User, Shield, Calendar } from 'lucide-react';
import { Button } from './ui/button';

interface AccountProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export function Account({ user, onLogout }: AccountProps) {
  return (
    <div className="flex-1 bg-[var(--bg-page)] overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="mb-8">Account</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 mb-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h2>{user.name}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-1">Full Name</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-1">Member since</p>
              <p>November 2025</p>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 mb-5">
          <h3 className="mb-4">Security</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm mb-0.5">Session secured via HTTPS</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your connection is encrypted end-to-end
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm mb-0.5">Files encrypted server-side before database storage</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Using AES-256 encryption at rest
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm mb-0.5">Database access shows only encrypted blobs</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Original content never visible in raw database queries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onLogout}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}