"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to register");
      }

      setSuccess(true);
      // Basic login state tracking for demo purposes
      localStorage.setItem("user", JSON.stringify((await res.json()).user));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
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
        <h1 className="text-2xl font-bold text-center mb-2 tracking-tight">Create an Account</h1>
        <p className="text-center text-zinc-500 text-sm mb-8">Join SuzukiRide to book rides and manage your financing applications.</p>
        
        {success ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold">Registration Successful</h3>
            <p className="text-sm text-zinc-500 mt-2 mb-6">Your account has been created successfully.</p>
            <Link href="/" className="w-full inline-flex justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
              Go to Home Directory
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input name="name" required className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-800" placeholder="John Doe" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input name="email" type="email" required className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-800" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input name="password" type="password" required className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-800" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 mt-4 shadow-lg shadow-blue-600/20">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-center text-sm text-zinc-500 pt-4">
              Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
