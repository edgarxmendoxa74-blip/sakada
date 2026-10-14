import Link from "next/link";
import { Search, CalendarCheck, Wallet, MessageCircle, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export const metadata = {
    title: "About Us | Sakada Services",
    description: "Learn about Sakada Services and how booking works.",
};

// Always show the latest text saved from the admin Settings page
export const dynamic = "force-dynamic";

const STEPS = [
    { icon: Search, title: "Choose a service", text: "Browse the list or search for the service you need." },
    { icon: CalendarCheck, title: "Fill in your details", text: "Tell us who you are, when you need it and what the job is." },
    { icon: Wallet, title: "Send payment", text: "Pay through GCash or bank using the QR code or account number shown." },
    { icon: MessageCircle, title: "Confirm on Messenger", text: "Send your booking to us on Messenger and we'll confirm your slot." },
];

const VALUES = [
    { icon: ShieldCheck, title: "Trusted providers", text: "Every service listed is handled by people we know and manage." },
    { icon: Zap, title: "Fast & simple", text: "Book in a few taps from your phone. No accounts or long forms." },
    { icon: HeartHandshake, title: "Local & reliable", text: "Built to connect Filipinos with dependable everyday services." },
];

export default async function AboutPage() {
    const settings = await getSiteSettings();
    const content = (settings?.about_us_content || "").trim();
    const paragraphs = content ? content.split(/\n{2,}/) : [];

    return (
        <div className="bg-gray-50">
            {/* Hero */}
            <section className="bg-brand-hero text-white">
                <div className="container mx-auto px-4 py-12 text-center sm:py-20">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200">About us</p>
                    <h1 className="mx-auto mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                        Your one-stop shop for everyday services
                    </h1>
                </div>
            </section>

            <div className="container mx-auto max-w-4xl space-y-12 px-4 py-10 sm:py-14">
                {/* Story (editable in Admin → Settings) */}
                <section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
                    <h2 className="mb-4 text-xl font-black text-gray-900 sm:text-2xl">Who we are</h2>
                    {paragraphs.length > 0 ? (
                        <div className="space-y-4 text-base leading-relaxed text-gray-600">
                            {paragraphs.map((p, i) => (
                                <p key={i} className="whitespace-pre-line">{p}</p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Sakada Services connects you with reliable people for hotel, restaurant, wellness, home, tutorial and
                            other everyday services — all bookable in minutes.
                        </p>
                    )}
                </section>

                {/* Values */}
                <section>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {VALUES.map(({ icon: Icon, title, text }) => (
                            <div key={title} className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-gray-900">{title}</h3>
                                <p className="mt-1 text-sm text-gray-500">{text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section>
                    <h2 className="mb-5 text-center text-xl font-black text-gray-900 sm:text-2xl">How booking works</h2>
                    <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {STEPS.map(({ icon: Icon, title, text }, i) => (
                            <li key={title} className="flex gap-4 rounded-2xl border bg-white p-5 shadow-sm">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-gray-900">
                                        <Icon className="h-4 w-4 text-primary" /> {title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* CTA */}
                <section className="rounded-2xl bg-gray-900 p-8 text-center text-white">
                    <h2 className="text-xl font-black sm:text-2xl">Ready to book?</h2>
                    <p className="mt-1 text-sm text-gray-300">Find the right service in just a few taps.</p>
                    <Link href="/" className="mt-5 inline-block rounded-full bg-primary px-8 py-3 font-bold text-white transition-colors hover:bg-primary/90 active:scale-95">
                        Browse services
                    </Link>
                </section>
            </div>
        </div>
    );
}
