"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Trash2, Edit2, Loader2, Power } from "lucide-react";
import toast from "react-hot-toast";

type Promotion = {
  id: string;
  title: string;
  description: string;
  discountPerc: number | null;
  discountAmount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPerc, setDiscountPerc] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch("/api/promotions");
      const data = await res.json();
      setPromotions(data);
    } catch (err) {
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, discountPerc, discountAmount, startDate, endDate
        })
      });

      if (!res.ok) throw new Error("Failed to create promotion");
      
      toast.success("Promotion created!");
      setShowForm(false);
      setTitle(""); setDescription(""); setDiscountPerc(""); setDiscountAmount(""); setStartDate(""); setEndDate("");
      fetchPromotions();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/promotions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (!res.ok) throw new Error();
      toast.success("Status updated");
      fetchPromotions();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      const res = await fetch("/api/promotions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      toast.success("Promotion deleted");
      fetchPromotions();
    } catch (err) {
      toast.error("Failed to delete promotion");
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" /></div>;

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
            <Tag className="w-8 h-8 text-blue-600" />
            Promotions Management
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Create and manage active promotions displayed on the homepage.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
        >
          {showForm ? <XCircle /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel" : "Add Promotion"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl animate-fade-in-up">
          <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">New Promotion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Title</label>
              <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3" placeholder="e.g. Summer Sale" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
              <input required value={description} onChange={e=>setDescription(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3" placeholder="Brief details about the promo" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Discount Percentage (%)</label>
              <input type="number" min="0" max="100" value={discountPerc} onChange={e=>setDiscountPerc(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3" placeholder="e.g. 10" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Discount Amount ($)</label>
              <input type="number" min="0" value={discountAmount} onChange={e=>setDiscountAmount(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3" placeholder="e.g. 500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Start Date</label>
              <input type="date" required value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">End Date</label>
              <input type="date" required value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3" />
            </div>
          </div>
          <button disabled={saving} type="submit" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Promotion"}
          </button>
        </form>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => (
          <div key={promo.id} className={`rounded-3xl border p-6 transition-all ${promo.isActive ? 'bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-900/50 shadow-lg' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-75'}`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${promo.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                {promo.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(promo.id, promo.isActive)} className="p-2 rounded-lg bg-zinc-100 hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-800 text-zinc-500 transition-colors" title="Toggle Status">
                  <Power className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(promo.id)} className="p-2 rounded-lg bg-zinc-100 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-800 text-zinc-500 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{promo.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{promo.description}</p>
            
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 mb-4 border border-zinc-100 dark:border-zinc-800">
              {promo.discountPerc && <p className="text-sm font-bold text-blue-600">{promo.discountPerc}% OFF</p>}
              {promo.discountAmount && <p className="text-sm font-bold text-blue-600">${promo.discountAmount} OFF</p>}
              {!promo.discountPerc && !promo.discountAmount && <p className="text-sm font-medium text-zinc-500">No explicit discount value</p>}
            </div>
            
            <div className="flex justify-between items-center text-xs text-zinc-500">
              <span>{new Date(promo.startDate).toLocaleDateString()}</span>
              <span>-</span>
              <span>{new Date(promo.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {promotions.length === 0 && !showForm && (
          <div className="col-span-full text-center p-12 text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl">
            No promotions found. Create your first one to display it on the homepage.
          </div>
        )}
      </div>
    </div>
  );
}
