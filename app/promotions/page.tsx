"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tag, Calendar, ArrowLeft } from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  description: string;
  discountPerc?: number;
  discountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  motorcycle?: { name: string };
};

export default function PromotionsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => {
         // Filter so public only sees active campaigns
         const active = (Array.isArray(data) ? data : []).filter(c => c.isActive);
         setCampaigns(active);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-10 transition-shadow">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <span className="font-bold tracking-tight text-zinc-400">|</span>
          <span className="font-bold tracking-tight text-blue-500">Active Promotions</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Special Offers & Campaigns</h1>
        <p className="text-zinc-500 mb-8 mt-1">Discover the latest deals, discounts, and exclusive offers for Suzuki motorcycles.</p>

        <div className="space-y-4">
          {loading && <p className="text-zinc-500">Discovering promotions...</p>}
          {!loading && campaigns.length === 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <Tag className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                <h3 className="mt-4 text-lg font-bold">No Active Promotions</h3>
                <p className="text-zinc-500 mt-2">Check back soon for new offers and campaigns!</p>
              </div>
          )}
          
          {campaigns.map(c => (
            <div key={c.id} className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-white to-blue-50/30 p-6 shadow-sm dark:border-blue-900/30 dark:from-zinc-900 dark:to-blue-950/20 transition hover:-translate-y-1 hover:shadow-md">
              <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Tag className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-xl font-bold">{c.title}</h3>
                  {(c.discountPerc || c.discountAmount) && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      {c.discountPerc ? `${c.discountPerc}% OFF` : `$${c.discountAmount} DISCOUNT`}
                    </span>
                  )}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mt-2">{c.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  Valid: {new Date(c.startDate).toLocaleDateString()} to {new Date(c.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
