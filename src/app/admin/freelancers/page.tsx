"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/storage";

export default function FreelancersPage() {
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [freelancerList, setFreelancerList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFreelancer, setEditingFreelancer] = useState<any>(null);

    // Categories State
    const [categories, setCategories] = useState<any[]>([]);

    // Form State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "", // Will be populated by first category or empty
        rate: "",
        rateUnit: "day",
        availability: "Available",
        location: "Manila",
        imageUrl: "",
        bio: ""
    });

    // 1. Fetch Freelancers and Categories from Supabase
    const fetchData = async () => {
        setLoading(true);

        // Fetch Freelancers
        const { data: freelancers, error: fError } = await supabase
            .from('freelancers')
            .select('*')
            .order('created_at', { ascending: false });

        if (freelancers) setFreelancerList(freelancers);
        if (fError) console.error("Error fetching freelancers:", fError);

        // Fetch Categories
        const { data: cats, error: cError } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (cats) {
            setCategories(cats);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Delete Freelancer
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this freelancer?")) {
            const { error } = await supabase
                .from('freelancers')
                .delete()
                .eq('id', id);

            if (!error) {
                setFreelancerList(freelancerList.filter(f => f.id !== id));
            } else {
                alert("Failed to delete.");
            }
        }
    };

    const handleEdit = (freelancer: any) => {
        setEditingFreelancer(freelancer);
        setImageFile(null);
        setFormData({
            name: freelancer.name,
            role: freelancer.role,
            rate: String(freelancer.rate ?? ""),
            rateUnit: freelancer.rate_unit || "day",
            availability: freelancer.availability,
            location: freelancer.location,
            imageUrl: freelancer.image_url || "",
            bio: freelancer.bio || ""
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingFreelancer(null);
        setImageFile(null);
        setFormData({
            name: "",
            role: categories.length > 0 ? categories[0].name : "", // Default to first category
            rate: "",
            rateUnit: "day",
            availability: "Available",
            location: "Manila",
            imageUrl: "",
            bio: ""
        });
        setIsModalOpen(true);
    };

    // 3. Submit (Add/Edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let finalImageUrl = formData.imageUrl;

        if (imageFile) {
            console.log("Uploading image...", imageFile.name);
            const { url, error } = await uploadFile(imageFile, 'uploads', 'freelancers');
            if (error) {
                alert(`Error Uploading Image: ${error.message || JSON.stringify(error)}`);
                console.error("Upload Error:", error);
                setSaving(false);
                return;
            }
            if (url) finalImageUrl = url;
            console.log("Image uploaded:", finalImageUrl);
        }

        const payload = {
            name: formData.name,
            role: formData.role || (categories.length > 0 ? categories[0].name : "General"), // Fallback if empty
            rate: Number(formData.rate) || 0,
            rate_unit: formData.rateUnit,
            availability: formData.availability,
            location: formData.location || "Manila",
            image_url: finalImageUrl,
            bio: formData.bio || "",
            skills: ["General"]
        };

        let resultError = null;

        if (editingFreelancer) {
            // Edit Logic
            const { error } = await supabase
                .from('freelancers')
                .update(payload)
                .eq('id', editingFreelancer.id);
            resultError = error;
        } else {
            // Add Logic
            const { error } = await supabase
                .from('freelancers')
                .insert([payload]);
            resultError = error;
        }

        setSaving(false);
        if (resultError) {
            alert(`Database Error: ${resultError.message}`);
            console.error("Database Error:", resultError);
        } else {
            fetchData();
            setIsModalOpen(false);
        }
    };

    const q = search.trim().toLowerCase();
    const filteredList = q
        ? freelancerList.filter((f) => [f.name, f.role, f.location].some((v) => (v || "").toLowerCase().includes(q)))
        : freelancerList;

    return (
        <div className="mx-auto max-w-6xl">
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-xl shadow-xl w-full max-w-md p-5 sm:p-6 max-h-[92dvh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingFreelancer ? 'Edit Freelancer' : 'Add New Freelancer'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="h-20 w-20 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                        {formData.imageUrl ? (
                                            <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-gray-400">No Image</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer bg-white border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                        Choose File
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // 2MB limit
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        alert("File too large. Please choose an image under 2MB.");
                                                        return;
                                                    }
                                                    setImageFile(file);
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, imageUrl: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Recommended: Square JPG/PNG, max 1MB.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    required
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category / Role</label>
                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    {categories.length === 0 && <option value="">No categories found</option>}
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Rate (₱)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border rounded-lg p-2 mt-1"
                                        value={formData.rate}
                                        onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                                    <select
                                        className="w-full border rounded-lg p-2 mt-1"
                                        value={formData.rateUnit}
                                        onChange={e => setFormData({ ...formData, rateUnit: e.target.value })}
                                    >
                                        <option value="day">/day</option>
                                        <option value="hr">/hr</option>
                                        <option value="session">/session</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Availability</label>
                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={formData.availability}
                                    onChange={e => setFormData({ ...formData, availability: e.target.value })}
                                >
                                    <option>Available</option>
                                    <option>Busy</option>
                                    <option>Offline</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Service Description & Inclusions
                                    <span className="text-xs font-normal text-gray-400 block">
                                        (Papakita sa bawat menu card at booking details modal)
                                    </span>
                                </label>
                                <textarea
                                    className="w-full border rounded-lg p-2.5 mt-1 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                    rows={3}
                                    placeholder="e.g. Waitstaff / Duties, Inclusions, coverage, or special terms..."
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Providers</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="h-4 w-4" /> Add Provider
                </button>
            </div>

            <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, category or location..."
                    className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2 bg-white rounded-xl border">
                    <RefreshCw className="animate-spin h-5 w-5" /> Loading providers...
                </div>
            ) : filteredList.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-400 bg-white rounded-xl border">No providers found.</div>
            ) : (
                <>
                    {/* Mobile: cards */}
                    <div className="space-y-3 md:hidden">
                        {filteredList.map((f) => (
                            <div key={f.id} className="bg-white rounded-xl border p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                        {f.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={f.image_url} alt={f.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold">{f.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 truncate">{f.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{f.role}</p>
                                    </div>
                                    <AvailabilityBadge value={f.availability} />
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t pt-3">
                                    <span className="font-bold text-emerald-600">₱{f.rate}/{f.rate_unit}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(f)} aria-label="Edit" className="p-2 text-gray-500 hover:text-blue-600"><Edit className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(f.id)} aria-label="Delete" className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: table */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Provider</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Rate</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredList.map((f) => (
                                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                    {f.image_url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={f.image_url} alt={f.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold">{f.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900">{f.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{f.role}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">₱{f.rate}/{f.rate_unit}</td>
                                        <td className="px-6 py-4"><AvailabilityBadge value={f.availability} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(f)} aria-label="Edit" className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => handleDelete(f.id)} aria-label="Delete" className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

function AvailabilityBadge({ value }: { value: string }) {
    const cls =
        value === "Available" ? "bg-green-100 text-green-800" :
            value === "Busy" ? "bg-amber-100 text-amber-800" :
                "bg-gray-100 text-gray-800";
    return <span className={`inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{value}</span>;
}
