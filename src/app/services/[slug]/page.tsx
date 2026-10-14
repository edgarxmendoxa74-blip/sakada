"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, RefreshCw, Search } from "lucide-react";
import FreelancerCard from "@/components/FreelancerCard";
import BookingModal from "@/components/BookingModal";
import { supabase } from "@/lib/supabase";
import { type Category, type Freelancer } from "@/lib/types";

const FILTERS = ["All", "Available", "Busy"] as const;

export default function ServicePage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
    const [selected, setSelected] = useState<Freelancer | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setLoading(true);

            const { data: cat } = await supabase.from("categories").select("*").eq("slug", slug).single();
            if (!cat) {
                setCategory(null);
                setLoading(false);
                return;
            }
            setCategory(cat);

            const { data } = await supabase
                .from("freelancers")
                .select("*")
                .ilike("role", cat.name)
                .order("created_at", { ascending: false });
            setFreelancers(data || []);
            setLoading(false);
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex animate-pulse items-center gap-2 text-primary">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span className="font-bold">Loading...</span>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Category not found</h1>
                <Link href="/" className="text-primary hover:underline">Go Home</Link>
            </div>
        );
    }

    const q = query.trim().toLowerCase();
    const visible = freelancers.filter((f) => {
        if (filter !== "All" && f.availability !== filter) return false;
        return !q || [f.name, f.location, f.bio].some((v) => (v || "").toLowerCase().includes(q));
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="border-b bg-white">
                <div className="container mx-auto px-4 py-5 sm:py-6">
                    <Link href="/" className="mb-3 inline-flex items-center text-sm text-gray-500 hover:text-primary">
                        <ChevronLeft className="mr-1 h-4 w-4" /> All services
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{category.name}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {freelancers.length} {freelancers.length === 1 ? "provider" : "providers"} ready to book
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search name or location..."
                                className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex gap-2">
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${filter === f ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-600 hover:border-primary"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 sm:py-8">
                {visible.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {visible.map((f) => <FreelancerCard key={f.id} freelancer={f} onBook={setSelected} />)}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-lg text-gray-500">
                            {freelancers.length === 0 ? "No providers in this category yet." : "No providers match your filters."}
                        </p>
                        <Link href="/" className="mt-2 inline-block font-medium text-primary hover:underline">Browse other categories</Link>
                    </div>
                )}
            </div>

            {selected && <BookingModal freelancer={selected} isOpen onClose={() => setSelected(null)} />}
        </div>
    );
}
