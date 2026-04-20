'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide the back button on the homepage or login/register pages
  if (
    pathname === '/' ||
    pathname.startsWith('/auth')
  ) {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.4)] transition-transform hover:scale-110 active:scale-95 border border-white/20 hover:bg-blue-500"
      title="Go Back"
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
  );
}
