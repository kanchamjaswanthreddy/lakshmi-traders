'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        toast.error('Invalid username or password');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #dde1e8 0%, #e8e4ef 30%, #dce8e4 60%, #e8e6dc 100%)' }}>
      <Toaster position="top-right" />
      <div className="w-full max-w-[420px]">
        <div className="bento-card-static p-10">
          <div className="flex justify-center mb-7">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a3a8c 0%, #2d5dd4 100%)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v2H4z" opacity="0.5" />
                <path d="M6 6v14h12V6" />
                <path d="M9 10h6" />
                <path d="M9 13h4" />
                <path d="M9 16h2" />
              </svg>
            </div>
          </div>

          <h1 className="text-center text-[#1A1A1A] text-xl font-bold tracking-tight mb-1">
            Sri Sri Sri Lakshmi Traders
          </h1>
          <p className="text-center text-[#86868B] text-[13px] font-medium mb-8">
            Billing Software — Sign in to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white rounded-xl py-3.5 text-[14px] font-bold hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] font-medium text-[#86868B] mt-5">
          Tadipatri, Ananthapuramu Dist. (A.P.)
        </p>
      </div>
    </div>
  );
}
