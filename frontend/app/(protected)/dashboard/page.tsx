import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import StatisticsGrid from "@/components/dashboard/StatisticsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
    return (
        <>
            <DashboardWelcome />
            <StatisticsGrid />
            <QuickActions />
            <RecentActivity />
        </>
    );
}