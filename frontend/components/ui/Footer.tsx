export function Footer() {
    return (
        <footer className="bg-white border-t mt-8">
            <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">
                <p>© {new Date().getFullYear()} Donaton. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}