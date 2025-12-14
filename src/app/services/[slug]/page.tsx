import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, freelancers } from "@/data/mockData";
import FreelancerCard from "@/components/FreelancerCard";
import { ChevronLeft, Filter } from "lucide-react";

interface ServicePageProps {
    params: {
        slug: string;
    };
}

export default async function ServicePage({ params }: ServicePageProps) {
    // Await params in newer Next.js versions if needed, but safe here for now or use use helper
    const { slug } = await params;

    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        notFound();
    }

    const categoryFreelancers = freelancers.filter(
        (f) => f.categoryId === category.id
    );

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
                {categoryFreelancers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryFreelancers.map((freelancer) => (
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
