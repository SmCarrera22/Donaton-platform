export default function Footer() {
    return (
        <footer className="border-t mt-auto bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 text-center text-gray-500">
                © {new Date().getFullYear()} Donaton
            </div>
        </footer>
    );
}