"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Users, Calendar, Settings, LogOut } from "lucide-react";

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("sakada_admin");
        router.push("/admin");
    };

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold tracking-tight">Sakada Admin</h1>
            </div>
            <nav className="p-4 space-y-2 flex-1">
                <Link
                    href="/admin/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/dashboard') ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                >
                    <LayoutGrid className="h-5 w-5" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/freelancers"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/freelancers') ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                >
                    <Users className="h-5 w-5" />
                    Freelancers
                </Link>
                <Link
                    href="/admin/bookings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/bookings') ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                >
                    <Calendar className="h-5 w-5" />
                    Bookings
                </Link>
                <Link
                    href="/admin/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/settings') ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                >
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
            </nav>
            <div className="mt-auto p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
