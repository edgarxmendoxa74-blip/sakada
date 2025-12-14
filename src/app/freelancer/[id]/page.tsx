"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { freelancers, categories } from "@/data/mockData";
import { Star, MapPin, Shield, Info, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";
import { cn } from "@/lib/utils";

export default function FreelancerPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const freelancer = freelancers.find((f) => f.id === id);
    const [agreed, setAgreed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!freelancer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Freelancer not found</h1>
            </div>
        );
    }

    const category = categories.find((c) => c.id === freelancer.categoryId);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b sticky top-16 z-30 px-4 py-4">
                <div className="container mx-auto">
                    <Link href={`/services/${category?.slug}`} className="flex items-center text-sm text-gray-500 hover:text-primary">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to {category?.name}
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Header */}
                        <div className="bg-white rounded-2xl p-8 border shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 shrink-0">
                                    {freelancer.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{freelancer.name}</h1>
                                            <p className="text-primary font-medium">{freelancer.role}</p>
                                        </div>
                                        <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                            <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                                            <span className="font-bold text-amber-700">{freelancer.rating}</span>
                                            <span className="text-xs text-amber-600 ml-1">({freelancer.reviewCount})</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm mt-2">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {freelancer.location}
                                    </div>

                                    <p className="mt-4 text-gray-600 leading-relaxed">
                                        {freelancer.bio}
                                    </p>

                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {freelancer.skills.map((skill) => (
                                                <span key={skill} className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-700 font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimers Section */}
                        <div className="bg-white rounded-2xl p-8 border shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Important Disclaimers
                            </h3>

                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <h4 className="font-semibold text-orange-800 mb-2 text-sm flex items-center">
                                    <Info className="h-4 w-4 mr-2" />
                                    Health & Wellness Disclaimer
                                </h4>
                                <p className="text-sm text-orange-700/80">
                                    Services are provided by independent freelancers. Clients must declare any accurate health conditions prior to booking. The platform is not liable for any health-related incidents.
                                </p>
                            </div>

                            <div className="text-sm text-gray-500 space-y-3">
                                <p>
                                    <strong>Worker & Client Safety:</strong> Both clients and freelancers agree to follow strict health and safety guidelines during the service.
                                </p>
                                <p>
                                    <strong>Data Privacy:</strong> Personal information is used solely for booking and communication purposes in compliance with the Data Privacy Act.
                                </p>
                            </div>

                            <div className="pt-6 border-t">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-primary checked:bg-primary"
                                        />
                                        <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">
                                        I have read and agree to the <span className="font-semibold">Terms of Service</span>, <span className="font-semibold">Health Disclaimer</span>, and <span className="font-semibold">Privacy Policy</span>.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border shadow-lg p-6 sticky top-28">
                            <div className="text-center pb-6 border-b mb-6">
                                <span className="text-gray-500 text-sm uppercase font-semibold">Service Rate</span>
                                <div className="flex items-end justify-center gap-1 mt-1">
                                    <span className="text-4xl font-bold text-gray-900">₱{freelancer.rate}</span>
                                    <span className="text-gray-500 mb-1.5">/{freelancer.rateUnit}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service Fee</span>
                                    <span className="font-medium text-gray-900">₱0.00</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-primary">₱{freelancer.rate}</span>
                                </div>
                            </div>

                            <button
                                disabled={!agreed}
                                onClick={() => setIsModalOpen(true)}
                                className={cn(
                                    "w-full mt-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all",
                                    agreed
                                        ? "bg-primary hover:bg-violet-700 hover:shadow-primary/25 active:scale-95"
                                        : "bg-gray-300 cursor-not-allowed"
                                )}
                            >
                                {agreed ? "Book Now" : "Accept Terms to Book"}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                You won't be charged until you proceed to GCash payment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                freelancer={freelancer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
