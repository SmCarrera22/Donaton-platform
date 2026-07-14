import DonationItem from "@/components/donations/DonationItem";
import type { Donation } from "@/types/donation";

type Props = {
    donations: Donation[];
};

export default function DonationList({ donations }: Props) {
    if (donations.length === 0) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-700">
                Todavía no tienes donaciones registradas.
            </section>
        );
    }

    return (
        <section className="space-y-4">
            {donations.map((donation) => (
                <DonationItem
                    key={donation.id}
                    donation={donation}
                />
            ))}
        </section>
    );
}