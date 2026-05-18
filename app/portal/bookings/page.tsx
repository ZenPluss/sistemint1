"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, Search, MapPin, User, Bike } from "lucide-react";
import toast from "react-hot-toast";

type Booking = {
  id: string;
  userId: string;
  date: string;
  timeSlot: string;
  status: string;
  notes: string | null;
  user: { name: string; email: string };
  motorcycle: { name: string; type: string };
  dealer: { name: string; location: string };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBookings(data);
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        toast.success(`Booking ${status.toLowerCase()}!`);
        fetchBookings();
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      toast.error("Failed to update booking status");
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.motorcycle?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.dealer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold dark:bg-amber-900/30 dark:text-amber-400"><Clock className="w-3 h-3"/> Pending</span>;
      case 'CONFIRMED': return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-bold dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3"/> Approved</span>;
      case 'CANCELLED': return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-bold dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3"/> Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 text-zinc-700 px-3 py-1 text-xs font-bold dark:bg-zinc-800 dark:text-zinc-400">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm z-10 w-full sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <span className="font-bold tracking-tight text-zinc-400">|</span>
          <div className="flex flex-col pt-1">
             <h1 className="text-xl font-semibold tracking-tight leading-none">Test Ride Approvals</h1>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            className="h-10 pl-10 pr-4 rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-zinc-500">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <Calendar className="h-12 w-12 text-zinc-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No bookings found</h3>
              <p className="text-zinc-500 mt-2">There are currently no test ride bookings matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* User & Bike Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{booking.user?.name || "Anonymous User"}</p>
                          <p className="text-sm text-zinc-500">{booking.user?.email || "No email provided"}</p>
                          {booking.notes && <p className="text-xs text-zinc-400 mt-2 italic bg-zinc-50 dark:bg-zinc-800 p-2 rounded">"{booking.notes}"</p>}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg">
                          <Bike className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{booking.motorcycle?.name || "Unknown Model"}</p>
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">{booking.motorcycle?.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule & Location */}
                    <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-zinc-500">
                        <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-zinc-700 dark:text-zinc-300 block">{booking.dealer?.name}</strong>
                          {booking.dealer?.location}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-4 min-w-[140px]">
                      {getStatusBadge(booking.status)}
                      
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 text-xs font-bold rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
