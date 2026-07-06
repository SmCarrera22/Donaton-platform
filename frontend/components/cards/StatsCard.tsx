interface StatsCardProps {
    title: string;
    value: string;
    subtitle: string;
}

export default function StatsCard({
                                      title,
                                      value,
                                      subtitle,
                                  }: StatsCardProps) {
    return (
        <article className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
                {title}
            </p>

            <p className="mt-3 text-3xl font-bold text-sky-700">
                {value}
            </p>

            <p className="mt-2 text-sm font-medium text-slate-600">
                {subtitle}
            </p>
        </article>
    );
}