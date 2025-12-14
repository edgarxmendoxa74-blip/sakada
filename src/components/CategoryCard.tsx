import Link from "next/link";
import * as Icons from "lucide-react";
import { type Category } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    // Dynamic icon content
    const IconComponent = (Icons as any)[category.iconName] || Icons.HelpCircle;

    return (
        <Link
            href={`/services/${category.slug}`}
            className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-md hover:border-primary/50"
        >
            <div className="flex flex-col items-center justify-center pt-6 pb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-900 group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                    <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors text-center">
                    {category.name}
                </h3>
                <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    View Collection
                </span>
            </div>
        </Link>
    );
}
