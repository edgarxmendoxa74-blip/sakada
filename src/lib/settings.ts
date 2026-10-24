
import { supabase } from "./supabase";

export interface SiteSettings {
    id?: number;
    about_us_content: string;
    logo_url: string | null;
}

export interface PaymentMethod {
    id?: string;
    name: string;
    account_number: string;
    qr_code_url: string | null;
}

// Ensure the settings row exists
const ensureSettingsExist = async () => {
    const { data } = await supabase.from('site_settings').select('id').single();
    if (!data) {
        // Try to insert only if no data found
        const { error } = await supabase.from('site_settings').insert([{ id: 1, about_us_content: '', logo_url: null }]);
        if (error) console.error("Auto-creation of settings failed:", error);
    }
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase.from('site_settings').select('*').single();

    if (error) {
        // Table does not exist
        if (error.code === '42P01') {
            console.warn("Supabase Error: 'site_settings' table not found. Please run the schema.sql.");
            return null;
        }
        // Row not found (expected on fresh install), try to create it
        if (error.code === 'PGRST116') {
            await ensureSettingsExist();
            return { id: 1, about_us_content: '', logo_url: null };
        }

        console.error("Error fetching settings:", error.message);
        return null;
    }
    return data;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>) {
    // Upsert using ID 1
    const { error } = await supabase.from('site_settings').upsert({ id: 1, ...settings });
    if (error) {
        console.error("Error saving settings:", error);
    } else if (typeof window !== "undefined") {
        if (settings.logo_url !== undefined) {
            if (settings.logo_url) {
                localStorage.setItem("sakada_logo_url", settings.logo_url);
            } else {
                localStorage.removeItem("sakada_logo_url");
            }
            window.dispatchEvent(new CustomEvent("sakada:logo-updated", { detail: settings.logo_url }));
        }
    }
    return { error };
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data, error } = await supabase.from('payment_methods').select('*').order('created_at', { ascending: true });
    if (error) {
        if (error.code === '42P01') {
            console.warn("Supabase Error: 'payment_methods' table not found.");
            return [];
        }
        console.error("Error fetching payment methods:", error);
        return [];
    }
    return data || [];
}

export async function addPaymentMethod(method: PaymentMethod) {
    const { data, error } = await supabase.from('payment_methods').insert([method]).select();
    if (error) console.error("Error adding payment method:", error);
    return { data, error };
}

export async function deletePaymentMethod(id: string) {
    const { error } = await supabase.from('payment_methods').delete().eq('id', id);
    if (error) console.error("Error deleting payment method:", error);
    return { error };
}
