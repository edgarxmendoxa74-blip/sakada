"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    // Do not render Header on admin pages
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                        S
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-gray-900">
                        SAKADA
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-bold uppercase tracking-wide text-gray-900 hover:text-primary transition-colors">
                        Shop Services
                    </Link>
                    <Link href="/services" className="text-sm font-bold uppercase tracking-wide text-gray-500 hover:text-primary transition-colors">
                        Categories
                    </Link>
                    <Link href="#" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        ABOUT US
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search services..."
                            className="h-9 w-64 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button className="md:hidden p-2 text-gray-600">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
