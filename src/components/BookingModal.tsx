"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, CreditCard, X } from "lucide-react";
import { type Freelancer } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface BookingModalProps {
    freelancer: Freelancer;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ freelancer, isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const gcashNumber = "0917 123 4567";
    const accountName = "SAKADA ADMIN";

    const handleCopy = () => {
        navigator.clipboard.writeText(gcashNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleMessengerRedirect = () => {
        // In a real app, this would be the freelancer's specific link or the page's ref
        window.open("https://m.me/sakadaservices", "_blank");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in zoom-in-95">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="bg-gray-50 p-6 border-b text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {step === 1 && "Contact Freelancer"}
                        {step === 2 && "Payment via GCash"}
                        {step === 3 && "Booking Confirmed!"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Step {step} of 3
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="h-8 w-8" />
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-6 mx-auto max-w-sm">
                                    <p className="text-xs text-gray-500 font-medium">
                                        Disclaimer: Platform for connection only. We are not the direct employer.
                                    </p>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    Please coordinate with <strong>{freelancer.name}</strong> regarding the service details and schedule.
                                </p>

                                <button
                                    onClick={handleMessengerRedirect}
                                    className="w-full flex items-center justify-center gap-2 bg-[#0084FF] text-white py-3 rounded-xl font-bold hover:bg-[#0078e6] transition-colors"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Open in Messenger
                                </button>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-center text-gray-500 mb-4">
                                    After sending your message, proceed to payment to secure your slot.
                                </p>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                                <p className="text-sm text-blue-800 mb-2">Total Amount to Transfer</p>
                                <p className="text-3xl font-bold text-blue-900">₱{freelancer.rate}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase">GCash Number</span>
                                        <p className="font-mono text-lg font-bold text-gray-900 tracking-wider">
                                            {gcashNumber}
                                        </p>
                                        <p className="text-xs text-gray-500">{accountName}</p>
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 text-gray-500 hover:text-primary transition-colors"
                                    >
                                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                    </button>
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-100">
                                    ⚠️ Please include your name and booking reference in the GCash message field.
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-primary/25"
                            >
                                I have sent the payment
                            </button>
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
                                    Your booking request has been submitted. We will verify your payment and notify you via Messenger.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
