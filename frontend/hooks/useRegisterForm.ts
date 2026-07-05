import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService, RegisterFormData } from "@/services/authService";
import { extractErrorMessage } from "@/lib/bff";
import { rememberUser, setCurrentSessionUser } from "@/lib/session";

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

        // 1. Nombre Completo: Obligatorio
        if (!formData.fullName || formData.fullName.trim() === "") {
            nextErrors.fullName = "El nombre completo es obligatorio.";
        }

        // 2. Correo Electrónico: Obligatorio y válido
        if (!formData.email || formData.email.trim() === "") {
            nextErrors.email = "El correo electrónico es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = "Ingresa un correo válido (ej: usuario@dominio.com).";
        }

        // 3. Contraseña: Obligatoria (mínimo 8 caracteres)
        if (!formData.password) {
            nextErrors.password = "La contraseña es obligatoria.";
        } else if (formData.password.length < 8) {
            nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        // 4. Confirmación de Contraseña
        if (formData.confirmPassword !== formData.password) {
            nextErrors.confirmPassword = "Las contraseñas no coinciden.";
        }
        
        // 5. Términos legales
        if (!formData.acceptTerms) {
            nextErrors.acceptTerms = "Debes aceptar los términos y condiciones.";
        }

        return nextErrors;
    };

    const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validateForm();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setIsSubmitted(false);
            setStatusMessage("Hay errores en el formulario. Revisa los campos marcados.");
            return;
        }

        const userToStore = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            createdAt: new Date().toISOString(),
        };

        try {
        // Invocamos al servicio pasándole los campos requeridos por el backend
        const response = await authService.register({
            fullName: userToStore.fullName,
            email: userToStore.email,
            password: formData.password,
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            region: formData.region.trim(),
            comuna: formData.comuna.trim(),
        });

        if (!response.ok) {
            const fallbackMessage = `No se pudo completar el registro (${response.status}).`;
            const message = extractErrorMessage(response.body, fallbackMessage);
            setErrors({ email: message });
            setIsSubmitted(false);
            setStatusMessage(message);
            return;
        }

        rememberUser(userToStore);
        setCurrentSessionUser(userToStore);
        } catch {
            setErrors({ email: "Hubo un problema al conectar con el BFF." });
            setIsSubmitted(false);
            setStatusMessage("Hubo un problema al conectar con el BFF.");
            return;
        }

        setIsSubmitted(true);
        setErrors({});
        setFormData(initialFormData);

        setTimeout(() => {
            router.push("/");
        }, 1000);
    };

    return { formData, errors, statusMessage, isSubmitted, handleChange, handleSubmit };
}