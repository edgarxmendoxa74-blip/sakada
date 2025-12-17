"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/settings";

export default function Header({
    initialCategories = [],
    initialLogoUrl = null
}: {
    initialCategories?: any[],
    initialLogoUrl?: string | null
}) {
    const pathname = usePathname();
    // Use props as initial state, or just use them directly if strict server-driven
    const [categories] = useState<any[]>(initialCategories);
    const [logoUrl] = useState<string | null>(initialLogoUrl);

    // No client-side fetching needed for these anymore to avoid CORS/RLS issues on public connection
    // useEffect(() => { ... }, []);

    // Do not render Header on admin pages
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container mx-auto px-4 md:px-6">

                {/* Top Row: Brand & Main Actions */}
                <div className="flex h-16 items-center justify-between border-b border-gray-100 relative">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Sakada Services Logo" className="h-10 w-auto object-contain rounded-md" />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                                    S
                                </div>
                            )}
                            <span className="text-2xl font-black tracking-tighter text-gray-900">
                                SAKADA SERVICES
                            </span>
                        </Link>
                    </div>

                    {/* Centered Slogan */}
                    <span className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                        Your one stop shop for online services
                    </span>

                    <div className="flex items-center gap-6">
                        <Link href="/about" className="hidden md:block text-sm font-bold text-gray-900 hover:text-primary transition-colors">
                            ABOUT US
                        </Link>
                        <button className="md:hidden p-2 text-gray-600">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Category Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 mask-gradient">
                    <Link
                        href="/"
                        className={`text-[13px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap border ${pathname === '/'
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'text-gray-500 hover:text-primary hover:bg-gray-50 border-transparent'
                            }`}
                    >
                        All Services
                    </Link>
                    {categories.map((cat) => {
                        const isActive = pathname === `/services/${cat.slug}`;
                        return (
                            <Link
                                key={cat.id}
                                href={`/services/${cat.slug}`}
                                className={`text-[13px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap border ${isActive
                                    ? 'bg-primary text-white border-primary shadow-md shadow-violet-200'
                                    : 'text-gray-500 hover:text-primary hover:bg-violet-50 border-transparent'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
