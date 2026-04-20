'use client';

// Added: Navbar Client Component for user session display
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Shield } from 'lucide-react';

export default function NavbarClient() {
  const [user, setUser] = useState<any>(null);

  const [currency, setCurrency] = useState<string>("USD");

  useEffect(() => {
    // Read user info from localStorage (set during login)
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser(null);
      }
    }
    
    // Read currency from cookie
    const match = document.cookie.match(/(^| )currency=([^;]+)/);
    if (match) setCurrency(match[2]);
  }, []);

  const handleCurrencyChange = (c: string) => {
    setCurrency(c);
    document.cookie = `currency=${c}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) {
    // Not logged in: show Login / Sign Up buttons
    return (
      <div className="flex items-center gap-4">
        <select value={currency} onChange={e => handleCurrencyChange(e.target.value)} className="bg-white/10 border border-white/20 text-xs font-bold text-white uppercase rounded-full px-3 py-1.5 outline-none cursor-pointer backdrop-blur-sm hover:bg-white/20 transition-all">
          <option value="USD" className="text-black bg-white">USD $</option>
          <option value="EUR" className="text-black bg-white">EUR €</option>
          <option value="IDR" className="text-black bg-white">IDR Rp</option>
          <option value="JPY" className="text-black bg-white">JPY ¥</option>
        </select>
        <Link href="/auth/login" className="text-sm font-bold text-zinc-200 hover:text-white transition-colors">Login</Link>
        <Link href="/auth/register" className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:scale-105 active:scale-95">
          Sign Up
        </Link>
      </div>
    );
  }

  // Logged in: show user name, admin link if admin, and logout
  return (
    <div className="flex items-center gap-3">
      <select value={currency} onChange={e => handleCurrencyChange(e.target.value)} className="bg-white/10 border border-white/20 text-xs font-bold text-white uppercase rounded-full px-3 py-1.5 outline-none cursor-pointer backdrop-blur-sm hover:bg-white/20 transition-all">
        <option value="USD" className="text-black bg-white">USD $</option>
        <option value="EUR" className="text-black bg-white">EUR €</option>
        <option value="IDR" className="text-black bg-white">IDR Rp</option>
        <option value="JPY" className="text-black bg-white">JPY ¥</option>
      </select>
      {user.role === 'ADMIN' && (
        <Link
          href="/admin-scm"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 border border-blue-500/40 rounded-full px-3 py-1.5 transition-all hover:bg-blue-500/10"
        >
          <Shield className="h-3.5 w-3.5" /> SCM Admin
        </Link>
      )}
      <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2">
        <User className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-semibold text-white max-w-[120px] truncate">{user.name}</span>
      </div>
      <button
        onClick={handleLogout}
        title="Logout"
        className="flex items-center justify-center h-9 w-9 rounded-full bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 text-zinc-400 border border-white/10 transition-all"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
