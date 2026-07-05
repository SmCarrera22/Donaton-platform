import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService, RegisterFormData } from "@/services/authService";
import { extractErrorMessage } from "@/lib/bff";

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

const initialFormData: RegisterFormData = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    region: "",
    comuna: "",
    acceptTerms: false,
};

export function useRegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [statusMessage, setStatusMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = () => {
        const nextErrors: FormErrors = {};

        if (!formData.fullName.trim()) {
            nextErrors.fullName = "El nombre completo es obligatorio.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "El correo electrónico es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = "Ingresa un correo válido.";
        }

        if (!formData.password) {
            nextErrors.password = "La contraseña es obligatoria.";
        } else if (formData.password.length < 8) {
            nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        if (formData.confirmPassword !== formData.password) {
            nextErrors.confirmPassword = "Las contraseñas no coinciden.";
        }

        if (!formData.acceptTerms) {
            nextErrors.acceptTerms = "Debes aceptar los términos y condiciones.";
        }

        return nextErrors;
    };

    const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrors({});
        setStatusMessage("");
        setIsSubmitted(false);

        const nextErrors = validateForm();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setStatusMessage("Hay errores en el formulario. Revisa los campos marcados.");
            return;
        }

        try {
            const response = await authService.register({
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                region: formData.region.trim(),
                comuna: formData.comuna.trim(),
            });

            if (!response.ok) {
                const message = extractErrorMessage(
                    response.body,
                    `No se pudo completar el registro (${response.status}).`
                );

                setErrors({ email: message });
                setStatusMessage(message);
                return;
            }

            setIsSubmitted(true);
            setStatusMessage("Usuario registrado correctamente. Ahora inicia sesión.");

            setFormData(initialFormData);

            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch {
            setErrors({ email: "Hubo un problema al conectar con el BFF." });
            setStatusMessage("Hubo un problema al conectar con el BFF.");
        }
    };

    return {
        formData,
        errors,
        statusMessage,
        isSubmitted,
        handleChange,
        handleSubmit,
    };
}