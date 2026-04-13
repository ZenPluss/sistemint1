"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, CheckCircle } from "lucide-react";

type Motorcycle = {
  id: string;
  name: string;
  price: number;
};

export default function CreditSimulatorPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  
  const [downPayment, setDownPayment] = useState(3000);
  const [tenure, setTenure] = useState(36); // months
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/motorcycles")
      .then(res => res.json())
      .then(data => {
        setMotorcycles(data);
        if (data.length > 0) setSelectedMotorcycle(data[0]);
      });
  }, []);

  const price = selectedMotorcycle?.price || 15000;
  
  // Keep downPayment within bounds when price changes
  useEffect(() => {
    if (downPayment >= price) setDownPayment(price * 0.2); // 20% default if out of bounds
  }, [price, downPayment]);

  const ANNUAl_INTEREST_RATE = 0.08;
  const monthlyRate = ANNUAl_INTEREST_RATE / 12;

  const principal = price - downPayment;
  const monthlyEst =
    principal <= 0
      ? 0
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1);

  async function handleSubmit() {
    if (!selectedMotorcycle) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userJSON = localStorage.getItem("user");
      const userId = userJSON ? JSON.parse(userJSON).id : undefined;

      const res = await fetch("/api/financing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          motorcycleId: selectedMotorcycle.id,
          downPayment,
          tenureMonths: tenure
        }),
      });

      if (!res.ok) throw new Error("Failed to submit application");
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="w-full border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-500">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Financing Calculator</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Estimate your monthly installments and apply.</p>
          </div>
        </div>

        {success ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm dark:border-green-900/40 dark:bg-green-900/20">
             <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
             <h2 className="mt-4 text-2xl font-bold text-green-900 dark:text-green-100">Application Submitted!</h2>
             <p className="mt-2 text-green-700 dark:text-green-300">Your financing application for the {selectedMotorcycle?.name} has been recorded in our system. A representative will contact you soon.</p>
             <button onClick={() => setSuccess(false)} className="mt-6 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
               Calculate Another
             </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Controls */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {error && <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">{error}</div>}
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Select Motorcycle Model</label>
                  <select 
                    className="mt-2 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 focus:border-blue-600 focus:outline-none dark:border-zinc-700"
                    onChange={(e) => setSelectedMotorcycle(motorcycles.find(m => m.id === e.target.value) || null)}
                    value={selectedMotorcycle?.id || ""}
                  >
                    {motorcycles.map(m => <option key={m.id} value={m.id}>{m.name} (${m.price.toLocaleString()})</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Down Payment ($)</label>
                    <span className="text-sm font-medium text-blue-600">${downPayment.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={price}
                    step="100"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="mt-4 w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tenure (Months)</label>
                    <span className="text-sm font-medium text-blue-600">{tenure} Months</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    step="12"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="mt-4 w-full accent-blue-600"
                  />
                  <div className="mt-2 flex justify-between text-xs text-zinc-500">
                    <span>1 Year</span>
                    <span>6 Years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex flex-col justify-between rounded-2xl bg-zinc-900 p-8 text-white shadow-xl">
              <div>
                <h2 className="text-xl font-semibold text-zinc-300">Estimated Breakdown</h2>
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between border-b border-zinc-800 pb-4">
                    <span className="text-zinc-400">Total Price</span>
                    <span className="font-medium">${price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-4">
                    <span className="text-zinc-400">Down Payment</span>
                    <span className="font-medium">-${downPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-zinc-800 pt-2">
                    <span className="text-zinc-400">Amount Financed</span>
                    <span className="font-medium">${Math.max(0, principal).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 rounded-xl bg-blue-600 p-6 text-center shadow-lg shadow-blue-900/50">
                <span className="block text-sm font-medium text-blue-200">Estimated Monthly Installment</span>
                <span className="mt-2 block text-4xl font-bold tracking-tight">
                  ${monthlyEst.toFixed(2)}
                </span>
                <span className="mt-1 block text-xs text-blue-200">Includes 8% APR Interest</span>
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={loading || !selectedMotorcycle}
                className="mt-8 w-full rounded-lg bg-white py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-200 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Financing Application"}
              </button>
              <p className="mt-4 text-center text-xs text-zinc-500">
                * This application is submitted directly to the Suzuki dealer network.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
