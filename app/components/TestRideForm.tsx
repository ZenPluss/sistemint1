"use client";

import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";

type Motorcycle = {
  id: string;
  name: string;
};

type Dealer = {
  id: string;
  name: string;
  location: string;
};

export default function TestRideForm({
  motorcycles,
  dealers,
}: {
  motorcycles: Motorcycle[];
  dealers: Dealer[];
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      motorcycleId: formData.get("motorcycleId") as string,
      dealerId: formData.get("dealerId") as string,
      date: formData.get("date") as string,
      timeSlot: formData.get("timeSlot") as string,
      notes: `Name: ${formData.get("firstName")} ${formData.get("lastName")}, Email: ${formData.get("email")}`,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to book");
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900/50 dark:bg-green-900/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-green-900 dark:text-green-100">Booking Confirmed!</h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          Your test ride request has been received. Our dealer will contact you shortly to confirm the appointment.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-green-700"
        >
          Book Another Ride
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-zinc-900 dark:text-zinc-300">First Name</label>
          <input
            id="firstName"
            name="firstName"
            required
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            required
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="Doe"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="john.doe@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="motorcycleId" className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Interested Model</label>
        <select
          id="motorcycleId"
          name="motorcycleId"
          required
          className="flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="">Select a model</option>
          {motorcycles.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        {motorcycles.length === 0 && (
          <p className="text-xs text-amber-600">No models available in database. Please run seed.</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="dealerId" className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Preferred Dealer</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <select
            id="dealerId"
            name="dealerId"
            required
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">Select a dealer</option>
            {dealers.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.location})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              id="date"
              name="date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className="flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="timeSlot" className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Time</label>
          <select
            id="timeSlot"
            name="timeSlot"
            required
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">Select time</option>
            <option value="09:00 AM - 11:00 AM">Morning (09:00 - 11:00)</option>
            <option value="11:00 AM - 01:00 PM">Midday (11:00 - 13:00)</option>
            <option value="01:00 PM - 03:00 PM">Afternoon (13:00 - 15:00)</option>
            <option value="03:00 PM - 05:00 PM">Late Afternoon (15:00 - 17:00)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || motorcycles.length === 0 || dealers.length === 0}
        className="w-full mt-6 inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        {loading ? "Submitting..." : "Confirm Test Ride"}
      </button>
    </form>
  );
}
