"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, Clock, Wallet, RefreshCw, Plus, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { type Booking, type Category, type Freelancer, formatRate } from "@/lib/types";
import { uploadFile } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [bookingsReady, setBookingsReady] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [form, setForm] = useState({
        name: "", category: "", rate: "", unit: "session", location: "", availability: "Available", bio: "",
    });

    const load = async () => {
        const [f, c, b] = await Promise.all([
            supabase.from("freelancers").select("*"),
            supabase.from("categories").select("*").order("name"),
            supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        ]);
        setFreelancers(f.data || []);
        setCategories(c.data || []);
        if (b.error) setBookingsReady(false);
        else setBookings(b.data || []);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        let image_url: string | null = null;
        if (imageFile) {
            const { url, error } = await uploadFile(imageFile, "uploads", "freelancers");
            if (error) {
                alert(`Image upload failed: ${error.message || "check the uploads bucket"}`);
                setSaving(false);
                return;
            }
            image_url = url;
        }
        const { error } = await supabase.from("freelancers").insert([{
            name: form.name.trim(),
            role: form.category,
            rate: Number(form.rate) || 0,
            rate_unit: form.unit,
            availability: form.availability,
            location: form.location.trim() || "Manila",
            bio: form.bio.trim(),
            image_url,
            skills: ["General"],
        }]);
        setSaving(false);
        if (error) return alert(`Failed to add service: ${error.message}`);
        setForm({ ...form, name: "", rate: "", location: "", bio: "" });
        setImageFile(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        load();
    };

    const pending = bookings.filter((b) => b.status === "pending").length;
    const revenue = bookings
        .filter((b) => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, b) => sum + Number(b.amount || 0), 0);

    const byCategory = freelancers.reduce<Record<string, number>>((acc, f) => {
        acc[f.role] = (acc[f.role] || 0) + 1;
        return acc;
    }, {});

    const stats = [
        { label: "Services", value: freelancers.length, icon: Users, color: "bg-blue-100 text-blue-800" },
        { label: "Available Now", value: freelancers.filter((f) => f.availability === "Available").length, icon: CheckCircle2, color: "bg-blue-100 text-blue-700" },
        { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "bg-green-100 text-green-700" },
        { label: "Pending", value: pending, icon: Clock, color: "bg-amber-100 text-amber-700" },
    ];

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                {loading && <RefreshCw className="h-5 w-5 animate-spin text-primary" />}
            </div>

            {!bookingsReady && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    The <code className="font-mono">bookings</code> table doesn’t exist yet. Run <code className="font-mono">supabase/schema.sql</code> in your Supabase SQL editor to start tracking bookings.
                </div>
            )}

            <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
                        <div className={`mb-3 inline-flex rounded-lg p-2 ${color}`}><Icon className="h-5 w-5" /></div>
                        <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
                        <p className="text-xs font-medium text-gray-500 sm:text-sm">{label}</p>
                    </div>
                ))}
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm sm:p-5">
                <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700"><Wallet className="h-6 w-6" /></div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Confirmed &amp; completed bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRate(revenue)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b p-4">
                        <h3 className="font-bold text-gray-900">Recent bookings</h3>
                        <Link href="/admin/bookings" className="text-sm font-semibold text-primary hover:underline">View all</Link>
                    </div>
                    {bookings.length === 0 ? (
                        <p className="p-8 text-center text-sm text-gray-400">No bookings yet.</p>
                    ) : (
                        <ul className="divide-y">
                            {bookings.slice(0, 6).map((b) => (
                                <li key={b.id} className="flex items-center justify-between gap-3 p-4">
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-gray-900">{b.client_name}</p>
                                        <p className="truncate text-xs text-gray-500">{b.freelancer_name} • {new Date(b.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <StatusBadge status={b.status} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <form onSubmit={handleAddService} className="space-y-3 rounded-xl border bg-white p-4 shadow-sm sm:p-5">
                    <h3 className="flex items-center gap-2 font-bold text-gray-900"><Plus className="h-4 w-4 text-primary" /> Add Service</h3>
                    <input required className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Service / provider name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <select required className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        <option value="">Select category...</option>
                        {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="flex gap-2">
                        <input required type="number" min="0" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Rate (₱)" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
                        <select className="w-28 shrink-0 rounded-lg border border-gray-300 px-2 py-2.5 text-base" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                            <option value="session">/session</option>
                            <option value="hr">/hr</option>
                            <option value="day">/day</option>
                        </select>
                    </div>
                    <input className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Location (default: Manila)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
                        <option>Available</option>
                        <option>Busy</option>
                        <option>Offline</option>
                    </select>
                    <textarea rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Description" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                    <label className="block cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50">
                        {imageFile ? imageFile.name : "Upload photo (optional, max 2MB)"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f && f.size > 2 * 1024 * 1024) return alert("Image must be under 2MB.");
                            setImageFile(f || null);
                        }} />
                    </label>
                    {categories.length === 0 && <p className="text-xs text-amber-600">No categories yet — add some in Settings first.</p>}
                    <button type="submit" disabled={saving || categories.length === 0} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                        {saving ? "Saving..." : saved ? "Added ✓" : "Add Service"}
                    </button>
                </form>
            </div>
        </div>
    );
}
