import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface Props {
    children: React.ReactNode;
}
export default function ProtectedLayout({
                                            children
                                        }: Props) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-screen bg-gray-50">
                <TopNavbar />
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}