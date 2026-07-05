interface Props {
    title: string;
    value: string;
}

export default function StatsCard({
                                      title,
                                      value,
                                  }: Props) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
                {title}
            </p>
            <h2 className="mt-3 text-3xl font-bold">
                {value}
            </h2>
        </div>
    );
}