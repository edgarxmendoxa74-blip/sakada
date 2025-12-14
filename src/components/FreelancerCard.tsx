import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { type Freelancer } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface FreelancerCardProps {
    freelancer: Freelancer;
    onBook?: (freelancer: Freelancer) => void;
}

export default function FreelancerCard({ freelancer, onBook }: FreelancerCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-lg bg-white border border-gray-100 transition-all hover:shadow-xl">
            <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
                {freelancer.image_url ? (
                    <img src={freelancer.image_url} alt={freelancer.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-5xl font-black">
                        {freelancer.name.charAt(0)}
                    </div>
                )}
                {freelancer.availability === 'Available' && (
                    <div className="absolute top-3 left-3 rounded bg-green-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        Available Now
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {freelancer.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium truncate">{freelancer.role}</p>
                </div>

                {freelancer.bio && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {freelancer.bio}
                    </p>
                )}

                <div className="flex items-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{freelancer.rating}</span>
                    <span className="text-xs text-gray-400">({freelancer.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <span className="block text-xs text-gray-400 font-semibold uppercase">Starting at</span>
                        <span className="text-xl font-black text-gray-900">₱{freelancer.rate}</span>
                    </div>
                    {onBook ? (
                        <button
                            onClick={() => onBook(freelancer)}
                            className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-transform active:scale-95 group-hover:bg-primary"
                        >
                            Book Now
                        </button>
                    ) : (
                        <Link
                            href={`/freelancer/${freelancer.id}`}
                            className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-transform active:scale-95 group-hover:bg-primary"
                        >
                            Book Now
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
