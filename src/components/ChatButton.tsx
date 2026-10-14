"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Send } from "lucide-react";

const MESSENGER_URL = "https://m.me/61580883685679";
const EMPTY = { name: "", phone: "", message: "" };

function MessengerLogo({ className, id }: { className: string; id: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <defs>
                <linearGradient id={id} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#00B2FF" />
                    <stop offset="1" stopColor="#006AFF" />
                </linearGradient>
            </defs>
            <path
                fill={`url(#${id})`}
                fillRule="evenodd"
                d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.61.94 1.13.71l1.98-.87c.17-.07.35-.09.52-.05.91.25 1.87.38 2.91.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zM5.94 14.54l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75c.21.16.5.16.7 0l3.16-2.4c.42-.32.97.18.69.63l-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.7 0l-3.16 2.4c-.42.32-.97-.18-.69-.63z"
            />
        </svg>
    );
}

// Floating Messenger button + contact form. On freelancer pages it sits above the mobile "Book Now" bar.
export default function ChatButton() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (pathname?.startsWith("/admin")) return null;

    const aboveBookBar = pathname?.startsWith("/freelancer/");
    const inputClass =
        "w-full border border-gray-300 rounded-xl p-3 mt-1 text-base focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none";

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
            setError("Please fill in your name, number and message.");
            return;
        }
        const text = `Hi, I'm ${form.name.trim()}.\n\n${form.message.trim()}\n\nContact: ${form.phone.trim()}`;
        window.open(`${MESSENGER_URL}?text=${encodeURIComponent(text)}`, "_blank");
        setForm(EMPTY);
        setError("");
        setOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Chat with us"
                className={`fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-transform active:scale-90 hover:scale-105 sm:bottom-6 sm:right-6 ${aboveBookBar ? "bottom-24" : "bottom-4"
                    }`}
            >
                <MessengerLogo id="messenger-grad-fab" className="h-9 w-9" />
            </button>

            {open && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setOpen(false)}>
                    <form
                        onSubmit={handleSend}
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-white shadow-xl sm:rounded-2xl"
                    >
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 p-2 text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-3 border-b bg-gray-50 p-5">
                            <MessengerLogo id="messenger-grad-modal" className="h-10 w-10 shrink-0" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Chat with us</h2>
                                <p className="text-xs text-gray-500">We&apos;ll reply on Messenger.</p>
                            </div>
                        </div>

                        <div className="space-y-4 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" autoComplete="name" className={inputClass} placeholder="e.g. Juan dela Cruz" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cell Number</label>
                                <input type="tel" autoComplete="tel" inputMode="tel" className={inputClass} placeholder="e.g. 0912 345 6789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea rows={4} className={inputClass} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                            </div>

                            {error && <p className="rounded-lg bg-red-50 p-2 text-center text-sm font-medium text-red-600">{error}</p>}

                            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0084FF] py-3.5 font-bold text-white transition-colors hover:bg-[#0078e6] active:scale-[.98]">
                                <Send className="h-4 w-4" /> Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
