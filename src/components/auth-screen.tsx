import React, { useState } from 'react';
import { Lock, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AuthScreenProps {
  onLogin: (email: string, name: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      onLogin(email, name);
    } else {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      // For demo, use email as name basis
      const demoName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
      onLogin(email, demoName);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl">TeleEncrypt</h1>
          </div>
          <p className="text-base text-[var(--text-secondary)]">
            Secure web-based encrypted file storage
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border-light)]">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 px-6 py-3 text-sm transition-all ${
                activeTab === 'login'
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)] -mb-px'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 px-6 py-3 text-sm transition-all ${
                activeTab === 'register'
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)] -mb-px'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4 mb-5">
              {activeTab === 'register' && (
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error && activeTab === 'login' ? error : ''}
              />
              {activeTab === 'register' && (
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={error}
                />
              )}
            </div>

            <div className="mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-900 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                All files are encrypted before being stored
              </p>
            </div>

            <Button type="submit" className="w-full">
              {activeTab === 'login' ? 'Log in' : 'Create account'}
            </Button>

            {activeTab === 'login' && (
              <p className="text-center mt-4 text-xs text-[var(--text-secondary)]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}