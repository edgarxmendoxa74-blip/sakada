import Link from "next/link";
import { categories } from "@/data/mockData";
import CategoryCard from "@/components/CategoryCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">


      {/* Services Grid */}
      <section className="pt-12 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Shop by Category</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need, delivered by experts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
