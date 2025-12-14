"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { freelancers } from "@/data/mockData";

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem("sakada_admin");
        if (!auth) {
            router.push("/admin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Total Freelancers</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{freelancers.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Active Services</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
