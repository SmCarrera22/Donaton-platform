type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit";
    onClick?: () => void;
    className?: string;
};

export default function Button({
                                   children,
                                   type = "button",
                                   onClick,
                                   className = "",
                               }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 ${className}`}
        >
            {children}
        </button>
    );
}