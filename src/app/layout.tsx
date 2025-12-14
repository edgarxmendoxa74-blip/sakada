import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Using Outfit for a premium, modern store feel
import "./globals.css";
import Header from "@/components/Header";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sakada | Services Booking Platform",
  description: "Book reliable freelancers for hotel, restaurant, health, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col font-sans ${outfit.className}`}>
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
