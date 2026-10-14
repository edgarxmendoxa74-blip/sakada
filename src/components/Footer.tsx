"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone } from "lucide-react";

// Logo palette: navy, orange, gray, green
const NAVY = "#1e3560";
const ORANGE = "#d4702f";
const GRAY = "#8a8a8a";
const GREEN = "#3b7a4a";

export default function Footer({ logoUrl = null }: { logoUrl?: string | null }) {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;

    return (
        <footer className="text-white" style={{ backgroundColor: NAVY }}>
            {/* Four-colour accent taken from the logo quadrants */}
            <div className="flex h-1.5">
                {[NAVY, ORANGE, GRAY, GREEN].map((c, i) => (
                    <span key={i} className="flex-1" style={{ backgroundColor: c, filter: i === 0 ? "brightness(1.6)" : undefined }} />
                ))}
            </div>

            <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-5 text-center md:flex-row md:justify-between md:text-left">
                <Link href="/" className="flex items-center gap-3">
                    {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt="Sakada Services Logo" className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/20" />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black" style={{ backgroundColor: ORANGE }}>S</div>
                    )}
                    <div className="text-left">
                        <span className="block text-base font-black leading-tight tracking-tighter">SAKADA SERVICES</span>
                        <span className="block text-[11px] text-blue-100/70">Your one-stop shop for online services</span>
                    </div>
                </Link>

                <address className="flex flex-col items-center gap-1.5 text-xs not-italic text-blue-100/80 md:items-start">
                    <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: ORANGE }} />
                        Pasong Tamo, Quezon City, Philippines, 1100
                    </span>
                    <a href="tel:+639564921661" className="flex items-center gap-2 transition-colors hover:text-white">
                        <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN, filter: "brightness(1.5)" }} />
                        +63 956 492 1661
                    </a>
                </address>

                <div className="flex flex-col items-center gap-1 text-xs md:items-end">
                    <Link href="/about" className="font-semibold text-blue-100 transition-colors hover:text-white">About Us</Link>
                    <p className="text-blue-100/50">© {new Date().getFullYear()} Sakada Services</p>
                </div>
            </div>
        </footer>
    );
}
