"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { freelancers } from "@/data/mockData";
import { Users, LayoutGrid, Calendar, LogOut, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [freelancerList, setFreelancerList] = useState(freelancers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFreelancer, setEditingFreelancer] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        role: "Hotel Service",
        rate: "",
        rateUnit: "day",
        availability: "Available",
        location: "Manila"
    });

    useEffect(() => {
        const auth = localStorage.getItem("sakada_admin");
        if (!auth) {
            router.push("/admin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("sakada_admin");
        router.push("/admin");
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this freelancer?")) {
            setFreelancerList(freelancerList.filter(f => f.id !== id));
        }
    };

    const handleEdit = (freelancer: any) => {
        setEditingFreelancer(freelancer);
        setFormData({
            name: freelancer.name,
            role: freelancer.role,
            rate: freelancer.rate.toString(),
            rateUnit: freelancer.rateUnit,
            availability: freelancer.availability,
            location: freelancer.location
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingFreelancer(null);
        setFormData({
            name: "",
            role: "Hotel Service",
            rate: "",
            rateUnit: "day",
            availability: "Available",
            location: "Manila"
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFreelancer) {
            // Edit Logic
            setFreelancerList(freelancerList.map(f =>
                f.id === editingFreelancer.id
                    ? { ...f, ...formData, rate: Number(formData.rate) }
                    : f
            ));
        } else {
            // Add Logic
            const newFreelancer = {
                id: `f${freelancerList.length + 1}`,
                ...formData,
                rate: Number(formData.rate),
                rating: 0,
                reviewCount: 0,
                skills: ["General"]
            };
            // @ts-ignore - Mock data typing shortcut
            setFreelancerList([...freelancerList, newFreelancer]);
        }
        setIsModalOpen(false);
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">{editingFreelancer ? 'Edit Freelancer' : 'Add New Freelancer'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    <option>Hotel Service</option>
                                    <option>Housekeeping</option>
                                    <option>Tutorials</option>
                                    <option>Maintenance</option>
                                    <option>Beauty & Wellness</option>
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

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-tight">Sakada Admin</h1>
                </div>
                <nav className="p-4 space-y-2 flex-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-white font-medium">
                        <LayoutGrid className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <Users className="h-5 w-5" />
                        Freelancers
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <Calendar className="h-5 w-5" />
                        Bookings
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <Calendar className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-primary/20"
                        >
                            <Plus className="h-4 w-4" />
                            Add Freelancer
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Total Freelancers</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{freelancerList.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Active Services</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Freelancers List Table */}
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h3 className="font-bold text-gray-900">Manage Freelancers</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {freelancerList.map((f) => (
                                            <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{f.name}</td>
                                                <td className="px-6 py-4">{f.role}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${f.availability === 'Available' ? 'bg-green-100 text-green-800' :
                                                            f.availability === 'Busy' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                        {f.availability}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(f)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(f.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Bookings Table (Mock) */}
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-900">Recent Bookings</h3>
                                <Link href="#" className="text-xs font-semibold text-primary hover:text-violet-700">View All</Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Service</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">Maria Santos</td>
                                            <td className="px-6 py-4">Housekeeping</td>
                                            <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Pending</span></td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">Juan Dela Cruz</td>
                                            <td className="px-6 py-4">Plumbing</td>
                                            <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Completed</span></td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">Ana Reyes</td>
                                            <td className="px-6 py-4">Massage Therapy</td>
                                            <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Confirmed</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
