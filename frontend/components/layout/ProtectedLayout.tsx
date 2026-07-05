import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default function ProtectedLayout({
                                            children,
                                        }: ProtectedLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <TopNavbar />

                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}