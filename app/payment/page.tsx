"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // To avoid hydration errors with useSearchParams
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handlePay = async () => {
    if (!orderId) return;
    setLoading(true);

    try {
      // Mock processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch("/api/purchases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, paymentStatus: "PAID" }),
      });

      if (!res.ok) {
        throw new Error("Payment failed.");
      }

      setSuccess(true);
      toast.success("Payment Successful!");
      
      // Redirect to activities after a few seconds
      setTimeout(() => {
        router.push("/my-activities");
      }, 3000);
      
    } catch (err: any) {
      toast.error(err.message || "An error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (!orderId) {
    return (
      <div className="text-center p-12">
        <p className="text-zinc-500 mb-4">No order ID specified.</p>
        <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Payment
      </Link>

      <div className="text-center mb-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
          <CreditCard className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Complete Your Payment</h1>
        <p className="text-sm text-zinc-500 mt-2">Order Reference: <span className="font-mono text-zinc-900 dark:text-white font-bold">{orderId.split("-")[0]}</span></p>
      </div>

      {success ? (
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Payment Verified!</h3>
          <p className="text-sm text-green-700 dark:text-green-300">Your order status has been updated to PAID. Redirecting you to your activities...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">Payment Method Selected</p>
            <p className="font-bold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Secure Gateway</p>
          </div>
          
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing Securely...</> : "Pay Now"}
          </button>

          <p className="text-center text-xs text-zinc-400">
            This is a secure mock payment simulation for SuzukiRide.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
