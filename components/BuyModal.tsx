"use client";

import { useState } from "react";
import { ShoppingCart, X, MapPin, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  motorcycleId: string;
  motorcycleName: string;
  motorcyclePrice: number;
  motorcycleImage: string;
};

export default function BuyModal({ motorcycleId, motorcycleName, motorcyclePrice, motorcycleImage }: Props) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [color, setColor] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  // Currency from cookie
  const getCurrency = () => {
    if (typeof document === "undefined") return "USD";
    const match = document.cookie.match(/(^| )currency=([^;]+)/);
    return match ? match[2] : "USD";
  };
  const rates: any = { USD: 1, EUR: 0.92, IDR: 15600, JPY: 150 };
  const currency = getCurrency();
  const rate = rates[currency] || 1;
  const fmt = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(v * rate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address.");
      return;
    }

    const userJSON = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!userJSON) {
      toast.error("Please login first to place an order!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Placing your order...");

    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motorcycleId, quantity, shippingAddress, notes, color, paymentMethod }),
      });

      toast.dismiss(loadingToast);

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to place order.");
        return;
      }

      const resData = await res.json();
      toast.success(`🎉 Order placed! Redirecting to payment...`, { duration: 3000 });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = `/payment?orderId=${resData.id}`;
      }, 1000);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOpen(false);
    setSuccess(false);
    setQuantity(1);
    setShippingAddress("");
    setNotes("");
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex-1 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-blue-600/50 active:scale-[0.98]"
      >
        <ShoppingCart className="h-5 w-5" />
        Buy Now
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  {success ? "Order Confirmed!" : "Purchase Order"}
                </h2>
              </div>
              <button onClick={reset} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="p-10 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Order Submitted!</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                  Your order for <strong>{motorcycleName}</strong> has been received. An admin will confirm it shortly.
                </p>
                <button onClick={reset} className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-8 font-bold text-white hover:bg-blue-700 transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Motorcycle Summary */}
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
                  <img src={motorcycleImage} alt={motorcycleName} className="w-20 h-16 object-cover rounded-xl bg-zinc-200" />
                  <div>
                    <p className="font-extrabold text-zinc-900 dark:text-white">{motorcycleName}</p>
                    <p className="text-blue-600 font-bold text-lg">{fmt(motorcyclePrice)}</p>
                    <p className="text-xs text-zinc-500">Base MSRP per unit</p>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xl font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">−</button>
                    <span className="w-12 text-center font-extrabold text-xl">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-xl border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xl font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">+</button>
                    <span className="ml-auto text-blue-600 font-bold text-lg">{fmt(motorcyclePrice * quantity)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Color */}
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Color</label>
                    <select
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Matte Black">Matte Black</option>
                      <option value="Racing Blue">Racing Blue</option>
                      <option value="Pearl White">Pearl White</option>
                      <option value="Candy Red">Candy Red</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="e-Wallet">e-Wallet</option>
                    </select>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    placeholder="Enter your full delivery address..."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Notes (optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Any special requests..."
                  />
                </div>

                {/* Total */}
                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/50">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">Total Order</span>
                  <span className="text-2xl font-black text-blue-600">{fmt(motorcyclePrice * quantity)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : "Confirm Purchase"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
