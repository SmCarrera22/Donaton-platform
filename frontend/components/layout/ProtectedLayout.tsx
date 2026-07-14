"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface Props {
    children: React.ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
    const router = useRouter();

    useEffect(() => {
        const session = getSession();

        if (!session) {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <TopNavbar />

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}