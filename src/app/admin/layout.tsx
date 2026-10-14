"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authed, setAuthed] = useState(false);
    const isLogin = pathname === "/admin";

    useEffect(() => {
        if (isLogin) return;
        if (localStorage.getItem("sakada_admin")) setAuthed(true);
        else router.replace("/admin");
    }, [isLogin, router]);

    // The login page renders without the dashboard chrome
    if (isLogin) return <>{children}</>;
    if (!authed) return null;
    return <AdminShell>{children}</AdminShell>;
}
