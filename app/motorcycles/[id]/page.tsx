import Link from "next/link";
import { ArrowLeft, Check, Gauge, Banknote, Navigation } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function MotorcycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const motorcycle = await prisma.motorcycle.findUnique({
    where: { id: id },
    include: {
      promotions: {
        where: { isActive: true }
      }
    }
  });

  if (!motorcycle) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/motorcycles" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
          </Link>
          <span className="font-bold tracking-tight text-zinc-400">Model Specifications</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Image & Badges */}
          <div className="space-y-6">
             <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
               <img src={motorcycle.image} alt={motorcycle.name} className="h-full w-full object-cover" />
             </div>
             
             {/* Promotions */}
             {motorcycle.promotions.length > 0 && (
               <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/20">
                 <h3 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-4">
                   <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
                   Active Offers available!
                 </h3>
                 <div className="space-y-3">
                   {motorcycle.promotions.map(p => (
                     <div key={p.id} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50">
                       <div>
                         <p className="font-bold text-sm">{p.title}</p>
                         <p className="text-xs text-zinc-500">{p.description}</p>
                       </div>
                       <span className="font-black text-orange-600 dark:text-orange-400">
                         {p.discountPerc ? `${p.discountPerc}% OFF` : `$${p.discountAmount} OFF`}
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>

          {/* Details & CTA */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-3">
               <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                 {motorcycle.type} CLASS
               </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{motorcycle.name}</h1>
            <p className="text-3xl font-bold text-zinc-500 dark:text-zinc-400 mb-8">
              ${motorcycle.price.toLocaleString()} <span className="text-sm font-medium text-zinc-400">base MSRP</span>
            </p>
            
            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-10">
              {motorcycle.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-12">
               <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                 <Gauge className="h-6 w-6 text-blue-600 mb-3" />
                 <p className="text-sm font-medium text-zinc-500">Engine Output</p>
                 <p className="text-xl font-bold">{motorcycle.engineSize}cc</p>
               </div>
               <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                 <Banknote className="h-6 w-6 text-green-600 mb-3" />
                 <p className="text-sm font-medium text-zinc-500">Financing From</p>
                 <p className="text-xl font-bold">${Math.round(motorcycle.price / 36)}/mo</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
               <Link href="/#test-ride" className="flex-1 inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]">
                 Book Test Ride
               </Link>
               <Link href={`/simulate-credit?model=${motorcycle.id}`} className="flex-1 inline-flex h-14 items-center justify-center rounded-xl border-2 border-zinc-200 bg-white px-8 text-base font-bold text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                 Simulate Credit
               </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
