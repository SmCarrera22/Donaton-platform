interface FeatureCardProps {
    title: string;
    description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
    return (
        <article className="bg-white p-5 rounded shadow-sm focus-within:ring-2 focus-within:ring-sky-600">
            <h4 className="font-semibold">{title}</h4>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
        </article>
    );
}