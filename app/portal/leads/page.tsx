"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, ArrowLeft } from "lucide-react";

type Lead = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: "NEW" | "FOLLOW_UP" | "HOT" | "CONVERTED" | "LOST";
  createdAt: string;
  motorcycle?: { name: string };
};

export default function LeadsBoardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const fetchLeads = () => {
    setLoading(true);
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          status: "NEW"
        })
      });
      if (res.ok) {
        setForm({ name: "", email: "", phone: "" });
        setShowForm(false);
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLeadsByStatus = (status: Lead["status"]) => leads.filter(l => l.status === status);

  const columns: { id: Lead["status"]; title: string }[] = [
    { id: "NEW", title: "New Inquiries" },
    { id: "FOLLOW_UP", title: "Follow Up Required" },
    { id: "HOT", title: "Hot Prospect" },
    { id: "CONVERTED", title: "Converted (Won)" },
  ];

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm z-10 w-full sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <span className="font-bold tracking-tight text-zinc-400">|</span>
          <div className="flex flex-col pt-1">
             <h1 className="text-xl font-semibold tracking-tight leading-none">Lead Management CRM</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 shadow-md"
          >
            <Plus className="h-4 w-4" /> Connect New Lead
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6 relative">
        {showForm && (
          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 w-full max-w-xl">
             <form onSubmit={handleAddLead}>
               <h3 className="font-bold mb-4">Add Manual Lead</h3>
               <div className="space-y-4">
                 <div><label className="text-sm font-medium">Customer Name</label><input required className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} /></div>
                 <div><label className="text-sm font-medium">Email</label><input type="email" className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} /></div>
                 <div><label className="text-sm font-medium">Phone</label><input type="tel" className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} /></div>
                 <div className="flex justify-end gap-2 mt-4">
                   <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                   <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Save Lead</button>
                 </div>
               </div>
             </form>
          </div>
        )}

        <div className="flex h-full gap-6">
          {columns.map(col => (
            <div key={col.id} className="flex h-full w-80 flex-col rounded-xl bg-zinc-100/50 p-4 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 shrink-0 shadow-inner">
              <div className="mb-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="font-bold text-zinc-700 dark:text-zinc-300 tracking-tight">{col.title}</h3>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400">
                  {getLeadsByStatus(col.id).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-10">
                {getLeadsByStatus(col.id).length === 0 && (
                  <p className="text-xs text-center text-zinc-400 mt-4 italic">No leads in this stage.</p>
                )}
                {getLeadsByStatus(col.id).map(lead => (
                  <div key={lead.id} className="group relative flex cursor-pointer flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-white leading-tight">{lead.customerName}</span>
                      <button className="text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 rounded"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                    {lead.motorcycle && (
                      <span className="mt-2 inline-flex border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 rounded w-fit">
                        Interested: {lead.motorcycle.name}
                      </span>
                    )}
                    <span className="mt-3 text-xs font-medium text-zinc-500">{(lead.customerEmail && lead.customerPhone) ? `${lead.customerEmail} • ${lead.customerPhone}` : (lead.customerEmail || lead.customerPhone || "No contact info")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
