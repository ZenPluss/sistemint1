"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, RefreshCw, CheckCircle, XCircle, Truck, Clock } from "lucide-react";
import toast from "react-hot-toast";

type SaleOrder = {
  id: string;
  status: string;
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  motorcycle: { name: string; price: number; image: string };
  user: { name: string; email: string };
};

const STATUS_COLORS: any = {
  PENDING:   "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400",
  CONFIRMED: "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  DELIVERED: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  CANCELLED: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
};

const STATUS_ICONS: any = {
  PENDING:   <Clock className="h-3 w-3" />,
  CONFIRMED: <CheckCircle className="h-3 w-3" />,
  DELIVERED: <Truck className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/purchases");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders. Admin access required.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const t = toast.loading("Updating status...");
    const res = await fetch("/api/purchases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    toast.dismiss(t);
    if (res.ok) {
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } else {
      toast.error("Failed to update status.");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const res = await fetch("/api/purchases", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { toast.success("Order deleted."); fetchOrders(); }
    else toast.error("Failed to delete.");
  };

  const filtered = filter === "ALL" ? orders : orders.filter(o => o.status === filter);
  const total = orders.reduce((s, o) => s + o.totalPrice, 0);
  const pending = orders.filter(o => o.status === "PENDING").length;
  const confirmed = orders.filter(o => o.status === "CONFIRMED").length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/portal/leads" className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white">Purchase Orders</h1>
            </div>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `$${total.toLocaleString()}`, color: "text-green-600" },
            { label: "Total Orders", value: orders.length, color: "text-blue-600" },
            { label: "Pending", value: pending, color: "text-amber-600" },
            { label: "Confirmed", value: confirmed, color: "text-indigo-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">No orders found.</div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Motorcycle</th>
                  <th className="px-5 py-4">Qty</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-zinc-900 dark:text-white">{order.user.name}</p>
                      <p className="text-xs text-zinc-500">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={order.motorcycle.image} alt={order.motorcycle.name} className="w-10 h-8 object-cover rounded-lg bg-zinc-100" />
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{order.motorcycle.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold">{order.quantity}</td>
                    <td className="px-5 py-4 font-bold text-green-600">${order.totalPrice.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                        {STATUS_ICONS[order.status]} {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {order.status === "PENDING" && (
                          <button onClick={() => updateStatus(order.id, "CONFIRMED")} className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Confirm</button>
                        )}
                        {order.status === "CONFIRMED" && (
                          <button onClick={() => updateStatus(order.id, "DELIVERED")} className="px-3 py-1.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Delivered</button>
                        )}
                        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                          <button onClick={() => updateStatus(order.id, "CANCELLED")} className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">Cancel</button>
                        )}
                        <button onClick={() => deleteOrder(order.id)} className="px-3 py-1.5 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
