type InputProps = {
    label: string;
    id: string;
    type?: string;
    value: string;
    placeholder?: string;
    error?: string;
    onChange: (value: string) => void;
};

export default function Input({
                                  label,
                                  id,
                                  type = "text",
                                  value,
                                  placeholder,
                                  error,
                                  onChange,
                              }: InputProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-semibold"
            >
                {label}
            </label>

            <input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />

            {error && (
                <p className="mt-1 text-sm text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}