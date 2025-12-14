import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Using Outfit for a premium, modern store feel
import "./globals.css";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/settings";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sakada Services | Services Booking Platform",
  description: "Book reliable freelancers for hotel, restaurant, health, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side fetching
  const { data: categories } = await supabase.from('categories').select('*').order('name');
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col font-sans ${outfit.className}`}>
        <Header
          initialCategories={categories || []}
          initialLogoUrl={settings?.logo_url || null}
        />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
