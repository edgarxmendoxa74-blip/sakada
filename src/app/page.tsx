"use client";

import { useEffect, useState, useMemo } from "react";
import {
  RefreshCw,
  Search,
  ShieldCheck,
  Zap,
  Wallet,
  Users,
  Layers,
  LayoutGrid,
  Utensils,
  Sparkles,
  Home as HomeIcon,
  Truck,
  Hotel,
  Wrench,
  BookOpen,
  FileText,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import FreelancerCard from "@/components/FreelancerCard";
import HorizontalServicesSection from "@/components/HorizontalServicesSection";
import BookingModal from "@/components/BookingModal";
import { supabase } from "@/lib/supabase";
import { type Freelancer } from "@/lib/types";

// Category metadata for icons and accents
const CATEGORY_META: Record<
  string,
  { label: string; icon: LucideIcon; color: string }
> = {
  "Restaurant Services": {
    label: "Restaurant & Food",
    icon: Utensils,
    color: "text-amber-600 bg-amber-50",
  },
  "Health, Wellness & Beauty": {
    label: "Health, Wellness & Beauty",
    icon: Sparkles,
    color: "text-pink-600 bg-pink-50",
  },
  "Building / House Services": {
    label: "Building & House Services",
    icon: HomeIcon,
    color: "text-blue-600 bg-blue-50",
  },
  "Transportation / Delivery": {
    label: "Transportation & Delivery",
    icon: Truck,
    color: "text-emerald-600 bg-emerald-50",
  },
  "Hotel Services": {
    label: "Hotel & Hospitality",
    icon: Hotel,
    color: "text-indigo-600 bg-indigo-50",
  },
  "Maintenance Services": {
    label: "Maintenance & Repairs",
    icon: Wrench,
    color: "text-orange-600 bg-orange-50",
  },
  "Tutorial Services": {
    label: "Tutorial & Education",
    icon: BookOpen,
    color: "text-purple-600 bg-purple-50",
  },
  "Legal & Documentation": {
    label: "Legal & Documentation",
    icon: FileText,
    color: "text-slate-600 bg-slate-50",
  },
};

function normalizeCategoryKey(role: string): string {
  const r = (role || "").toLowerCase();
  if (r.includes("hotel")) return "Hotel Services";
  if (r.includes("restaurant") || r.includes("food") || r.includes("chef"))
    return "Restaurant Services";
  if (
    r.includes("wellness") ||
    r.includes("health") ||
    r.includes("beauty") ||
    r.includes("massage")
  )
    return "Health, Wellness & Beauty";
  if (
    r.includes("transport") ||
    r.includes("delivery") ||
    r.includes("ride") ||
    r.includes("toda")
  )
    return "Transportation / Delivery";
  if (
    r.includes("clean") ||
    r.includes("building") ||
    r.includes("house") ||
    r.includes("construction")
  )
    return "Building / House Services";
  if (r.includes("maintenance") || r.includes("repair") || r.includes("plumb"))
    return "Maintenance Services";
  if (r.includes("tutor") || r.includes("teach")) return "Tutorial Services";
  if (r.includes("legal") || r.includes("doc")) return "Legal & Documentation";
  return role || "Other Services";
}

export default function Home() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Freelancer | null>(null);
  const [viewMode, setViewMode] = useState<"renderer" | "category" | "grid">(
    "renderer"
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("freelancers")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setFreelancers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const q = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!q) return [];
    return freelancers.filter((f) =>
      [f.name, f.role, f.location, f.bio].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  }, [freelancers, q]);

  // Filtered by selected category chip (if any)
  const filteredFreelancers = useMemo(() => {
    if (activeCategoryFilter === "all") return freelancers;
    return freelancers.filter(
      (f) => normalizeCategoryKey(f.role) === activeCategoryFilter
    );
  }, [freelancers, activeCategoryFilter]);

  // Grouped by Renderer (Provider)
  const groupedByRenderer = useMemo(() => {
    const map = new Map<string, Freelancer[]>();
    filteredFreelancers.forEach((f) => {
      const key = (f.name || "Provider").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    });

    const groups: {
      name: string;
      items: Freelancer[];
      location?: string;
      roleSummary: string;
    }[] = [];

    map.forEach((items, name) => {
      const roles = Array.from(
        new Set(items.map((i) => i.role).filter(Boolean))
      ).join(" • ");
      const loc = items.find((i) => i.location)?.location || undefined;
      groups.push({
        name,
        items,
        location: loc,
        roleSummary: roles,
      });
    });

    return groups;
  }, [filteredFreelancers]);

  // Grouped by Category
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Freelancer[]>();
    filteredFreelancers.forEach((f) => {
      const key = normalizeCategoryKey(f.role);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    });

    const groups: {
      key: string;
      label: string;
      items: Freelancer[];
      icon: LucideIcon;
      color: string;
    }[] = [];

    map.forEach((items, key) => {
      const meta = CATEGORY_META[key] || {
        label: key,
        icon: Briefcase,
        color: "text-gray-700 bg-gray-100",
      };
      groups.push({
        key,
        label: meta.label,
        items,
        icon: meta.icon,
        color: meta.color,
      });
    });

    return groups;
  }, [filteredFreelancers]);

  // Available unique categories for the filter bar
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    freelancers.forEach((f) => {
      cats.add(normalizeCategoryKey(f.role));
    });
    return Array.from(cats);
  }, [freelancers]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-hero text-white">
        {/* Logo quadrant motif */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 grid-cols-2 gap-1.5 opacity-20 sm:grid md:-right-8 md:h-96 md:w-96"
        >
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
            Choose a service and book in minutes. Pay by GCash or bank and confirm over Messenger.
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
            <span className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-2 py-3 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-brand-orange" /> Vetted providers
            </span>
            <span className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-2 py-3 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-brand-orange" /> Quick booking
            </span>
            <span className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-2 py-3 backdrop-blur-sm">
              <Wallet className="h-5 w-5 text-brand-orange" /> Easy payment
            </span>
          </div>
        </div>
        <div className="flex h-1.5">
          <span className="flex-1 bg-brand-navy brightness-150" />
          <span className="flex-1 bg-brand-orange" />
          <span className="flex-1 bg-brand-gray" />
          <span className="flex-1 bg-brand-green" />
        </div>
      </section>

      {/* Main Content Area */}
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
            {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for “{query}”
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.map((f) => (
                <FreelancerCard key={f.id} freelancer={f} onBook={setSelected} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-gray-500">
              No providers match your search.
            </p>
          )}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6 sm:py-10">
          {freelancers.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <h3 className="mb-2 text-xl font-bold">Welcome to Sakada Services!</h3>
              <p>No services are listed yet. Admin, please add services in the Dashboard.</p>
            </div>
          ) : (
            <>
              {/* Category Quick-Filter Chips */}
              <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter("all")}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    activeCategoryFilter === "all"
                      ? "bg-brand-navy text-white shadow-xs"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories ({freelancers.length})
                </button>
                {availableCategories.map((catKey) => {
                  const meta = CATEGORY_META[catKey];
                  const Icon = meta?.icon || Briefcase;
                  const count = freelancers.filter(
                    (f) => normalizeCategoryKey(f.role) === catKey
                  ).length;
                  const isSelected = activeCategoryFilter === catKey;

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setActiveCategoryFilter(catKey)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                        isSelected
                          ? "bg-brand-orange text-white shadow-xs"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{meta?.label || catKey}</span>
                      <span className="opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Controls */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                    Services & Offers
                  </h2>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {viewMode === "renderer" && "Naka-hiwalay per service renderer/provider na may horizontal column scroll"}
                    {viewMode === "category" && "Naka-grupo ayon sa kategorya ng serbisyo"}
                    {viewMode === "grid" && "Lahat ng serbisyo sa regular na grid"}
                  </p>
                </div>

                {/* View Mode Switcher */}
                <div className="flex w-full sm:w-auto overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("renderer")}
                    className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                      viewMode === "renderer"
                        ? "bg-brand-navy text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Per Renderer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("category")}
                    className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                      viewMode === "category"
                        ? "bg-brand-navy text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Per Category</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                      viewMode === "grid"
                        ? "bg-brand-navy text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: PER RENDERER (Separated per provider with horizontal offer columns) */}
              {viewMode === "renderer" && (
                <div className="space-y-2">
                  {groupedByRenderer.map((group) => (
                    <HorizontalServicesSection
                      key={group.name}
                      title={group.name}
                      subtitle={
                        group.location
                          ? `${group.location} • ${group.roleSummary}`
                          : group.roleSummary
                      }
                      badge={`${group.items.length} ${
                        group.items.length === 1 ? "offer" : "offers"
                      }`}
                      icon={Users}
                      iconColor="text-blue-700 bg-blue-50"
                      items={group.items}
                      onBook={setSelected}
                    />
                  ))}
                </div>
              )}

              {/* VIEW 2: PER CATEGORY (Separated per service category with horizontal renderer columns) */}
              {viewMode === "category" && (
                <div className="space-y-2">
                  {groupedByCategory.map((cat) => (
                    <HorizontalServicesSection
                      key={cat.key}
                      title={cat.label}
                      subtitle={`Available verified providers in ${cat.label}`}
                      badge={`${cat.items.length} ${
                        cat.items.length === 1 ? "provider" : "providers"
                      }`}
                      icon={cat.icon}
                      iconColor={cat.color}
                      items={cat.items}
                      onBook={setSelected}
                    />
                  ))}
                </div>
              )}

              {/* VIEW 3: GRID VIEW */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredFreelancers.map((f) => (
                    <FreelancerCard key={f.id} freelancer={f} onBook={setSelected} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selected && (
        <BookingModal
          freelancer={selected}
          isOpen
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
