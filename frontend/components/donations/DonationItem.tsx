interface DonationItemProps {
    campaignTitle: string;
    amount: string;
    status: string;
    createdAt: string;
}

export default function DonationItem({
                                         campaignTitle,
                                         amount,
                                         status,
                                         createdAt,
                                     }: DonationItemProps) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        {campaignTitle}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Fecha: {createdAt}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">
                        {amount}
                    </p>

                    <p className="mt-1 text-sm font-medium text-sky-700">
                        {status}
                    </p>
                </div>
            </div>
        </div>
    );
}