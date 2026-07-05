export default function Footer() {
    return (
        <footer className="border-t bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

                <div>
                    <h2 className="font-bold text-gray-800">
                        Donaton
                    </h2>

                    <p className="text-sm text-gray-500">
                        Conectando donantes con causas reales.
                    </p>
                </div>

                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Donaton.
                </p>

            </div>
        </footer>
    );
}