import { Heart } from "lucide-react";

type Props = {
    title: string;
    description: string;
};

export default function PublicHero({
                                       title,
                                       description,
                                   }: Props) {
    return (
        <div className="max-w-2xl pt-2 lg:w-1/2">

            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Heart
                    size={28}
                    className="text-yellow-400"
                    fill="currentColor"
                />
            </div>

            <h1 className="text-4xl font-extrabold md:text-5xl">
                {title}
            </h1>

            <p className="mt-5 text-lg opacity-95">
                {description}
            </p>

        </div>
    );
}