"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin, Calendar, Clock } from "lucide-react";

const MODELS = ["GSX-R1000R", "V-Strom 1050DE", "GSX-8S", "Hayabusa", "GSX-S750", "Burgman 400"];
const DEALERS = [
  { id: "d1", name: "Jakarta Central Suzuki", location: "Jl. Sudirman No. 10, Jakarta" },
  { id: "d2", name: "Bandung Suzuki Motors", location: "Jl. Asia Afrika No. 45, Bandung" },
  { id: "d3", name: "Surabaya Ride Center", location: "Jl. HR Muhammad No. 22, Surabaya" },
];
const TIME_SLOTS = ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"];

type Step = 1 | 2 | 3 | 4;

export default function TestRideBookingPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    model: "", dealerId: "", date: "", timeSlot: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedDealer = DEALERS.find(d => d.id === form.dealerId);

  const handleSubmit = async () => {
    // Simulate API submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center font-sans">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Test Ride Confirmed!</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-2">
          Your test ride for the <strong className="text-zinc-900 dark:text-white">{form.model}</strong> has been booked.
        </p>
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 text-left w-full max-w-sm">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"><MapPin className="h-4 w-4 shrink-0" />{selectedDealer?.name}</div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"><Calendar className="h-4 w-4 shrink-0" />{form.date}</div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"><Clock className="h-4 w-4 shrink-0" />{form.timeSlot}</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-zinc-500">A confirmation has been sent to <strong>{form.email}</strong>.</p>
        <Link href="/" className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="w-full border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Book a Test Ride</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Experience the machine firsthand — just a few steps away.</p>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {["Your Info", "Select Bike", "Choose Slot", "Confirm"].map((label, i) => {
            const s = (i + 1) as Step;
            const isActive = step === s;
            const isDone = step > s;
            return (
              <div key={s} className="flex flex-1 flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors
                  ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800'}`}>
                  {isDone ? <CheckCircle className="h-4 w-4" /> : s}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-blue-600' : 'text-zinc-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Your Information</h2>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe" className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com" className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+62 812 3456 7890" className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
              </div>
            </div>
          )}

          {/* Step 2: Select Model & Dealer */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Select Motorcycle & Dealer</h2>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Motorcycle Model</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {MODELS.map(m => (
                    <button key={m} onClick={() => setForm(f => ({ ...f, model: m }))}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors text-left ${form.model === m ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-700'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Dealer Location</label>
                <div className="mt-2 space-y-2">
                  {DEALERS.map(d => (
                    <button key={d.id} onClick={() => setForm(f => ({ ...f, dealerId: d.id }))}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${form.dealerId === d.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40' : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-700'}`}>
                      <div className="font-medium text-sm">{d.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{d.location}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Choose Date & Time Slot</h2>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Preferred Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Available Time Slots</label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TIME_SLOTS.map(ts => (
                    <button key={ts} onClick={() => setForm(f => ({ ...f, timeSlot: ts }))}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${form.timeSlot === ts ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-700'}`}>
                      <Clock className="h-4 w-4 shrink-0" />{ts}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes (Optional)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Any special requests or questions..."
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700" />
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Booking Summary</h2>
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950 p-4 space-y-3 text-sm">
                {[
                  { label: "Name", value: form.name },
                  { label: "Email", value: form.email },
                  { label: "Phone", value: form.phone },
                  { label: "Motorcycle", value: form.model },
                  { label: "Dealer", value: selectedDealer?.name },
                  { label: "Location", value: selectedDealer?.location },
                  { label: "Date", value: form.date },
                  { label: "Time Slot", value: form.timeSlot },
                ].map(item => (
                  <div key={item.label} className="flex justify-between gap-4">
                    <span className="text-zinc-500 shrink-0">{item.label}</span>
                    <span className="font-medium text-right">{item.value || "—"}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500">By confirming, you agree to arrive at the dealership 10 minutes before your scheduled slot.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between gap-3">
            {step > 1 ? (
              <button onClick={() => setStep(s => (s - 1) as Step)} className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                Back
              </button>
            ) : <div />}
            {step < 4 ? (
              <button onClick={() => setStep(s => (s + 1) as Step)} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit} className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors">
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
