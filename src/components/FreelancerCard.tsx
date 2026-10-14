import Link from "next/link";
import { MapPin } from "lucide-react";
import { type Freelancer, formatRate } from "@/lib/types";

interface FreelancerCardProps {
    freelancer: Freelancer;
    onBook?: (freelancer: Freelancer) => void;
}

export default function FreelancerCard({ freelancer, onBook }: FreelancerCardProps) {
    const available = freelancer.availability === "Available";

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg">
            <Link href={`/freelancer/${freelancer.id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {freelancer.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={freelancer.image_url} alt={freelancer.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50 text-5xl font-black text-primary/40">
                        {freelancer.name.charAt(0)}
                    </div>
                )}
                <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${available ? "bg-green-500" : freelancer.availability === "Busy" ? "bg-amber-500" : "bg-gray-500"
                        }`}
                >
                    {available ? "Available" : freelancer.availability}
                </span>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <Link href={`/freelancer/${freelancer.id}`}>
                    <h3 className="text-base font-bold leading-tight text-gray-900 sm:text-lg">{freelancer.name}</h3>
                </Link>
                <p className="truncate text-sm font-medium text-primary">{freelancer.role}</p>
                {freelancer.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3 shrink-0" /> {freelancer.location}
                    </p>
                )}
                {freelancer.bio && <p className="mt-2 line-clamp-2 text-xs text-gray-500">{freelancer.bio}</p>}

                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <div>
                        <span className="block text-[10px] font-semibold uppercase text-gray-400">Starting at</span>
                        <span className="text-lg font-black text-gray-900">{formatRate(freelancer.rate, freelancer.rate_unit)}</span>
                    </div>
                    {onBook ? (
                        <button
                            onClick={() => onBook(freelancer)}
                            disabled={freelancer.availability === "Offline"}
                            className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-all active:scale-95 hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            Book Now
                        </button>
                    ) : (
                        <Link
                            href={`/freelancer/${freelancer.id}`}
                            className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-all active:scale-95 hover:bg-primary"
                        >
                            View
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
