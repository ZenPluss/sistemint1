import Link from "next/link";

export const dynamic = "force-dynamic";

import { Calendar, Info, Tag, ChevronRight, Zap, Shield, Sparkles, Calculator, ArrowRight } from "lucide-react";
import AntigravityCanvas from "@/components/AntigravityCanvas";
import TestRideForm from "./components/TestRideForm";
import { prisma } from "@/lib/prisma";
import NavbarClient from "@/components/NavbarClient";
import { cookies } from "next/headers";
import AdminPortalSection from "@/components/AdminPortalSection";

// Fallback images based on index
const fallbacks = [
  "https://www.globalsuzuki.com/globalnews/2025/img/0731b.jpg",
  "https://motortrade.com.ph/wp-content/uploads/2024/05/2-6.jpg",
  "/636ccc8b19ff3.jpg"
];

export default async function Home() {
  // Fetch from DB
  const dbMotorcycles = await prisma.motorcycle.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  });
  
  const allMotorcycles = await prisma.motorcycle.findMany({ select: { id: true, name: true } });
  const allDealers = await prisma.dealer.findMany({ select: { id: true, name: true, location: true } });

  const cookieStore = await cookies();
  const currency = cookieStore.get('currency')?.value || 'USD';
  const currencyRates: any = { USD: 1, EUR: 0.92, IDR: 15600, JPY: 150 };
  const rate = currencyRates[currency] || 1;
  const formatCurrency = (val: number, hideDecimals = true) => new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: hideDecimals ? 0 : 2 }).format(val * rate);

  // If DB is empty, use our dummy fallbacks for the UI display only!
  const displayMotorcycles = dbMotorcycles.length > 0 ? dbMotorcycles.map((m, i) => ({
    id: m.id,
    name: m.name,
    type: m.type,
    image: m.image && m.image !== "" ? m.image : fallbacks[i % fallbacks.length],
    price: m.price,
    desc: m.description,
  })) : [
    { id: "dummy1", name: "GSX-R1000R", type: "SPORT", image: fallbacks[0], price: 11999, desc: "The most powerful, hardest-accelerating, cleanest-running GSX-R ever built." },
    { id: "dummy2", name: "V-STROM 1050DE", type: "ADVENTURE", image: fallbacks[1], price: 14849, desc: "Engineered to tackle the toughest terrain. Master the adventure." },
    { id: "dummy3", name: "GSX-8S", type: "STREET", image: fallbacks[2], price: 8999, desc: "A brand new street fighter with a potent parallel-twin engine and striking design." }
  ];

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-600/30">
      {/* Premium Navbar with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl transition-all">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="rounded-full bg-white p-1 shadow-sm">
              <img src="/favicon.ico" alt="Suzuki Logo" className="h-8 w-auto" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white hidden sm:inline-block drop-shadow-sm">
              SuzukiRide
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-semibold tracking-wide">
            <Link href="#models" className="text-zinc-200 hover:text-white transition-colors">Models</Link>
            <Link href="#test-ride" className="text-zinc-200 hover:text-white transition-colors">Test Ride</Link>
            <Link href="/portal/leads" className="text-zinc-200 hover:text-white transition-colors">Dealers Portal</Link>
          </nav>
          {/* Added: NavbarClient shows login/register buttons OR user info + logout after login */}
          <NavbarClient />
        </div>
      </header>

      <main className="flex-1">
        {/* YouTube Video Hero Section */}
        <section className="relative w-full py-32 md:py-48 lg:py-56 overflow-hidden isolate">
          {/* YouTube Video Background */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <iframe
              src="https://www.youtube.com/embed/uJzN9uGHneU?autoplay=1&mute=1&loop=1&playlist=uJzN9uGHneU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&start=17"
              title="Hero Background Video"
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full min-h-full h-[56.25vw]"
              style={{ border: 'none' }}
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-8 animate-fade-in-up">
            <div className="inline-flex items-center rounded-full border border-blue-400/40 bg-blue-500/20 px-5 py-2 text-sm font-extrabold text-blue-300 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Sparkles className="mr-2 h-4 w-4" /> 2025 Models Released
            </div>
            <h1 className="max-w-4xl text-6xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] leading-[1.05]">
              Thrill Meets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300">Pure Performance</span>
            </h1>
            <p className="max-w-2xl text-xl text-zinc-200 font-medium leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
              Discover our latest lineup of sport bikes, adventure motorcycles, and agile scooters designed to conquer every road.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mt-6 justify-center w-full">
              <a
                href="#models"
                className="group inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-white px-10 text-base font-extrabold text-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                Explore Models <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#test-ride"
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md px-10 text-base font-bold text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95 shadow-sm"
              >
                Book a Test Ride
              </a>
            </div>
          </div>
        </section>

        {/* Featured Models Section with Hover Cards */}
        <section id="models" className="w-full py-24 md:py-36 bg-[var(--background)] relative">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center justify-center space-y-5 text-center mb-20 animate-fade-in-up">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Featured Motorcycles</h2>
              <p className="max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Precision engineering tailored to your riding style. From the track-ready GSX-R to the versatile V-Strom architecture.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-7xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayMotorcycles.map((m) => (
                <div key={m.id} className="group relative flex flex-col items-start justify-between rounded-[2rem] border border-zinc-200/60 bg-white p-6 shadow-lg transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)] hover:-translate-y-3 dark:border-white/5 dark:bg-zinc-900/40 dark:hover:border-blue-500/30">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-950 mb-6 relative hover:shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.15]" />
                  </div>
                  <div className="flex w-full items-center justify-between mb-4 px-2">
                    <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">{m.type}</span>
                    <span className="text-sm font-extrabold text-zinc-900 dark:text-white">From {formatCurrency(m.price)}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3 px-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{m.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 px-2 line-clamp-2 leading-relaxed font-medium">
                    {m.desc}
                  </p>
                  <Link href={`/motorcycles/${m.id}`} className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-50 border border-zinc-200 py-4 text-sm font-bold text-zinc-900 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-zinc-950 dark:text-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] dark:group-hover:bg-blue-600">
                    <Info className="h-5 w-5" /> View Details
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <Link href="/motorcycles" className="inline-flex h-14 items-center justify-center rounded-full border border-zinc-300 bg-white px-10 text-base font-extrabold shadow-sm transition-all hover:bg-zinc-100 hover:border-zinc-400 hover:scale-105 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:border-zinc-500">
                View Entire Catalog <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA / Test Ride Section - Connected to DB */}
        <section id="test-ride" className="w-full py-24 md:py-36 bg-blue-50 dark:bg-[#030612] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
            <Zap className="w-[40rem] h-[40rem] text-blue-600" />
          </div>
          <div className="container relative mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="animate-fade-in-up">
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs text-blue-700 font-black tracking-widest uppercase mb-6 shadow-sm border border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800">Experience It</span>
                <h2 className="text-5xl font-black tracking-tight sm:text-6xl mb-8 text-zinc-900 dark:text-white leading-[1.1]">Book Your Exclusive Test Ride</h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed font-medium">
                  There’s no better way to understand the engineering excellence of a Suzuki motorcycle than experiencing it firsthand. Schedule your ride securely via our portal.
                </p>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xl shadow-zinc-200/50 dark:bg-[#0f111a] dark:shadow-black/50 transition-transform group-hover:scale-110 group-hover:rotate-3 border border-zinc-100 dark:border-white/5">
                      <Calendar className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="pt-2">
                      <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Flexible Scheduling</h4>
                      <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">Pick a date and time slot that perfectly fits your calendar.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xl shadow-zinc-200/50 dark:bg-[#0f111a] dark:shadow-black/50 transition-transform group-hover:scale-110 group-hover:-rotate-3 border border-zinc-100 dark:border-white/5">
                      <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="pt-2">
                      <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Direct Dealership Connection</h4>
                      <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">Your request goes straight to verified Suzuki dealerships.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-[2.5rem] border border-white/60 bg-white/70 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0a0d16]/80 sm:p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-[2.5rem] pointer-events-none"></div>
                <div className="relative z-10">
                  <TestRideForm motorcycles={allMotorcycles} dealers={allDealers} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Promotions Section */}
        <section className="w-full py-24 md:py-32 bg-[#090a0f] text-white relative overflow-hidden isolate">
            <div className="absolute inset-0 z-[-1] opacity-30">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-blue-900/30 blur-[150px]"></div>
            </div>
           <div className="container relative z-10 mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center gap-5 mb-20 animate-fade-in-up">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 px-5 py-2 text-sm font-black backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] tracking-wide">
                <Tag className="h-4 w-4" /> LIMITED TIME OFFERS
              </div>
              <h2 className="text-5xl font-black tracking-tight sm:text-6xl text-white">Active Promotions</h2>
              <p className="max-w-2xl text-zinc-400 text-xl font-medium leading-relaxed">Don&apos;t miss out on our exclusive deals and meticulously crafted financing packages.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {[
                { title: "Ramadan Special", desc: "5% off all MATIC models. Limited slots available.", badge: "5% OFF", end: "April 30" },
                { title: "Free Accessories Pack", desc: "Worth $300 with every test ride booking this month.", badge: "FREE GIFT", end: "April 30" },
                { title: "GSX-R Year-End Deal", desc: "Flat $500 off on the legendary GSX-R1000R.", badge: "$500 OFF", end: "Dec 31" },
              ].map((promo, i) => (
                <div key={i} className="group rounded-[2rem] glass-dark p-10 flex flex-col gap-6 transition-all duration-500 hover:-translate-y-3 hover:bg-white/5 hover:border-blue-500/40 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.3)]">
                  <span className="self-start rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-1.5 text-xs font-black tracking-widest text-white shadow-lg shadow-blue-900/50">{promo.badge}</span>
                  <h3 className="font-extrabold text-3xl text-white">{promo.title}</h3>
                  <p className="text-zinc-400 text-lg flex-1 leading-relaxed font-medium">{promo.desc}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-sm font-bold text-zinc-500">Ends {promo.end}</span>
                    <ArrowRight className="h-6 w-6 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-20 flex justify-center">
              <Link href="/promotions" className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-extrabold text-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95">
                View All Promotions
              </Link>
            </div>
          </div>
        </section>

        {/* Finance Calculator CTA */}
        <section className="w-full py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 max-w-3xl">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] glass shadow-2xl border border-white/30 transform transition-transform hover:rotate-6">
                <Calculator className="h-12 w-12 text-white" />
              </div>
              <div className="pt-2">
                <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight text-white">Plan Your Purchase with Our Finance Calculator</h2>
                <p className="text-blue-100 text-xl font-medium leading-relaxed">Instantly estimate your monthly installments based on your down payment, tenure, and interest rate using our sophisticated tools.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 shrink-0 w-full sm:w-auto">
              <Link href="/simulate-credit" className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-white px-10 text-base font-extrabold text-blue-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:bg-blue-50 hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95">
                Try Calculator
              </Link>
            </div>
          </div>
        </section>

        <AdminPortalSection />
        {/* Dealer Locations Section */}
        <section className="w-full py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-6 md:px-12 text-center animate-fade-in-up">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-zinc-900 dark:text-white mb-6">Our Dealership Network</h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              Find a Suzuki dealership near you and experience the thrill firsthand. We have certified service centers and experts waiting for you.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto text-left">
              {allDealers.length > 0 ? (
                allDealers.map((dealer: any) => (
                  <div key={dealer.id} className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 p-2 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{dealer.name}</h3>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 ml-12">{dealer.location}</p>
                  </div>
                ))
              ) : (
                <>
                  {/* Dummy Data in case there are no dealers */}
                  {[
                    { id: 1, name: "Suzuki Pusat Jakarta", location: "Jl. Jend. Sudirman, Jakarta Pusat" },
                    { id: 2, name: "Suzuki Motor Bandung", location: "Jl. Asia Afrika, Bandung" },
                    { id: 3, name: "Suzuki Surabaya Raya", location: "Jl. Tunjungan, Surabaya" },
                  ].map(dealer => (
                    <div key={dealer.id} className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 p-2 rounded-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{dealer.name}</h3>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 ml-12">{dealer.location}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <div className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800">
              <img src="/favicon.ico" alt="Suzuki Logo" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} SuzukiRide Motor Corporation.<br/>All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-zinc-500 dark:text-zinc-400">
            <Link href="#" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all">Terms of Service</Link>
            <Link href="/portal/leads" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all">Find a Dealer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
