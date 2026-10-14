"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Users, Calendar, Settings, LogOut } from "lucide-react";

const NAV = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/freelancers", label: "Providers", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("sakada_admin");
        router.push("/admin");
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Desktop sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-gray-900 text-white md:flex">
                <div className="border-b border-gray-800 p-6">
                    <h1 className="text-xl font-bold tracking-tight">Sakada Admin</h1>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                    {NAV.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors ${pathname === href ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <Icon className="h-5 w-5" /> {label}
                        </Link>
                    ))}
                </nav>
                <div className="space-y-2 border-t border-gray-800 p-4">
                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                        <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile top bar */}
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-gray-900 px-4 text-white md:hidden">
                    <span className="font-bold tracking-tight">Sakada Admin</span>
                    <div className="flex items-center gap-1">
                        <button onClick={handleLogout} aria-label="Sign out" className="p-2 text-gray-300"><LogOut className="h-5 w-5" /></button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-4 pb-24 sm:p-6 md:p-8 md:pb-8">{children}</main>

                {/* Mobile bottom tab bar */}
                <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
                    {NAV.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${pathname === href ? "text-primary" : "text-gray-500"}`}
                        >
                            <Icon className="h-5 w-5" /> {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
