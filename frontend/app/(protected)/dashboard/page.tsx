"use client";

import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import StatisticsGrid from "@/components/dashboard/StatisticsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
    const {
        campaigns,
        donations,
        profile,
        isLoading,
        errorMessage,
        totalCampaigns,
        activeCampaigns,
        totalDonations,
        pendingDonations,
        totalDonationQuantity,
    } = useDashboard();

    if (isLoading) {
        return (
            <section className="rounded-xl border bg-white p-6 text-slate-700">
                Cargando dashboard...
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                {errorMessage}
            </section>
        );
    }

    return (
        <div className="space-y-6">
            <DashboardWelcome profile={profile} />

            <StatisticsGrid
                totalCampaigns={totalCampaigns}
                activeCampaigns={activeCampaigns}
                totalDonations={totalDonations}
                pendingDonations={pendingDonations}
                totalDonationQuantity={totalDonationQuantity}
            />

            <QuickActions />

            <RecentActivity
                campaigns={campaigns}
                donations={donations}
            />
        </div>
    );
}