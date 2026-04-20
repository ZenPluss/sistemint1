"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, BarChart2, Tag, ArrowRight, ShoppingCart } from "lucide-react";

export default function AdminPortalSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        setIsAdmin(user?.role === "ADMIN");
      }
    } catch {
      setIsAdmin(false);
    }
    setChecked(true);
  }, []);

  // Don't render anything until we've checked localStorage
  if (!checked || !isAdmin) return null;

  const items = [
    { href: "/portal/leads", icon: <Users className="h-8 w-8" />, title: "Lead Management", desc: "Track and manage potential customers seamlessly across the sales pipeline." },
    { href: "/portal/performance", icon: <BarChart2 className="h-8 w-8" />, title: "Sales Analytics", desc: "Monitor team performance metrics, overarching targets, and conversion rates." },
    { href: "/portal/campaigns", icon: <Tag className="h-8 w-8" />, title: "Campaign Manager", desc: "Strategize, create and deploy robust promotions and marketing campaigns." },
    { href: "/portal/orders", icon: <ShoppingCart className="h-8 w-8" />, title: "Purchase Orders", desc: "Review, confirm, and manage all motorcycle purchase orders from customers." },
  ];

  return (
    <section className="w-full py-32 bg-[var(--background)] border-t border-zinc-200/50 dark:border-white/5 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-zinc-900 dark:text-white">Sales Team Portal</h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 mt-6 max-w-2xl mx-auto font-medium leading-relaxed">
            Access the internal tools to manage dealership operations, leads, and overarching sales analytics.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <Link key={i} href={item.href} className="group flex flex-col gap-5 rounded-[2rem] border border-zinc-200/80 bg-white p-10 transition-all duration-500 hover:border-blue-400 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.15)] hover:-translate-y-2 dark:border-white/5 dark:bg-[#0c0e14] dark:hover:border-blue-600/50 dark:hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.2)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600 shadow-inner dark:bg-blue-900/20 dark:text-blue-400 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.4)] group-hover:scale-110">{item.icon}</div>
              <div className="mt-2">
                <h3 className="font-extrabold text-2xl mb-3 text-zinc-900 dark:text-white">{item.title}</h3>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
              <span className="mt-auto pt-6 text-sm font-extrabold text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all dark:text-blue-400 uppercase tracking-widest">Access Portal <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
