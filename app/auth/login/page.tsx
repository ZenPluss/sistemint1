"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to log in");
      }

      const resData = await res.json();
      localStorage.setItem("user", JSON.stringify(resData.user));
      toast.success(`Welcome back, ${resData.user.name}! 🎉`);
      // redirect to home
      setTimeout(() => { window.location.href = "/"; }, 800);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "Login failed!");
      // Add a small delay so user can read error, then redirect to register
      setTimeout(() => {
        window.location.href = "/auth/register";
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>
      
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <img src="/favicon.ico" alt="Logo" className="h-12 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-center text-zinc-500 text-sm mb-8">Log in to manage your bookings and applications.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 space-y-1">
              <p className="font-bold">{error}</p>
              <p className="text-xs text-red-400">Akun tidak ditemukan. Mengarahkan ke halaman Registrasi dalam 2 detik...</p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input name="email" type="email" required className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-800" placeholder="john@example.com" />
          </div>

          <div className="space-y-2">
             <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</Link>
             </div>
            <input name="password" type="password" required className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-800" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 mt-4 shadow-lg shadow-blue-600/20">
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-zinc-500 pt-4">
            Don&apos;t have an account? <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
