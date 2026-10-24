"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FreelancerCard from "@/components/FreelancerCard";
import { ChevronLeft, Filter, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ServicePage() {
    // In client components, use useParams() hook
    const params = useParams();
    const slug = params?.slug as string;

    const [category, setCategory] = useState<any>(null);
    const [freelancers, setFreelancers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setLoading(true);

            // 1. Fetch Category by Slug
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', slug)
                .single();

            if (catError || !catData) {
                console.error("Category not found:", catError);
                setLoading(false);
                return;
            }

            setCategory(catData);

            // 2. Fetch Freelancers matching this Category Name (Role)
            const { data: freeData, error: freeError } = await supabase
                .from('freelancers')
                .select('*')
                .ilike('role', catData.name); // Case-insensitive match

            if (freeData) setFreelancers(freeData);

            setLoading(false);
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex items-center gap-2 text-primary animate-pulse">
                    <RefreshCw className="animate-spin h-6 w-6" />
                    <span className="font-bold">Loading...</span>
                </div>
            </div>
        );
    }

    if (!category) {
        // You can render a custom not found here or just return null
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Category not found</h1>
                <Link href="/" className="text-primary hover:underline">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Category Header */}
            <div className="bg-white border-b sticky top-16 z-30">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-4">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Categories
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                            <p className="text-gray-500 mt-1">
                                Browse {category.name.toLowerCase()} professionals
                            </p>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-300">
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {freelancers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {freelancers.map((freelancer) => (
                            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No freelancers found in this category yet.</p>
                        <Link href="/" className="text-primary font-medium hover:underline mt-2 inline-block">
                            Browse other categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
