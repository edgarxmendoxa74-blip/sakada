"use client";

import { useEffect, useState } from "react";
import { Copy, Check, MessageCircle, CreditCard, X, ChevronRight } from "lucide-react";
import { type Freelancer } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { getPaymentMethods, type PaymentMethod } from "@/lib/settings";

interface BookingModalProps {
    freelancer: Freelancer;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ freelancer, isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [copied, setCopied] = useState(false);

    // Booking Details State
    const [bookingDetails, setBookingDetails] = useState({
        name: "",
        phone: "",
        description: ""
    });

    // Payment Methods State
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [loadingMethods, setLoadingMethods] = useState(false);

    useEffect(() => {
        if (isOpen && step === 2) {
            setLoadingMethods(true);
            getPaymentMethods().then(methods => {
                setPaymentMethods(methods);
                if (methods.length > 0) setSelectedMethod(methods[0]);
                setLoadingMethods(false);
            });
        }
    }, [isOpen, step]);

    // Reset step when closed
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setSelectedMethod(null);
            // Optional: reset form or keep it
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNextToPayment = () => {
        if (!bookingDetails.name || !bookingDetails.phone || !bookingDetails.description) {
            alert("Please fill in all details.");
            return;
        }
        setStep(2);
    };

    const handleMessengerRedirect = () => {
        // Construct message
        const text = `Hi, I'm ${bookingDetails.name}. I'd like to book ${freelancer.name} (${freelancer.role}).\n\nDetails: ${bookingDetails.description}\nContact: ${bookingDetails.phone}\n\nI have sent the payment.`;
        const encoded = encodeURIComponent(text);
        window.open(`https://m.me/61580883685679?text=${encoded}`, "_blank");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in zoom-in-95">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="bg-gray-50 p-6 border-b text-center shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        {step === 1 && "Booking Details"}
                        {step === 2 && "Payment Details"}
                        {step === 3 && "Booking Confirmed!"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Step {step} of 3
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                                    {freelancer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Booking: {freelancer.name}</p>
                                    <p className="text-xs text-gray-500">{freelancer.role} • ₱{freelancer.rate}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="e.g. Juan dela Cruz"
                                    value={bookingDetails.name}
                                    onChange={e => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cell Number</label>
                                <input
                                    type="tel"
                                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="e.g. 0912 345 6789"
                                    value={bookingDetails.phone}
                                    onChange={e => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Booking Description</label>
                                <textarea
                                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                                    rows={3}
                                    placeholder="Briefly describe what you need..."
                                    value={bookingDetails.description}
                                    onChange={e => setBookingDetails({ ...bookingDetails, description: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={handleNextToPayment}
                                className="w-full mt-2 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                Next Step <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                                <p className="text-sm text-blue-800 mb-2">Total Amount to Transfer</p>
                                <p className="text-3xl font-bold text-blue-900">₱{freelancer.rate}</p>
                            </div>

                            {loadingMethods ? (
                                <div className="py-8 text-center text-gray-500 text-sm">Loading payment options...</div>
                            ) : paymentMethods.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 border border-dashed rounded-lg">
                                    No payment methods available. Please contact admin.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-gray-900">Available Payment Methods</p>
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="border rounded-xl p-4 bg-white shadow-sm hover:border-primary transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                                    {method.qr_code_url ? (
                                                        <img src={method.qr_code_url} className="w-full h-full object-cover" />
                                                    ) : <CreditCard className="h-5 w-5 text-gray-500" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{method.name}</h4>
                                                    <p className="font-mono text-sm text-gray-600">{method.account_number}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(method.account_number)}
                                                    className="ml-auto p-2 text-gray-400 hover:text-primary"
                                                    title="Copy Number"
                                                >
                                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {method.qr_code_url && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-center">
                                                    <img src={method.qr_code_url} alt="QR Code" className="h-32 w-32 object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-100">
                                        ⚠️ Please include your name ({bookingDetails.name}) in the payment reference.
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-1/3 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-primary/25"
                                >
                                    I have sent the payment
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-6 py-4">
                            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in">
                                <Check className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
                                <p className="text-gray-500 mt-2">
                                    Click below to send your booking details to us via Messenger so we can confirm your slot.
                                </p>
                            </div>
                            <button
                                onClick={handleMessengerRedirect}
                                className="w-full flex items-center justify-center gap-2 bg-[#0084FF] text-white py-3 rounded-xl font-bold hover:bg-[#0078e6] transition-colors"
                            >
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
