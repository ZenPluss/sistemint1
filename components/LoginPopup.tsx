"use client";

import Link from "next/link";
import { X, Lock } from "lucide-react";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginPopup({ isOpen, onClose, message = "Anda harus login untuk menggunakan fitur ini." }: LoginPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-md animate-fade-in-up rounded-3xl border border-white/10 bg-white dark:bg-zinc-900 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          <Lock className="h-8 w-8" />
        </div>

        <h3 className="mb-2 text-2xl font-black text-zinc-900 dark:text-white">Akses Dibatasi</h3>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400 font-medium">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/auth/login"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
          >
            Login Sekarang
          </Link>
          <button 
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
