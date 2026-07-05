"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export default function MenuItem({
                                     href,
                                     icon,
                                     children,
                                 }: Props) {
    const pathname = usePathname();

    const active = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition
      ${
                active
                    ? "bg-sky-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
            }`}
        >
            {icon}
            <span>{children}</span>
        </Link>
    );
}