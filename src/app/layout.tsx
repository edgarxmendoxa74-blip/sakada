import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Using Outfit for a premium, modern store feel
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import { getSiteSettings } from "@/lib/settings";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Sakada Services | Services Booking Platform",
  description: "Book reliable freelancers for hotel, restaurant, health, and more.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side fetching
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col font-sans ${outfit.className}`}>
        <Header
          initialLogoUrl={settings?.logo_url || null}
        />
        <main className="flex-1">{children}</main>
        <Footer logoUrl={settings?.logo_url || null} />
        <ChatButton />
      </body>
    </html>
  );
}
