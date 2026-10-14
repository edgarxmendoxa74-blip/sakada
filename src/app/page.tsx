"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RefreshCw, Search, ShieldCheck, Zap, Wallet } from "lucide-react";
import FreelancerCard from "@/components/FreelancerCard";
import BookingModal from "@/components/BookingModal";
import { supabase } from "@/lib/supabase";
import { type Category, type Freelancer } from "@/lib/types";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Freelancer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [cats, free] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("freelancers").select("*").order("created_at", { ascending: false }),
      ]);
      if (cats.data) setCategories(cats.data);
      if (free.data) setFreelancers(free.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? freelancers.filter((f) =>
      [f.name, f.role, f.location, f.bio].some((v) => (v || "").toLowerCase().includes(q))
    )
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-hero text-white">
        {/* Logo-inspired quadrant motif */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 grid-cols-2 gap-1.5 opacity-20 sm:grid md:-right-8 md:h-96 md:w-96">
          <span className="rounded-tl-full bg-white" />
          <span className="rounded-tr-full bg-brand-orange" />
          <span className="rounded-bl-full bg-brand-gray" />
          <span className="rounded-br-full bg-brand-green" />
        </div>

        <div className="container relative mx-auto px-4 py-12 text-center sm:py-20">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-200 sm:text-xs">
            Hotel • Food • Wellness • Home • More
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Book trusted services, <span className="text-brand-orange">one tap away</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
            Pick a category, choose a provider, and book in minutes. Pay by GCash or bank and confirm over Messenger.
          </p>
          <div className="relative mx-auto mt-7 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a service or provider..."
              className="w-full rounded-full border-0 bg-white py-3.5 pl-12 pr-4 text-base text-gray-900 shadow-xl placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-orange/40"
            />
          </div>
          <div className="mx-auto mt-7 grid max-w-2xl grid-cols-3 gap-2 text-[11px] font-semibold sm:gap-3 sm:text-sm">
            <span className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-2 py-3 backdrop-blur-sm"><ShieldCheck className="h-5 w-5 text-brand-orange" /> Vetted providers</span>
            <span className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-2 py-3 backdrop-blur-sm"><Zap className="h-5 w-5 text-brand-orange" /> Quick booking</span>
            <span className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-2 py-3 backdrop-blur-sm"><Wallet className="h-5 w-5 text-brand-orange" /> Easy payment</span>
          </div>
        </div>
        <div className="flex h-1.5">
          <span className="flex-1 bg-brand-navy brightness-150" />
          <span className="flex-1 bg-brand-orange" />
          <span className="flex-1 bg-brand-gray" />
          <span className="flex-1 bg-brand-green" />
        </div>
      </section>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="flex animate-pulse items-center gap-2 text-primary">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="font-bold">Loading services...</span>
          </div>
        </div>
      ) : q ? (
        /* Search results */
        <div className="container mx-auto px-4 py-8">
          <h2 className="mb-4 text-xl font-black text-gray-900">
            {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
          </h2>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((f) => <FreelancerCard key={f.id} freelancer={f} onBook={setSelected} />)}
            </div>
          ) : (
            <p className="py-16 text-center text-gray-500">No providers match your search.</p>
          )}
        </div>
      ) : (
        <div className="container mx-auto space-y-12 px-4 py-8 sm:py-12">
          {categories.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <h3 className="mb-2 text-xl font-bold">Welcome to Sakada Services!</h3>
              <p>No services are listed yet. Admin, please add categories in the Dashboard.</p>
            </div>
          ) : (
            <>
              {/* Providers per category */}
              {categories.map((category) => {
                const list = freelancers.filter((f) => (f.role || "").toLowerCase() === category.name.toLowerCase());
                if (list.length === 0) return null;
                return (
                  <section key={category.id}>
                    <div className="mb-4 flex items-end justify-between border-b pb-3">
                      <h2 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">{category.name}</h2>
                      <Link href={`/services/${category.slug}`} className="text-sm font-bold text-primary hover:underline">
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                      {list.slice(0, 4).map((f) => <FreelancerCard key={f.id} freelancer={f} onBook={setSelected} />)}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>
      )}

      {selected && <BookingModal freelancer={selected} isOpen onClose={() => setSelected(null)} />}
    </div>
  );
}
