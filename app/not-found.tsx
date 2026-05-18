import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white px-6 text-center">
      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
        <SearchX className="h-14 w-14 text-blue-400" />
      </div>
      <p className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">404 — Page Not Found</p>
      <h1 className="text-5xl font-black tracking-tight mb-4 text-white">
        Oops! Nothing here.
      </h1>
      <p className="text-lg text-zinc-400 font-medium max-w-md leading-relaxed mb-10">
        The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex h-13 items-center justify-center rounded-full bg-white px-8 py-3 text-base font-extrabold text-zinc-950 shadow-lg transition-all hover:scale-105 hover:bg-zinc-100 active:scale-95"
        >
          Back to Home
        </Link>
        <Link
          href="/motorcycles"
          className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-8 py-3 text-base font-bold text-zinc-200 transition-all hover:scale-105 hover:border-zinc-500 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Catalog
        </Link>
      </div>
    </div>
  );
}
