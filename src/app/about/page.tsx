import { getSiteSettings } from "@/lib/settings";

export const metadata = {
    title: "About Us | Sakada Services",
};

export default async function AboutPage() {
    const settings = await getSiteSettings();
    const content = settings?.about_us_content || "";

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">About Us</h1>

                <div className="prose prose-lg text-gray-600">
                    {content ? (
                        <p className="whitespace-pre-line">{content}</p>
                    ) : (
                        <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-500 border border-dashed">
                            <p>No about us content has been added yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
