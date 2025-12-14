import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-white py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Sakada Services. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-gray-500">
                    <Link href="#" className="hover:text-gray-900">Privacy Policy</Link>
                    <Link href="#" className="hover:text-gray-900">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
