import Link from "next/link";
export const dynamic = "force-dynamic";
import { ArrowLeft, Info, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function MotorcyclesCatalogPage() {
  const motorcycles = await prisma.motorcycle.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-10 transition-shadow">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <span className="font-bold tracking-tight">Full Catalog</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Discover Your Next Ride</h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Browse our complete lineup of premium motorcycles. From track dominators to touring legends.
          </p>
        </div>

        {motorcycles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold">No Models Found</h3>
            <p className="text-zinc-500 mt-2">The database is currently empty. Please run the seed script.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {motorcycles.map((m) => (
              <div key={m.id} className="group flex flex-col rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 relative mb-4">
                  <img src={m.image || '/favicon.ico'} alt={m.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute top-3 right-3 rounded-full bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                    {m.type}
                  </span>
                </div>
                <div className="flex-1 px-2">
                  <h3 className="text-xl font-black mb-1">{m.name}</h3>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">${m.price.toLocaleString()}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed mb-6">
                    {m.description}
                  </p>
                </div>
                <Link href={`/motorcycles/${m.id}`} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-blue-600 hover:text-white dark:bg-zinc-800 dark:text-white dark:hover:bg-blue-600">
                  <Info className="h-4 w-4" /> View Specifications
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
