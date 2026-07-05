import { ReactNode } from "react";

type PublicHeroProps = {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
};

export default function PublicHero({
                                       title,
                                       description,
                                       icon,
                                       children,
                                   }: PublicHeroProps) {
    return (
        <section className="relative bg-blue-600 px-6 py-16 text-white">

            <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start">

                <div className="max-w-2xl pt-2 lg:w-1/2">

                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        {icon}
                    </div>

                    <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                        {title}
                    </h1>

                    <p className="mt-5 max-w-xl text-lg opacity-95">
                        {description}
                    </p>

                </div>

                <div className="lg:w-1/2">
                    {children}
                </div>

            </div>

        </section>
    );
}