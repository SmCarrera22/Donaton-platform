type StatsCardProps = {
    title: string;
    value: string | number;
    description?: string;
};

export default function StatsCard({
                                      title,
                                      value,
                                      description,
                                  }: StatsCardProps) {
    return (
        <article className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
                {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-sky-700">
                {value}
            </p>

            {description && (
                <p className="mt-2 text-sm text-slate-600">
                    {description}
                </p>
            )}
        </article>
    );
}