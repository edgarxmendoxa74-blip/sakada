"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState({
        freelancers: 0,
        bookings: 0,
        services: 0
    });

    useEffect(() => {
        const auth = localStorage.getItem("sakada_admin");
        if (!auth) {
            router.push("/admin");
        } else {
            setIsAuthenticated(true);
            fetchStats();
        }
    }, [router]);

    const fetchStats = async () => {
        // Freelancers Count
        const { count: fCount } = await supabase
            .from('freelancers')
            .select('*', { count: 'exact', head: true });

        // Services (Categories) Count
        const { count: cCount } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });

        // Future: Bookings Count
        // const { count: bCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });

        setStats({
            freelancers: fCount || 0,
            bookings: 0, // Not implemented yet
            services: cCount || 0
        });
    };

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
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.freelancers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bookings}</p>
                            <p className="text-xs text-gray-400 mt-1">Via Messenger (Not Tracked)</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Active Services</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.services}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
