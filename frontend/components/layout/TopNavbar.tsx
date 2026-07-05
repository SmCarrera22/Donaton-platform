"use client";

import Link from "next/link";

type Props = {
    active?: "home" | "about" | "login" | "register";
};

export default function TopNavbar({ active }: Props) {
    const activeStyle =
        "rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm";

    const normalStyle =
        "rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-blue-600";

    return (
        <nav className="sticky top-0 z-50 border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                        D
                    </div>

                    <span className="text-xl font-bold tracking-tight text-gray-800">
                        Donaton
                    </span>
                </Link>

                <div className="flex items-center gap-8">

                    <Link
                        href="/about-us"
                        className={
                            active === "about"
                                ? activeStyle
                                : normalStyle
                        }
                    >
                        Acerca de Nosotros
                    </Link>

                    <div className="h-6 w-px bg-gray-300" />

                    <Link
                        href="/login"
                        className={
                            active === "login"
                                ? activeStyle
                                : normalStyle
                        }
                    >
                        Iniciar sesión
                    </Link>

                    <Link
                        href="/register"
                        className={
                            active === "register"
                                ? activeStyle
                                : normalStyle
                        }
                    >
                        Registrarse
                    </Link>

                </div>

            </div>
        </nav>
    );
}