"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FreelancerCard from "@/components/FreelancerCard";
import BookingModal from "@/components/BookingModal";
import { supabase } from "@/lib/supabase";
import { RefreshCw } from "lucide-react";

// Types
import { type Freelancer } from "@/data/mockData";

type Category = { id: string; name: string; slug: string };

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // Fetch Freelancers
      const { data: freeData } = await supabase.from('freelancers').select('*');
      if (freeData) setFreelancers(freeData);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleBook = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-2 text-primary animate-pulse">
          <RefreshCw className="animate-spin h-6 w-6" />
          <span className="font-bold">Loading Services...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Loop through categories and show freelancers for each */}
      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* If no categories yet */}
        {categories.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-xl font-bold mb-2">Welcome to Sakada Services!</h3>
            <p>No services are listed yet. Admin, please add categories in the Dashboard.</p>
          </div>
        )}

        {categories.map((category) => {
          const categoryFreelancers = freelancers.filter(f =>
            (f.role || "").toLowerCase() === (category.name || "").toLowerCase()
          );

          if (categoryFreelancers.length === 0) return null;

          return (
            <section key={category.id}>
              <div className="mb-8 flex items-end justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">{category.name}</h2>
                </div>
                <Link href={`/services/${category.slug}`} className="text-sm font-bold text-primary hover:text-violet-700 hover:underline">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryFreelancers.map((freelancer) => (
                  <FreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                    onBook={handleBook}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedFreelancer && (
        <BookingModal
          freelancer={selectedFreelancer}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}
