"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type Category } from "@/lib/types";

export default function Header({
    initialCategories = [],
    initialLogoUrl = null,
}: {
    initialCategories?: Category[];
    initialLogoUrl?: string | null;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close the mobile menu whenever the route changes
    useEffect(() => setMenuOpen(false), [pathname]);

    // Do not render Header on admin pages
    if (pathname?.startsWith("/admin")) return null;

    const pill = (active: boolean) =>
        `text-[13px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap border ${active
            ? "bg-brand-navy text-white border-brand-navy shadow-md shadow-blue-200"
            : "text-gray-500 hover:text-brand-orange hover:bg-orange-50 border-transparent"
        }`;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur-md">
            {/* Four-colour accent from the logo */}
            <div className="flex h-1">
                <span className="flex-1 bg-brand-navy" />
                <span className="flex-1 bg-brand-orange" />
                <span className="flex-1 bg-brand-gray" />
                <span className="flex-1 bg-brand-green" />
            </div>
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative flex h-14 items-center justify-between sm:h-16">
                    <Link href="/" className="flex min-w-0 items-center gap-2">
                        {initialLogoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={initialLogoUrl} alt="Sakada Services Logo" className="h-9 w-9 rounded-lg object-cover ring-1 ring-black/10 sm:h-10 sm:w-10" />
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-white">S</div>
                        )}
                        <span className="truncate text-lg font-black tracking-tighter text-brand-navy sm:text-2xl">
                            SAKADA<span className="text-brand-orange"> SERVICES</span>
                        </span>
                    </Link>

                    <span className="absolute left-1/2 hidden -translate-x-1/2 text-sm font-medium text-gray-500 xl:block">
                        Book trusted services, anytime
                    </span>

                    <div className="flex items-center gap-4">
                        <Link href="/about" className="hidden text-sm font-bold text-brand-navy transition-colors hover:text-brand-orange md:block">
                            ABOUT US
                        </Link>
                        <button
                            className="p-2 text-gray-600 md:hidden"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Desktop / tablet: scrolling category pills */}
                <div className="no-scrollbar hidden items-center gap-2 overflow-x-auto border-t border-gray-100 py-3 md:flex">
                    <Link href="/" className={pill(pathname === "/")}>All Services</Link>
                    {initialCategories.map((cat) => (
                        <Link key={cat.id} href={`/services/${cat.slug}`} className={pill(pathname === `/services/${cat.slug}`)}>
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile: slide-down menu */}
                {menuOpen && (
                    <nav className="max-h-[70vh] overflow-y-auto border-t border-gray-100 py-3 md:hidden">
                        <Link href="/" className="block rounded-lg px-3 py-3 text-sm font-bold text-gray-900 active:bg-gray-50">All Services</Link>
                        {initialCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/services/${cat.slug}`}
                                className={`block rounded-lg px-3 py-3 text-sm font-medium active:bg-gray-50 ${pathname === `/services/${cat.slug}` ? "bg-blue-50 text-primary" : "text-gray-700"}`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <Link href="/about" className="mt-1 block rounded-lg border-t px-3 py-3 text-sm font-bold text-gray-900 active:bg-gray-50">About Us</Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
