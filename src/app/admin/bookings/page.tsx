"use client";

import { useEffect, useState } from "react";
import { Phone, Trash2, RefreshCw, CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BOOKING_STATUSES, type Booking, type BookingStatus, formatRate } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableMissing, setTableMissing] = useState(false);
    const [filter, setFilter] = useState<"all" | BookingStatus>("all");

    const load = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
        if (error) setTableMissing(true);
        else setBookings(data || []);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const updateStatus = async (id: string, status: BookingStatus) => {
        const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
        if (error) return alert(`Failed to update: ${error.message}`);
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this booking?")) return;
        const { error } = await supabase.from("bookings").delete().eq("id", id);
        if (error) return alert(`Failed to delete: ${error.message}`);
        setBookings((prev) => prev.filter((b) => b.id !== id));
    };

    const visible = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
                <button onClick={load} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {tableMissing && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    The <code className="font-mono">bookings</code> table doesn’t exist yet. Run <code className="font-mono">supabase/schema.sql</code> in your Supabase SQL editor.
                </div>
            )}

            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
                {(["all", ...BOOKING_STATUSES] as const).map((s) => {
                    const n = s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length;
                    return (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold capitalize ${filter === s ? "border-gray-900 bg-gray-900 text-white" : "bg-white text-gray-600"}`}
                        >
                            {s} ({n})
                        </button>
                    );
                })}
            </div>

            {visible.length === 0 ? (
                <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-400">
                    {loading ? "Loading..." : "No bookings found."}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {visible.map((b) => (
                        <div key={b.id} className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate font-bold text-gray-900">{b.client_name}</p>
                                    <a href={`tel:${b.client_phone}`} className="mt-0.5 flex items-center gap-1 text-sm text-primary">
                                        <Phone className="h-3.5 w-3.5" /> {b.client_phone}
                                    </a>
                                </div>
                                <StatusBadge status={b.status} />
                            </div>

                            <div className="mt-3 space-y-1 text-sm text-gray-600">
                                <p><span className="text-gray-400">Provider:</span> <span className="font-medium text-gray-900">{b.freelancer_name}</span>{b.category && <span className="text-gray-400"> • {b.category}</span>}</p>
                                <p className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-gray-400" /> {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString() : "No preferred date"}</p>
                                {b.description && <p className="rounded-lg bg-gray-50 p-2 text-gray-600">{b.description}</p>}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3">
                                <div>
                                    <p className="font-bold text-gray-900">{formatRate(Number(b.amount || 0))}</p>
                                    <p className="text-xs text-gray-400">{new Date(b.created_at).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={b.status}
                                        onChange={(e) => updateStatus(b.id, e.target.value as BookingStatus)}
                                        className="rounded-lg border bg-white px-2 py-2 text-sm capitalize"
                                    >
                                        {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <button onClick={() => remove(b.id)} aria-label="Delete booking" className="p-2 text-gray-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
