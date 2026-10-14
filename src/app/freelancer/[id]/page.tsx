"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Shield, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { supabase } from "@/lib/supabase";
import { type Freelancer, formatRate } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FreelancerPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
    const [loading, setLoading] = useState(true);
    const [agreed, setAgreed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            const { data } = await supabase.from("freelancers").select("*").eq("id", id).single();
            if (data) {
                setFreelancer(data);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-primary">
                <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!freelancer) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
                <h1 className="text-2xl font-bold">Provider not found</h1>
                <Link href="/" className="text-primary hover:underline">Go Home</Link>
            </div>
        );
    }

    const canBook = agreed && freelancer.availability !== "Offline";
    const bookLabel = freelancer.availability === "Offline" ? "Currently Offline" : agreed ? "Book Now" : "Accept Terms to Book";
    const bookButton = (
        <button
            disabled={!canBook}
            onClick={() => setIsModalOpen(true)}
            className={cn(
                "w-full rounded-xl py-3.5 font-bold text-white shadow-lg transition-all",
                canBook ? "bg-primary hover:bg-primary/90 active:scale-95" : "cursor-not-allowed bg-gray-300"
            )}
        >
            {bookLabel}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-28 lg:pb-16">
            <div className="border-b bg-white px-4 py-3">
                <div className="container mx-auto">
                    <Link
                        href="/"
                        className="flex items-center text-sm text-gray-500 hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to services
                    </Link>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                            <div className="aspect-[16/9] w-full bg-blue-50 sm:aspect-[21/9]">
                                {freelancer.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={freelancer.image_url} alt={freelancer.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-6xl font-black text-primary/30">
                                        {freelancer.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="p-5 sm:p-8">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{freelancer.name}</h1>
                                        <p className="font-medium text-primary">{freelancer.role}</p>
                                    </div>
                                    <span
                                        className={cn(
                                            "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
                                            freelancer.availability === "Available" ? "bg-green-100 text-green-800"
                                                : freelancer.availability === "Busy" ? "bg-amber-100 text-amber-800"
                                                    : "bg-gray-100 text-gray-700"
                                        )}
                                    >
                                        {freelancer.availability}
                                    </span>
                                </div>
                                {freelancer.location && (
                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                        <MapPin className="mr-1 h-4 w-4" /> {freelancer.location}
                                    </p>
                                )}
                                {freelancer.bio && <p className="mt-4 leading-relaxed text-gray-600">{freelancer.bio}</p>}
                                {freelancer.skills && freelancer.skills.length > 0 && freelancer.skills.some((s) => s !== "General") && (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {freelancer.skills.map((s) => (
                                            <span key={s} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">{s}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <Shield className="h-5 w-5 text-primary" /> Before you book
                            </h3>
                            <div className="space-y-3 text-sm text-gray-500">
                                <p><strong>Independent providers:</strong> Services are delivered by independent providers. Please share accurate details about what you need.</p>
                                <p><strong>Safety:</strong> Clients and providers agree to follow health and safety guidelines during the service.</p>
                                <p><strong>Data privacy:</strong> Your personal information is used only for booking and communication.</p>
                            </div>
                            <label className="group flex cursor-pointer items-start gap-3 border-t pt-5">
                                <div className="relative flex shrink-0 items-center">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-primary checked:bg-primary"
                                    />
                                    <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                                </div>
                                <span className="select-none text-sm text-gray-700">
                                    I have read and agree to the <span className="font-semibold">Terms of Service</span> and <span className="font-semibold">Privacy Policy</span>.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Desktop booking card */}
                    <div className="hidden lg:col-span-1 lg:block">
                        <div className="sticky top-28 rounded-2xl border bg-white p-6 shadow-lg">
                            <div className="mb-6 border-b pb-6 text-center">
                                <span className="text-sm font-semibold uppercase text-gray-500">Service Rate</span>
                                <div className="mt-1 text-4xl font-bold text-gray-900">{formatRate(freelancer.rate, freelancer.rate_unit)}</div>
                            </div>
                            {bookButton}
                            <p className="mt-4 text-center text-xs text-gray-400">Pay via GCash/bank after filling in your details.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sticky booking bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
                <div className="mx-auto flex max-w-md items-center gap-3">
                    <div className="shrink-0">
                        <span className="block text-[10px] font-semibold uppercase text-gray-400">Rate</span>
                        <span className="text-lg font-black text-gray-900">{formatRate(freelancer.rate, freelancer.rate_unit)}</span>
                    </div>
                    {bookButton}
                </div>
            </div>

            <BookingModal freelancer={freelancer} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
