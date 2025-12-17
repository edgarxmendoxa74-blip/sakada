"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Trash2, CreditCard, Layers, Image as ImageIcon, FileText, Upload, RefreshCw, QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/storage";
import {
    getSiteSettings,
    saveSiteSettings,
    getPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    type PaymentMethod
} from "@/lib/settings";

export default function SettingsPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);

    // Categories State
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [newCategory, setNewCategory] = useState("");

    // Payment Options State
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [paymentForm, setPaymentForm] = useState({
        name: "",
        accountNumber: "",
        qrCode: "" as string | null,
        qrFile: null as File | null
    });

    // Site Identity State
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // About Us State

    // About Us State
    const [aboutUsContent, setAboutUsContent] = useState("");

    // Fetch Categories
    const fetchCategories = async () => {
        setLoadingCategories(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (data) setCategories(data);
        setLoadingCategories(false);
    };

    // Fetch Site Settings & Payment Methods
    const fetchSettings = async () => {
        setIsLoadingSettings(true);

        // Load Settings (Logo, About)
        const settings = await getSiteSettings();
        if (settings) {
            setAboutUsContent(settings.about_us_content || "");
            setLogoPreview(settings.logo_url || null);
        }

        // Load Payment Methods
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);

        setIsLoadingSettings(false);
    };

    useEffect(() => {
        const auth = localStorage.getItem("sakada_admin");
        if (!auth) {
            router.push("/admin");
        } else {
            setIsAuthenticated(true);
            fetchCategories();
            fetchSettings();
        }
    }, [router]);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            const slug = newCategory.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const { error } = await supabase
                .from('categories')
                .insert([{ name: newCategory, slug }]);

            if (!error) {
                setNewCategory("");
                fetchCategories();
            } else {
                alert("Error adding category. It might already exist.");
            }
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm("Delete this category?")) {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (!error) fetchCategories();
        }
    };

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentForm.name.trim()) {
            let finalQrUrl = paymentForm.qrCode;

            if (paymentForm.qrFile) {
                const { url, error } = await uploadFile(paymentForm.qrFile, 'uploads', 'qr-codes');
                if (error) {
                    alert("Failed to upload QR code. Please ensure 'uploads' bucket exists in Supabase.");
                    console.error(error);
                    return;
                }
                finalQrUrl = url;
            }

            const newMethod: PaymentMethod = {
                name: paymentForm.name,
                account_number: paymentForm.accountNumber,
                qr_code_url: finalQrUrl
            };

            const { data, error } = await addPaymentMethod(newMethod);
            if (!error) {
                setPaymentForm({ name: "", accountNumber: "", qrCode: null, qrFile: null });
                // Refresh list
                const updated = await getPaymentMethods();
                setPaymentMethods(updated);
            } else {
                alert("Failed to add payment method.");
            }
        }
    };

    const handleDeletePayment = async (id: string) => {
        if (confirm("Delete this payment method?")) {
            const { error } = await deletePaymentMethod(id);
            if (!error) {
                setPaymentMethods(paymentMethods.filter(p => p.id !== id));
            } else {
                alert("Failed to delete.");
            }
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (now 5MB is fine for storage)
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large. Please keep under 5MB.");
                return;
            }

            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveLogo = async () => {
        if (!logoPreview && !logoFile) return;

        let finalLogoUrl = logoPreview;

        if (logoFile) {
            const { url, error } = await uploadFile(logoFile, 'uploads', 'site-assets');
            if (error) {
                alert("Failed to upload logo. Please ensure 'uploads' bucket exists and is public.");
                console.error(error);
                return;
            }
            finalLogoUrl = url;
        }

        const { error } = await saveSiteSettings({ logo_url: finalLogoUrl });
        if (!error) {
            alert("Logo saved successfully!");
            setLogoFile(null);
        }
        else alert("Failed to save logo.");
    };

    const handleSaveAboutUs = async () => {
        const { error } = await saveSiteSettings({ about_us_content: aboutUsContent });
        if (!error) alert("About Us content saved successfully!");
        else alert("Failed to save content.");
    };

    const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 2MB limit for QR
            if (file.size > 2 * 1024 * 1024) {
                alert("File too large. Please choose an image under 2MB.");
                return;
            }
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentForm(prev => ({ ...prev, qrCode: reader.result as string, qrFile: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                        {isLoadingSettings && (
                            <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                <RefreshCw className="animate-spin h-4 w-4" /> Loading Data...
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Site Identity & Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Logo Manager */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                                        <ImageIcon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Site Logo</h3>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-gray-400 font-bold">SAKADA</span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="cursor-pointer bg-white border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 mb-2">
                                            <Upload className="h-4 w-4" />
                                            Upload New Logo
                                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                        </label>
                                        <p className="text-xs text-gray-400 mb-2">Recommended size: 512x512 (Max 5MB)</p>
                                        <button
                                            onClick={handleSaveLogo}
                                            className="text-xs text-primary font-bold hover:underline"
                                        >
                                            Save Logo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* About Us Editor */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-orange-100 text-orange-700 rounded-lg">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">About Us Content</h3>
                                </div>
                                <textarea
                                    className="w-full h-32 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                    value={aboutUsContent}
                                    onChange={(e) => setAboutUsContent(e.target.value)}
                                    placeholder="Enter your About Us description here..."
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleSaveAboutUs}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Existing Settings */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Categories Management */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-violet-100 text-primary rounded-lg">
                                        <Layers className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Service Categories</h3>
                                </div>

                                <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        placeholder="New Category Name..."
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                    <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                                        Add
                                    </button>
                                </form>

                                {loadingCategories ? (
                                    <div className="flex justify-center p-4"><RefreshCw className="animate-spin h-4 w-4" /></div>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {categories.map(cat => (
                                            <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="font-medium text-gray-700">{cat.name}</span>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {categories.length === 0 && <p className="text-sm text-gray-400 text-center">No categories yet.</p>}
                                    </div>
                                )}
                            </div>

                            {/* Payment Options Management */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Payment Options</h3>
                                </div>

                                <form onSubmit={handleAddPayment} className="space-y-4 mb-6 border-b pb-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Method Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. GCash used by..."
                                            className="w-full border rounded-lg px-3 py-2 text-sm"
                                            value={paymentForm.name}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Account Number / Cellphone</label>
                                        <input
                                            type="text"
                                            placeholder="0917 123 4567"
                                            className="w-full border rounded-lg px-3 py-2 text-sm"
                                            value={paymentForm.accountNumber}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">QR Code (Optional)</label>
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 bg-gray-100 rounded border border-dashed flex items-center justify-center overflow-hidden">
                                                {paymentForm.qrCode ? (
                                                    <img src={paymentForm.qrCode} className="w-full h-full object-cover" />
                                                ) : <QrCode className="h-4 w-4 text-gray-400" />}
                                            </div>
                                            <label className="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded font-medium transition-colors">
                                                Upload QR
                                                <input type="file" className="hidden" accept="image/*" onChange={handleQrUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center justify-center gap-2">
                                        <Plus className="h-4 w-4" /> Add Payment Method
                                    </button>
                                </form>

                                <div className="space-y-3">
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <div className="h-10 w-10 bg-white rounded border flex items-center justify-center flex-shrink-0">
                                                    {method.qr_code_url ? (
                                                        <img src={method.qr_code_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900">{method.name}</h4>
                                                    <p className="text-xs text-gray-600 font-mono">{method.account_number}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => method.id && handleDeletePayment(method.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {paymentMethods.length === 0 && <p className="text-sm text-gray-400 text-center">No payment methods added.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
