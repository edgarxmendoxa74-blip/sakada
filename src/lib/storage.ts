
import { supabase } from "./supabase";

export async function uploadFile(
    file: File,
    bucket: string,
    path: string
): Promise<{ url: string | null; error: any }> {
    try {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        // Sanitize path (remove leading/trailing slashes)
        const cleanPath = path.replace(/^\/+|\/+$/g, '');

        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${cleanPath}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            return { url: null, error: uploadError };
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { url: data.publicUrl, error: null };
    } catch (error) {
        return { url: null, error };
    }
}
