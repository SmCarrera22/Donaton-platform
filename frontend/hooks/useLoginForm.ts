import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { extractErrorMessage } from "@/lib/bff";
import {
    findRememberedUserByEmail,
    getCurrentSessionUser,
    setCurrentSessionUser,
} from "@/lib/session";

type SessionUser = {
    fullName: string;
    email: string;
    createdAt: string;
};

export function useLoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [statusMessage, setStatusMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Protección de ruta si ya hay una sesión activa
    useEffect(() => {
        const currentSession = getCurrentSessionUser();
        if (currentSession) {
            router.push("/");
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

        const nextErrors = validateForm();
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setStatusMessage("Hay errores en el formulario. Revisa los campos marcados.");
            return;
        }

        try {
            // Consumimos el microservicio de forma limpia a través de la capa service
            const response = await authService.login({
                email: email.trim(),
                password,
            });

            if (!response.ok) {
                const fallbackMessage = `No se pudo iniciar sesión (${response.status}).`;
                const message = extractErrorMessage(response.body, fallbackMessage);
                setErrors({ email: message });
                setStatusMessage(message);
                return;
            }

            if (!response.body || typeof response.body !== "object") {
                setErrors({ email: "No se recibió una respuesta válida del BFF." });
                setStatusMessage("No se recibió una respuesta válida del BFF.");
                return;
            }

            if (!response.body.success) {
                const message = response.body.mensaje || "Correo o contraseña incorrectos.";
                setErrors({ email: message });
                setStatusMessage(message);
                return;
            }

            // Recuperación de datos del usuario recordado
            const rememberedUser = findRememberedUserByEmail(email.trim());
            const sessionUser: SessionUser = {
                fullName: rememberedUser?.fullName ?? email.trim(),
                email: email.trim(),
                createdAt: rememberedUser?.createdAt ?? new Date().toISOString(),
            };

            setCurrentSessionUser(sessionUser);
            setIsSubmitted(true);
            setStatusMessage("Sesión iniciada correctamente.");

            setTimeout(() => {
                router.push("/");
            }, 1000);
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
        handleSubmit
    };
}