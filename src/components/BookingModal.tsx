"use client";

import { useEffect, useState } from "react";
import { Copy, Check, MessageCircle, CreditCard, X, ChevronRight, FileText } from "lucide-react";
import { type Freelancer, formatRate } from "@/lib/types";
import { getPaymentMethods, type PaymentMethod } from "@/lib/settings";
import { supabase } from "@/lib/supabase";

interface BookingModalProps {
    freelancer: Freelancer;
    isOpen: boolean;
    onClose: () => void;
}

const EMPTY_DETAILS = { name: "", phone: "", date: "", description: "" };

export default function BookingModal({ freelancer, isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [details, setDetails] = useState(EMPTY_DETAILS);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loadingMethods, setLoadingMethods] = useState(false);

    useEffect(() => {
        if (isOpen && step === 2) {
            setLoadingMethods(true);
            getPaymentMethods().then((methods) => {
                setPaymentMethods(methods);
                setLoadingMethods(false);
            });
        }
    }, [isOpen, step]);

    // Reset when closed; lock page scroll while open
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setError("");
            return;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const today = new Date().toISOString().split("T")[0];
    const inputClass =
        "w-full border border-gray-300 rounded-xl p-3 mt-1 text-base focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none";

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard?.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleNextToPayment = () => {
        if (!details.name.trim() || !details.phone.trim() || !details.description.trim()) {
            setError("Please fill in your name, cell number and what you need.");
            return;
        }
        setError("");
        setStep(2);
    };

    // Save the booking so the admin can track it, then show the confirmation step
    const handlePaid = async () => {
        setSaving(true);
        const { error: dbError } = await supabase.from("bookings").insert([
            {
                freelancer_id: freelancer.id,
                freelancer_name: freelancer.name,
                category: freelancer.role,
                client_name: details.name.trim(),
                client_phone: details.phone.trim(),
                description: details.description.trim(),
                preferred_date: details.date || null,
                amount: freelancer.rate,
                status: "pending",
            },
        ]);
        if (dbError) console.error("Could not save booking (run supabase/schema.sql?):", dbError);
        setSaving(false);
        setStep(3);
    };

    const handleMessengerRedirect = () => {
        const text =
            `Hi, I'm ${details.name}. I'd like to book ${freelancer.name} for ${freelancer.role}.\n` +
            (freelancer.bio ? `Service Details: ${freelancer.bio.replace(/\n+/g, ' ')}\n` : '') +
            `Rate: ${formatRate(freelancer.rate, freelancer.rate_unit)}\n` +
            `Preferred date: ${details.date || "Any"}\nMy Needs: ${details.description}\nContact: ${details.phone}\n\n` +
            `I have sent the payment.`;
        window.open(`https://m.me/61580883685679?text=${encodeURIComponent(text)}`, "_blank");
        setDetails(EMPTY_DETAILS);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
            <div
                className="relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 p-2 text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                </button>

                <div className="shrink-0 border-b bg-gray-50 p-5 text-center">
                    <h2 className="text-lg font-bold text-gray-900">
                        {step === 1 && "Booking Details"}
                        {step === 2 && "Payment Details"}
                        {step === 3 && "Booking Sent!"}
                    </h2>
                    <div className="mt-2 flex justify-center gap-1.5">
                        {[1, 2, 3].map((s) => (
                            <span key={s} className={`h-1.5 w-8 rounded-full ${s <= step ? "bg-primary" : "bg-gray-200"}`} />
                        ))}
                    </div>
                </div>

                <div className="overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Provider Header Box */}
                            <div className="flex items-center gap-3 rounded-xl bg-blue-50/70 p-3 border border-blue-100/60">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 font-bold text-primary">
                                    {freelancer.image_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={freelancer.image_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        freelancer.name.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-gray-900">{freelancer.name}</p>
                                    <p className="truncate text-xs font-semibold text-brand-orange">{freelancer.role}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="block text-sm font-black text-emerald-600">
                                        {formatRate(freelancer.rate, freelancer.rate_unit)}
                                    </span>
                                </div>
                            </div>

                            {/* Service Menu Description & Inclusions Display */}
                            {freelancer.bio && (
                                <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-3.5 shadow-xs">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-navy">
                                        <FileText className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                                        <span>Service Description & Inclusions</span>
                                    </div>
                                    <p className="whitespace-pre-line text-xs leading-relaxed text-gray-700">
                                        {freelancer.bio}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" autoComplete="name" className={inputClass} placeholder="e.g. Juan dela Cruz" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cell Number</label>
                                <input type="tel" autoComplete="tel" inputMode="tel" className={inputClass} placeholder="e.g. 0912 345 6789" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preferred Date (optional)</label>
                                <input type="date" min={today} className={inputClass} value={details.date} onChange={(e) => setDetails({ ...details, date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">What do you need?</label>
                                <textarea className={inputClass} rows={3} placeholder="Describe your exact request and address / location..." value={details.description} onChange={(e) => setDetails({ ...details, description: e.target.value })} />
                            </div>

                            {error && <p className="rounded-lg bg-red-50 p-2 text-center text-sm font-medium text-red-600">{error}</p>}

                            <button onClick={handleNextToPayment} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition-colors hover:bg-gray-800 active:scale-[.98]">
                                Next Step <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                                <p className="mb-0.5 text-xs font-semibold text-blue-900">
                                    {freelancer.name} • {freelancer.role}
                                </p>
                                <p className="mb-1 text-sm text-blue-900 font-medium">Amount to Transfer</p>
                                <p className="text-3xl font-black text-emerald-600">₱{Number(freelancer.rate).toLocaleString("en-PH")}</p>
                            </div>

                            {loadingMethods ? (
                                <div className="py-8 text-center text-sm text-gray-500">Loading payment options...</div>
                            ) : paymentMethods.length === 0 ? (
                                <div className="rounded-lg border border-dashed py-8 text-center text-gray-500">
                                    No payment methods available. Please contact admin.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-gray-900">Pay using any of these</p>
                                    {paymentMethods.map((method) => (
                                        <div key={method.id} className="rounded-xl border bg-white p-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                                    <CreditCard className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-bold text-gray-900">{method.name}</h4>
                                                    <p className="font-mono text-sm text-gray-600">{method.account_number}</p>
                                                </div>
                                                <button onClick={() => handleCopy(method.id || method.name, method.account_number)} className="p-2 text-gray-400 hover:text-primary" aria-label="Copy number">
                                                    {copiedId === (method.id || method.name) ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {method.qr_code_url && (
                                                <div className="mt-3 flex justify-center rounded-lg bg-gray-50 p-3">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={method.qr_code_url} alt="QR Code" className="h-40 w-40 object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-3 text-xs text-yellow-800">
                                        ⚠️ Please include your name ({details.name}) in the payment reference.
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="w-1/3 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-600 transition-colors hover:bg-gray-200">
                                    Back
                                </button>
                                <button onClick={handlePaid} disabled={saving} className="flex-1 rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 disabled:opacity-60">
                                    {saving ? "Saving..." : "I have sent the payment"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 py-4 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Check className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
                                <p className="mt-2 text-gray-500">Your booking was recorded. Send it to us on Messenger so we can confirm your slot.</p>
                            </div>
                            <button onClick={handleMessengerRedirect} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0084FF] py-3.5 font-bold text-white transition-colors hover:bg-[#0078e6]">
                                <MessageCircle className="h-5 w-5" />
                                Proceed to Messenger
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
