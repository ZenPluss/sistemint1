import Link from "next/link";
export const dynamic = "force-dynamic";
import { ArrowLeft, Info, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function MotorcyclesCatalogPage() {
  const motorcycles = await prisma.motorcycle.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] font-sans">
      <header className="border-b border-white/10 glass-dark px-6 py-5 sticky top-0 z-50 transition-all">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <span className="font-black tracking-widest uppercase text-blue-500">Full Catalog</span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 md:px-12">
        <div className="mb-16 flex flex-col items-center text-center animate-fade-in-up">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl mb-6 text-zinc-900 dark:text-white">Discover Your Next Ride</h1>
          <p className="max-w-2xl text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Browse our complete lineup of premium motorcycles. From track dominators to touring legends.
          </p>
        </div>

        {motorcycles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:glass-dark rounded-[2rem] border border-zinc-200 dark:border-white/5">
            <h3 className="text-2xl font-black mb-2">No Models Found</h3>
            <p className="text-zinc-500 text-lg">The database is currently empty. Please run the seed script.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
            {motorcycles.map((m) => (
              <div key={m.id} className="group relative flex flex-col rounded-[2rem] border border-zinc-200/60 bg-white p-6 shadow-lg transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)] hover:-translate-y-3 dark:border-white/5 dark:bg-zinc-900/40 dark:hover:border-blue-500/30">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-950 mb-6 relative hover:shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src={m.image || '/favicon.ico'} alt={m.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.15]" />
                  <span className="absolute top-4 right-4 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-600 shadow-lg dark:bg-blue-600/90 dark:border-blue-400/50 dark:text-white z-20 backdrop-blur-md">
                    {m.type}
                  </span>
                </div>
                <div className="flex-1 px-2">
                  <h3 className="text-2xl font-black mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{m.name}</h3>
                  <p className="text-sm font-extrabold text-zinc-500 dark:text-zinc-400 mb-4">${m.price.toLocaleString()}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-6 font-medium">
                    {m.description}
                  </p>
                </div>
                <Link href={`/motorcycles/${m.id}`} className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-50 border border-zinc-200 py-4 text-sm font-bold text-zinc-900 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-zinc-950 dark:text-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] dark:group-hover:bg-blue-600">
                  <Info className="h-5 w-5" /> View Specifications
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
