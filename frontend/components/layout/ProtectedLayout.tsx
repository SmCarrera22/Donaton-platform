import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface Props {
    children: React.ReactNode;
}

export default function ProtectedLayout({
                                            children,
                                        }: Props) {
    return (
        <div className="flex min-h-screen bg-slate-100">

            <Sidebar />

            <div className="flex flex-1 flex-col">

                <TopNavbar />

                <main className="flex-1 p-8">

                    {children}

                </main>

            </div>

        </div>
    );
}