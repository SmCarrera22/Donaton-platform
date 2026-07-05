interface CampaignItemProps {
    title: string;
    status: string;
    amount: string;
}
export default function CampaignItem({
                                         title,
                                         status,
                                         amount
                                     }: CampaignItemProps) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Estado:
                        <span className="ml-2 font-medium text-sky-700">
                            {status}
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">
                        Recaudado
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                        {amount}
                    </p>
                </div>
            </div>
        </div>
    );
}