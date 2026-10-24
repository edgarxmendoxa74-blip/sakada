"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function Header({
    initialLogoUrl = null,
}: {
    initialLogoUrl?: string | null;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
    const [imageError, setImageError] = useState(false);

    // Close the mobile menu whenever the route changes
    useEffect(() => setMenuOpen(false), [pathname]);

    const fetchLatestLogo = useCallback(async () => {
        try {
            // Check local cache first for instant response
            const cached = localStorage.getItem("sakada_logo_url");
            if (cached) {
                setLogoUrl(cached);
                setImageError(false);
            }

            // Fetch live settings from Supabase
            const { data, error } = await supabase
                .from("site_settings")
                .select("logo_url")
                .eq("id", 1)
                .single();

            if (!error && data?.logo_url) {
                setLogoUrl(data.logo_url);
                setImageError(false);
                localStorage.setItem("sakada_logo_url", data.logo_url);
            }
        } catch (err) {
            console.error("Error fetching header logo:", err);
        }
    }, []);

    useEffect(() => {
        fetchLatestLogo();

        // Listen for live logo update events from settings page
        const handleLogoUpdate = (e: any) => {
            const newUrl = e.detail !== undefined ? e.detail : localStorage.getItem("sakada_logo_url");
            setLogoUrl(newUrl || null);
            setImageError(false);
        };

        window.addEventListener("sakada:logo-updated", handleLogoUpdate);
        window.addEventListener("storage", handleLogoUpdate);

        return () => {
            window.removeEventListener("sakada:logo-updated", handleLogoUpdate);
            window.removeEventListener("storage", handleLogoUpdate);
        };
    }, [fetchLatestLogo]);

    // Do not render Header on admin pages
    if (pathname?.startsWith("/admin")) return null;

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
                        {logoUrl && !imageError ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logoUrl}
                                alt="Sakada Services Logo"
                                onError={() => setImageError(true)}
                                className="h-9 w-9 rounded-lg object-cover ring-1 ring-black/10 sm:h-10 sm:w-10"
                            />
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-white sm:h-9 sm:w-9">
                                S
                            </div>
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

                {/* Mobile: slide-down menu */}
                {menuOpen && (
                    <nav className="max-h-[70vh] overflow-y-auto border-t border-gray-100 py-3 md:hidden">
                        <Link href="/" className="block rounded-lg px-3 py-3 text-sm font-bold text-gray-900 active:bg-gray-50">All Services</Link>
                        <Link href="/about" className="block rounded-lg px-3 py-3 text-sm font-bold text-gray-900 active:bg-gray-50">About Us</Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
