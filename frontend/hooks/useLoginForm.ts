import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { extractErrorMessage } from "@/lib/bff";
import { getSession, saveSession } from "@/lib/session";

export function useLoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [statusMessage, setStatusMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const session = getSession();

        if (session) {
            router.push("/dashboard");
        }
    }, [router]);

    const validateForm = () => {
        const nextErrors: typeof errors = {};

        if (!email.trim()) {
            nextErrors.email = "Ingresa tu correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = "Ingresa un correo con formato válido.";
        }

        if (!password.trim()) {
            nextErrors.password = "Ingresa tu contraseña.";
        }

        return nextErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrors({});
        setStatusMessage("");
        setIsSubmitted(false);

        const nextErrors = validateForm();

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setStatusMessage("Hay errores en el formulario. Revisa los campos marcados.");
            return;
        }

        try {
            const response = await authService.login({
                email: email.trim().toLowerCase(),
                password,
            });

            if (!response.ok) {
                const message = extractErrorMessage(
                    response.body,
                    `No se pudo iniciar sesión (${response.status}).`
                );

                setErrors({ email: message });
                setStatusMessage(message);
                return;
            }

            if (!response.body || typeof response.body !== "object" || !("token" in response.body)) {
                setErrors({ email: "El BFF no devolvió un token válido." });
                setStatusMessage("El BFF no devolvió un token válido.");
                return;
            }

            saveSession({
                token: response.body.token,
                email: email.trim().toLowerCase(),
                role: "USER",
            });

            setIsSubmitted(true);
            setStatusMessage("Sesión iniciada correctamente.");

            router.push("/dashboard");
        } catch {
            setStatusMessage("Hubo un error al intentar iniciar sesión.");
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        errors,
        statusMessage,
        isSubmitted,
        handleSubmit,
    };
}