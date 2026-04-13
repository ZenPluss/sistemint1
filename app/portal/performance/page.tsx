"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Target, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function PerformanceDashboard() {
  const [mounted, setMounted] = useState(false);

  const [kpis, setKpis] = useState({ totalBookings: 0, totalLeads: 0, activePromotions: 0, conversionRate: "0.0" });

  useEffect(() => {
    setMounted(true);
    fetch("/api/performance")
      .then(res => res.json())
      .then(data => {
        if(data && !data.error) setKpis(data);
      });
  }, []);

  const monthlySalesData = [
    { name: 'Jan', actual: 40, target: 45 },
    { name: 'Feb', actual: 55, target: 50 },
    { name: 'Mar', actual: 60, target: 55 },
    { name: 'Apr', actual: 48, target: 60 },
    { name: 'May', actual: 75, target: 65 },
    { name: 'Jun', actual: 80, target: 70 },
  ];

  const leadConversionData = [
    { name: 'Week 1', leads: 120, converted: 20 },
    { name: 'Week 2', leads: 140, converted: 25 },
    { name: 'Week 3', leads: 130, converted: 22 },
    { name: 'Week 4', leads: 160, converted: 35 },
  ];

  return (
    <div className="flex flex-col gap-8 bg-zinc-50 dark:bg-zinc-950 p-6 font-sans min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Sales Performance</h1>
        <p className="text-zinc-500">View real-time DB KPIs alongside target charts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Bookings (DB)", value: kpis.totalBookings, icon: <TrendingUp className="h-4 w-4" />, up: true, trend: "Live" },
          { title: "Active Leads (DB)", value: kpis.totalLeads, icon: <Users className="h-4 w-4" />, up: true, trend: "Live" },
          { title: "Active Promos (DB)", value: kpis.activePromotions, icon: <Target className="h-4 w-4" />, up: true, trend: "Live" },
          { title: "Conv. Rate (DB)", value: `${kpis.conversionRate}%`, icon: <CheckCircle className="h-4 w-4" />, up: true, trend: "Live" },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium tracking-tight text-zinc-500">{kpi.title}</span>
              <span className="text-zinc-400">{kpi.icon}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold">{kpi.value}</span>
              <span className={`text-xs font-medium ${kpi.up ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-4 h-[400px]">
          <h3 className="font-semibold text-lg">Monthly Sales vs Target</h3>
          <div className="flex-1 min-h-0 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525B" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="actual" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#E4E4E7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-4 h-[400px]">
          <h3 className="font-semibold text-lg">Lead Conversion Trend</h3>
          <div className="flex-1 min-h-0 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadConversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525B" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="converted" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="leads" stroke="#A1A1AA" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
