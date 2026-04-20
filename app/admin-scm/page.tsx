"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Users, Truck, AlertCircle, Plus, Trash2, Edit, Home, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function ScmAdminPanel() {
  const [activeTab, setActiveTab] = useState("suppliers");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  // <!-- Added: SCM Shipment Management & Role UI -->
  const [shipments, setShipments] = useState<any[]>([]);
  const [dealers, setDealers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currency, setCurrency] = useState("USD");
  const currencyRates: any = { USD: 1, EUR: 0.92, IDR: 15600, JPY: 150 };
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(val * currencyRates[currency]);

  // Modals state (simplified generic approach for this example)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"supplier"|"inventory"|"order"|"shipment"|"dealer">("supplier");
  const [modalMode, setModalMode] = useState<"create"|"edit">("create");
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [resS, resI, resO, resShip, resDeal] = await Promise.all([
        fetch("/api/scm/suppliers"),
        fetch("/api/scm/inventory"),
        fetch("/api/scm/orders"),
        fetch("/api/scm/shipments"),
        fetch("/api/scm/dealers")
      ]);
      setSuppliers(await resS.json());
      setInventory(await resI.json());
      setOrders(await resO.json());
      setShipments(await resShip.json());
      setDealers(await resDeal.json());
    } catch (e) {
      console.error("Failed to fetch SCM data", e);
    }
  };

  useEffect(() => {
    fetchData();
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUserRole(JSON.parse(stored).role); } catch(e){}
    }
  }, []);

  const openModal = (type: "supplier"|"inventory"|"order"|"shipment"|"dealer", mode: "create"|"edit", data: any = {}) => {
    setModalType(type);
    setModalMode(mode);
    setFormData(mode === "create" ? {} : { ...data });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = `/api/scm/${modalType === "supplier" ? "suppliers" : modalType === "inventory" ? "inventory" : modalType === "order" ? "orders" : modalType === "shipment" ? "shipments" : "dealers"}`;
    const method = modalMode === "create" ? "POST" : "PUT";
    
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      toast.error("Error saving: " + err.error);
      return;
    }
    
    toast.success(modalMode === "create" ? "Data saved successfully!" : "Data updated!");
    closeModal();
    fetchData();
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    const endpoint = `/api/scm/${type === "supplier" ? "suppliers" : type === "inventory" ? "inventory" : type === "order" ? "orders" : type === "shipment" ? "shipments" : "dealers"}`;
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) toast.success("Record deleted successfully!");
    else toast.error("Failed to delete record!");
    fetchData();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Added: SCM Admin Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-900/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <img src="/favicon.ico" alt="Logo" className="h-7 w-auto" />
              <span className="text-base font-extrabold text-blue-500">SuzukiRide</span>
            </Link>
            <span className="text-zinc-600 dark:text-zinc-500">|</span>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
              <Shield className="h-3.5 w-3.5" /> SCM Dashboard {userRole === 'ADMIN' ? '(Admin Mode)' : '(Read Only)'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select value={currency} onChange={e=>setCurrency(e.target.value)} className="bg-zinc-800 text-xs text-white uppercase rounded px-2 py-1 border border-zinc-700 outline-none">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="IDR">IDR (Rp)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
            <Link href="/" className="flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              <Home className="h-4 w-4" /> Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-bold text-red-400 hover:text-red-300 border border-red-500/30 rounded-full px-3 py-1.5 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header & Explanation */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Truck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Supply Chain Management (SCM)</h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Internal administrative panel for managing operations.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-sm text-zinc-600 dark:text-zinc-300">
            <div>
              <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white flex items-center gap-2"><AlertCircle className="h-5 w-5" /> What is SCM?</h3>
              <p className="mb-4">Supply Chain Management is the handling of the entire production flow of a good or service — starting from raw components to delivering the final product to the consumer.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Planning:</strong> Managing resources required.</li>
                <li><strong>Sourcing:</strong> Choosing suppliers.</li>
                <li><strong>Production:</strong> Manufacturing the product.</li>
                <li><strong>Delivery (Logistics):</strong> Coordinating orders and deliveries.</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">Key Terms Dictionary</h4>
              <ul className="space-y-3">
                <li title="The number of days it takes for a supplier to deliver an order after it has been placed."><strong className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-dotted border-blue-400 cursor-help">Lead Time (days)</strong><br/>Time required to receive goods from a supplier.</li>
                <li title="The inventory level at which a new order should be placed to replenish stock."><strong className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-dotted border-blue-400 cursor-help">Reorder Point</strong><br/>The stock level that triggers a new order.</li>
                <li title="A score 1-5 indicating reliability, quality, and speed of the supplier."><strong className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-dotted border-blue-400 cursor-help">Supplier Rating</strong><br/>Evaluation of supplier performance (1-5 scale).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          <button onClick={() => setActiveTab("suppliers")} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === "suppliers" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
            <span className="flex items-center gap-2"><Users className="h-4 w-4"/> Suppliers</span>
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === "inventory" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
             <span className="flex items-center gap-2"><Package className="h-4 w-4"/> Inventory</span>
          </button>
          <button onClick={() => setActiveTab("orders")} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === "orders" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
             <span className="flex items-center gap-2"><Package className="h-4 w-4"/> Orders</span>
          </button>
          <button onClick={() => setActiveTab("shipments")} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === "shipments" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
             <span className="flex items-center gap-2"><Truck className="h-4 w-4"/> Shipments</span>
          </button>
          <button onClick={() => setActiveTab("dealers")} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === "dealers" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
             <span className="flex items-center gap-2"><span className="text-xl leading-none -mt-1">🌍</span> Global Dealers</span>
          </button>
        </div>

        {/* Data Area */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold capitalize">{activeTab} Directory</h2>
            {userRole === "ADMIN" && (
              <button
                onClick={() => openModal(activeTab === "inventory" ? "inventory" : activeTab.slice(0, -1) as any, "create")}
                className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                <Plus className="h-4 w-4" /> Add New
              </button>
            )}
          </div>

          {/* Table rendering based on tab */}
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-y border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">
              {activeTab === "suppliers" && (
                <tr>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Rating</th>
                  <th className="px-4 py-4">Lead Time</th>
                  {userRole === 'ADMIN' && <th className="px-4 py-4 text-right">Actions</th>}
                </tr>
              )}
              {activeTab === "inventory" && (
                <tr>
                  <th className="px-4 py-4">Item Name / SKU</th>
                  <th className="px-4 py-4">Quantity</th>
                  <th className="px-4 py-4">Reorder Point</th>
                  <th className="px-4 py-4">Supplier</th>
                  {userRole === 'ADMIN' && <th className="px-4 py-4 text-right">Actions</th>}
                </tr>
              )}
              {activeTab === "orders" && (
                <tr>
                  <th className="px-4 py-4">Order ID / Date</th>
                  <th className="px-4 py-4">Inventory Item</th>
                  <th className="px-4 py-4">Quantity</th>
                  <th className="px-4 py-4">Status</th>
                  {userRole === 'ADMIN' && <th className="px-4 py-4 text-right">Actions</th>}
                </tr>
              )}
              {activeTab === "shipments" && (
                <tr>
                  <th className="px-4 py-4">Shipment Tracking ID</th>
                  <th className="px-4 py-4">Order Reference</th>
                  <th className="px-4 py-4">Current Status</th>
                  <th className="px-4 py-4">ETA</th>
                  {userRole === 'ADMIN' && <th className="px-4 py-4 text-right">Actions</th>}
                </tr>
              )}
              {activeTab === "dealers" && (
                <tr>
                  <th className="px-4 py-4">Dealer Unit</th>
                  <th className="px-4 py-4">Global Location</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Est. Op Cost</th>
                  {userRole === 'ADMIN' && <th className="px-4 py-4 text-right">Actions</th>}
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {activeTab === "suppliers" && suppliers.map((s: any) => (
                <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-4">{s.name}</td>
                  <td className="px-4 py-4">{s.email}<br/><span className="text-xs text-zinc-500">{s.phone}</span></td>
                  <td className="px-4 py-4">{s.rating} / 5</td>
                  <td className="px-4 py-4">{s.leadTime} days</td>
                  {userRole === 'ADMIN' && (
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => openModal("supplier", "edit", s)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mr-2"><Edit className="h-4 w-4"/></button>
                      <button onClick={() => handleDelete("supplier", s.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  )}
                </tr>
              ))}
              {activeTab === "inventory" && inventory.map((i: any) => (
                <tr key={i.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-4">{i.name}<br/><span className="text-xs text-zinc-500">SKU: {i.sku}</span></td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md ${i.quantity <= i.reorderPoint ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {i.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-4">{i.reorderPoint}</td>
                  <td className="px-4 py-4">{i.supplier?.name || "Unknown"}</td>
                  {userRole === 'ADMIN' && (
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => openModal("inventory", "edit", i)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mr-2"><Edit className="h-4 w-4"/></button>
                      <button onClick={() => handleDelete("inventory", i.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  )}
                </tr>
              ))}
              {activeTab === "orders" && orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-4 text-xs font-mono">{o.id.substring(0,8)}...<br/><span className="text-zinc-500">{new Date(o.orderDate).toLocaleDateString()}</span></td>
                  <td className="px-4 py-4">{o.inventory?.name}</td>
                  <td className="px-4 py-4">{o.quantity}</td>
                  <td className="px-4 py-4">
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-xs font-bold">{o.status}</span>
                  </td>
                  {userRole === 'ADMIN' && (
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => openModal("order", "edit", o)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mr-2"><Edit className="h-4 w-4"/></button>
                      <button onClick={() => handleDelete("order", o.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  )}
                </tr>
              ))}
              {activeTab === "shipments" && shipments.map((sh: any) => (
                <tr key={sh.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-4 text-xs font-mono font-bold tracking-widest">{sh.id.substring(0,8).toUpperCase()}</td>
                  <td className="px-4 py-4 text-xs font-mono">{sh.orderId.substring(0,8).toUpperCase()}</td>
                  <td className="px-4 py-4">
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-bold">{sh.status}</span>
                  </td>
                  <td className="px-4 py-4 font-medium">{new Date(sh.estimatedDate).toLocaleDateString()}</td>
                  {userRole === 'ADMIN' && (
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => openModal("shipment", "edit", sh)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mr-2"><Edit className="h-4 w-4"/></button>
                      <button onClick={() => handleDelete("shipment", sh.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  )}
                </tr>
              ))}
              {activeTab === "dealers" && dealers.map((d: any) => (
                <tr key={d.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-4 font-bold">{d.name}</td>
                  <td className="px-4 py-4 font-medium">{d.location}</td>
                  <td className="px-4 py-4 text-xs">{d.contact}</td>
                  <td className="px-4 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(15000)}</td>
                  {userRole === 'ADMIN' && (
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => openModal("dealer", "edit", d)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mr-2"><Edit className="h-4 w-4"/></button>
                      <button onClick={() => handleDelete("dealer", d.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Empty states handling omitted for brevity, logic exists above */}
        </div>

      </div>

      {/* Basic Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-6 capitalize">{modalMode} {modalType}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {modalType === "supplier" && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Supplier Name</label>
                    <input required type="text" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Email</label>
                    <input type="email" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Lead Time (Days)</label>
                    <input type="number" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.leadTime || ''} onChange={e => setFormData({...formData, leadTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Phone Number</label>
                    <input type="text" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </>
              )}

              {modalType === "inventory" && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Item Name</label>
                    <input required type="text" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">SKU</label>
                    <input required type="text" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Quantity</label>
                      <input required type="number" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.quantity || ''} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Reorder Point</label>
                      <input required type="number" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.reorderPoint || ''} onChange={e => setFormData({...formData, reorderPoint: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Supplier</label>
                    <select required className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.supplierId || ''} onChange={e => setFormData({...formData, supplierId: e.target.value})}>
                      <option value="">Select a supplier</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              {modalType === "order" && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Inventory Item</label>
                    <select required className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.inventoryId || ''} onChange={e => setFormData({...formData, inventoryId: e.target.value})}>
                      <option value="">Select an item</option>
                      {inventory.map(i => <option key={i.id} value={i.id}>{i.name} (SKU: {i.sku})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Quantity</label>
                    <input required type="number" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.quantity || ''} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Status</label>
                    <select required className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.status || 'PENDING'} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </div>
                </>
              )}

              {modalType === "shipment" && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Order Ref ID</label>
                    <select required className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.orderId || ''} onChange={e => setFormData({...formData, orderId: e.target.value})}>
                      <option value="">Select an order</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.id.substring(0,8)} - (Qty: {o.quantity})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Status</label>
                    <select required className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.status || 'IN_TRANSIT'} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="IN_TRANSIT">IN_TRANSIT</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="DELAYED">DELAYED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Est. Delivery Date</label>
                    <input required type="date" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.estimatedDate ? new Date(formData.estimatedDate).toISOString().substring(0,10) : ''} onChange={e => setFormData({...formData, estimatedDate: e.target.value})} />
                  </div>
                </>
              )}

              {modalType === "dealer" && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Dealer Name</label>
                    <input required type="text" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Global Location</label>
                    <input required type="text" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Tokyo Head Office, Japan" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Contact Info</label>
                    <input required type="text" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3" value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-full font-bold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors">{modalMode === "create" ? "Add Record" : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
