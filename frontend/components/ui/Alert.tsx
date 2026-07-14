type AlertProps = {
    message: string;
    success?: boolean;
};

export default function Alert({
                                  message,
                                  success = false,
                              }: AlertProps) {

    if (!message) return null;

    return (
        <div
            className={`rounded-md border px-3 py-2 text-sm ${
                success
                    ? "border-green-300 bg-green-50 text-green-800"
                    : "border-red-300 bg-red-50 text-red-800"
            }`}
        >
            {message}
        </div>
    );
}