"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Tag, Calendar, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", discountPerc: "", discountAmount: "", startDate: "", endDate: "" });

  const fetchCampaigns = () => {
    setLoading(true);
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => setCampaigns(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleAdd = async () => {
    if (!form.title || !form.startDate || !form.endDate) {
      toast.error("Please fill in Title, Start Date and End Date.");
      return;
    }
    
    try {
      const loadingToast = toast.loading("Saving campaign...");
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          discountPerc: form.discountPerc ? Number(form.discountPerc) : undefined,
          discountAmount: form.discountAmount ? Number(form.discountAmount) : undefined,
          startDate: form.startDate,
          endDate: form.endDate,
        })
      });
      toast.dismiss(loadingToast);
      if (res.ok) {
        toast.success("Campaign saved to database!");
        setForm({ title: "", description: "", discountPerc: "", discountAmount: "", startDate: "", endDate: "" });
        setShowForm(false);
        fetchCampaigns();
      } else {
        toast.error("Failed to save campaign.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/promotions?id=${id}`, { method: "DELETE" });
      toast.success("Campaign deleted.");
      fetchCampaigns();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete campaign.");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/promotions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      toast.success(currentStatus ? "Campaign deactivated." : "Campaign activated! 🎉");
      fetchCampaigns();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update campaign status.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-10 transition-shadow">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <span className="font-bold tracking-tight text-zinc-400">|</span>
          <span className="font-bold tracking-tight">Sales Team Portal</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaign Management</h1>
            <p className="text-zinc-500 text-sm mt-1">Create and manage active DB promotional campaigns.</p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="h-4 w-4" /> New Campaign
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-semibold mb-4">New Promotion Record</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Campaign Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Eid Special Offer"
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Brief description of the campaign..."
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Discount (%)</label>
                <input
                  type="number"
                  value={form.discountPerc}
                  onChange={e => setForm(f => ({ ...f, discountPerc: e.target.value }))}
                  placeholder="e.g. 10"
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Discount ($ Amount)</label>
                <input
                  type="number"
                  value={form.discountAmount}
                  onChange={e => setForm(f => ({ ...f, discountAmount: e.target.value }))}
                  placeholder="e.g. 500"
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Date *</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">End Date *</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Cancel</button>
                <button onClick={handleAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save to Database</button>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Cards */}
        <div className="space-y-4">
          {loading && <p className="text-zinc-500">Loading campaigns from DB...</p>}
          {!loading && campaigns.length === 0 && <p className="text-zinc-500">No campaigns found in DB.</p>}
          
          {campaigns.map(c => (
            <div key={c.id} className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <Tag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{c.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                  {(c.discountPerc || c.discountAmount) && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                      {c.discountPerc ? `${c.discountPerc}% OFF` : `$${c.discountAmount} OFF`}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-500">{c.description}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-zinc-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(c.id, c.isActive)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                  {c.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
