"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, XCircle, ShoppingCart, Calendar, BellRing } from "lucide-react";
import toast from "react-hot-toast";

export default function MyActivitiesPage() {
  const [data, setData] = useState<{ bookings: any[], orders: any[] }>({ bookings: [], orders: [] });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetch("/api/user/activities")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch activities");
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Could not load activities");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-blue-600">Loading...</div>;
  }

  const getStatusBadge = (status: string) => {
    if (status === 'PENDING') return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold dark:bg-amber-900/30 dark:text-amber-400"><Clock className="w-3 h-3"/> Pending</span>;
    if (status === 'CONFIRMED' || status === 'PAID' || status === 'APPROVED') return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-bold dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3"/> {status}</span>;
    if (status === 'CANCELLED' || status === 'FAILED' || status === 'REJECTED') return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-bold dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3"/> {status}</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 text-zinc-700 px-3 py-1 text-xs font-bold dark:bg-zinc-800 dark:text-zinc-400">{status}</span>;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <span className="font-bold tracking-tight text-zinc-900 dark:text-white">My Activities</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">My Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track your orders and test ride bookings here.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Purchase Orders */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Purchase Orders</h2>
            </div>

            {data.orders.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-500">
                You have not placed any orders yet.
              </div>
            ) : (
              <div className="space-y-4">
                {data.orders.map(order => (
                  <div key={order.id} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg text-zinc-900 dark:text-white">{order.motorcycle?.name || 'Unknown Model'}</p>
                        <p className="text-xs text-zinc-500">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-blue-600">{fmt(order.totalPrice)}</p>
                        <p className="text-xs text-zinc-500">Qty: {order.quantity}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-zinc-500 block text-xs">Color</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{order.color}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-xs">Payment</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">Payment Status:</span>
                        {getStatusBadge(order.paymentStatus)}
                      </div>
                      {order.paymentStatus === 'PENDING' && (
                        <Link href={`/payment?orderId=${order.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-700 underline">
                          Complete Payment
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Rides */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Calendar className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Test Ride Bookings</h2>
            </div>

            {data.bookings.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-500">
                You have no active test ride bookings.
              </div>
            ) : (
              <div className="space-y-4">
                {data.bookings.map(booking => (
                  <div key={booking.id} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                    {booking.status === 'CONFIRMED' && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-lg shadow-sm flex items-center gap-1">
                        <BellRing className="w-3 h-3" /> APPROVED BY ADMIN
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div>
                        <p className="font-bold text-lg text-zinc-900 dark:text-white">{booking.motorcycle?.name || 'Unknown Model'}</p>
                        <p className="text-sm font-medium text-blue-600">{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm">
                      <p className="font-bold text-zinc-700 dark:text-zinc-300">{booking.dealer?.name}</p>
                      <p className="text-zinc-500 text-xs">{booking.dealer?.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
