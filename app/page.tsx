import Link from "next/link";

export const dynamic = "force-dynamic";

import { ArrowRight, Calendar, Info, Phone, Tag, Calculator, BarChart2, Users, MapPin, ChevronRight, Zap, Shield, Sparkles } from "lucide-react";
import TestRideForm from "./components/TestRideForm";
import { prisma } from "@/lib/prisma";

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
      {/* Navbar with blur and enhanced shadows */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70 transition-all">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="rounded-full bg-white p-1 shadow-sm">
              <img src="/favicon.ico" alt="Suzuki Logo" className="h-8 w-auto" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-blue-700 dark:text-blue-500 hidden sm:inline-block">
              SuzukiRide
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-semibold tracking-wide">
            <Link href="#models" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Models</Link>
            <Link href="#test-ride" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Test Ride</Link>
            <Link href="/portal/leads" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dealers Portal</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-bold text-zinc-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors">Login</Link>
            <Link href="/auth/register" className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 text-center">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Improved Hero Section with Radial Gradients */}
        <section className="relative w-full py-24 md:py-32 lg:py-48 bg-zinc-950 overflow-hidden isolate">
          <div className="absolute inset-0 z-[-1] opacity-70">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/40 blur-[120px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px]"></div>
          </div>
          <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col items-center md:items-start text-center md:text-left gap-8">
            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4" /> 2025 Models Pre-order
            </div>
            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl">
              Thrill Meets <br className="hidden lg:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Pure Performance</span>
            </h1>
            <p className="max-w-2xl text-lg text-zinc-300 sm:text-xl font-medium leading-relaxed">
              Discover our latest lineup of sport bikes, adventure motorcycles, and agile scooters designed to conquer every road.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a
                href="#models"
                className="group inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-blue-600 px-8 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"
              >
                Explore Models <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#test-ride"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border-2 border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95"
              >
                Book a Test Ride
              </a>
            </div>
          </div>
        </section>

        {/* Featured Models Section with Hover Cards */}
        <section id="models" className="w-full py-20 md:py-32 bg-white dark:bg-zinc-950 relative">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Featured Motorcycles</h2>
              <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Precision engineering tailored to your riding style. From the track-ready GSX-R to the versatile V-Strom architecture.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-6xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayMotorcycles.map((m) => (
                <div key={m.id} className="group relative flex flex-col items-start justify-between rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition-all hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 dark:border-zinc-800/80 dark:bg-zinc-900/50">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-5 relative group-hover:shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                  </div>
                  <div className="flex w-full items-center justify-between mb-3 px-1">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{m.type}</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">From ${m.price.toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 px-1 tracking-tight">{m.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 px-1 line-clamp-2 leading-relaxed font-medium">
                    {m.desc}
                  </p>
                  <Link href={`/motorcycles/${m.id}`} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 py-3.5 text-sm font-bold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800 dark:hover:border-blue-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600">
                    <Info className="h-4 w-4" /> View Details
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <Link href="/motorcycles" className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-base font-bold shadow-sm transition-all hover:bg-zinc-100 hover:scale-105 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                View Entire Catalog <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA / Test Ride Section - Connected to DB */}
        <section id="test-ride" className="w-full py-20 md:py-32 bg-blue-50 dark:bg-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 opacity-10">
            <Zap className="w-96 h-96 text-blue-600" />
          </div>
          <div className="container relative mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block dark:text-blue-400">Experience It</span>
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 text-zinc-900 dark:text-white">Book Your Exclusive Test Ride</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
                  There’s no better way to understand the engineering excellence of a Suzuki motorcycle than experiencing it firsthand. Schedule your ride securely via our portal.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800">
                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Flexible Scheduling</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Pick a date and time slot that perfectly fits your calendar.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800">
                      <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Direct Dealership Connection</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Your request goes straight to verified Suzuki dealerships.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-950/80 sm:p-10">
                <TestRideForm motorcycles={allMotorcycles} dealers={allDealers} />
              </div>
            </div>
          </div>
        </section>

        {/* Active Promotions Section */}
        <section className="w-full py-20 md:py-24 bg-zinc-900 text-white relative overflow-hidden">
           <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center text-center gap-3 mb-16">
              <div className="flex items-center gap-2 rounded-full bg-blue-500/20 text-blue-300 px-4 py-1.5 text-sm font-bold backdrop-blur-sm border border-blue-500/30">
                <Tag className="h-4 w-4" /> Limited Time Offers
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Active Promotions</h2>
              <p className="max-w-xl text-zinc-400 text-lg">Don&apos;t miss out on our exclusive deals and special packages.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                { title: "Ramadan Special", desc: "5% off all MATIC models. Limited slots available.", badge: "5% OFF", end: "April 30" },
                { title: "Free Accessories Pack", desc: "Worth $300 with every test ride booking this month.", badge: "FREE GIFT", end: "April 30" },
                { title: "GSX-R Year-End Deal", desc: "Flat $500 off on the legendary GSX-R1000R.", badge: "$500 OFF", end: "Dec 31" },
              ].map((promo, i) => (
                <div key={i} className="group rounded-3xl bg-zinc-800/50 backdrop-blur-md border border-zinc-700 p-8 flex flex-col gap-4 transition-transform hover:-translate-y-2 hover:bg-zinc-800 hover:border-blue-500/50">
                  <span className="self-start rounded-full bg-blue-600 px-4 py-1 text-xs font-black tracking-widest text-white shadow-lg shadow-blue-900/50">{promo.badge}</span>
                  <h3 className="font-bold text-2xl">{promo.title}</h3>
                  <p className="text-zinc-400 text-base flex-1">{promo.desc}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-700 pt-4">
                    <span className="text-sm font-bold text-zinc-500">Ends {promo.end}</span>
                    <ArrowRight className="h-5 w-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <Link href="/portal/campaigns" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-zinc-900 shadow transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95">
                View All Promotions
              </Link>
            </div>
          </div>
        </section>

        {/* Finance Calculator CTA */}
        <section className="w-full py-16 bg-blue-700 text-white">
          <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 max-w-2xl">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md shadow-inner border border-white/20">
                <Calculator className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-3">Plan Your Purchase with Our Finance Calculator</h2>
                <p className="text-blue-100 text-lg">Instantly estimate your monthly installments based on your down payment, tenure, and interest rate.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <Link href="/simulate-credit" className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-white px-8 text-base font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:scale-105 active:scale-95">
                Try Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* Portal / Internal Tools Section */}
        <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-white">Sales Team Portal</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-4 max-w-2xl mx-auto">Access the internal tools to manage dealership operations, leads, and analytics.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
              {[
                { href: "/portal/leads", icon: <Users className="h-7 w-7" />, title: "Lead Management", desc: "Track and manage potential customers across the pipeline." },
                { href: "/portal/performance", icon: <BarChart2 className="h-7 w-7" />, title: "Sales Analytics", desc: "Monitor team performance, targets, and conversion rates." },
                { href: "/portal/campaigns", icon: <Tag className="h-7 w-7" />, title: "Campaign Manager", desc: "Create and manage promotions and marketing campaigns." },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="group flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-600">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl">{item.title}</h3>
                    <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="mt-auto pt-4 text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all dark:text-blue-400">Open Portal <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
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
