export function Header() {
    return (
        <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">Donaton</h1>
                        <p className="mt-1 text-sky-100">Conectando donantes con causas reales</p>
                    </div>
                    <nav aria-label="Acciones principales">
                        <a
                            href="/register"
                            className="inline-block bg-white text-sky-700 font-semibold px-4 py-2 rounded shadow focus-visible:outline-2 focus-visible:outline-white"
                        >
                            Únete
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}