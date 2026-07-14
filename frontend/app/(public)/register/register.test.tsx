// app/register/register.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegisterPage from './page';

describe('RegisterPage - Pruebas de Formulario de Registro', () => {
  it('Debería renderizar todos los campos obligatorios y opcionales', () => {
    render(<RegisterPage />);
    
    // Validamos campos obligatorios
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    
    // USAMOS EXPRESIÓN EXACTA: ^ para inicio, $ para el final. Así no choca con "confirmar contraseña"
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    
    // Validamos campos opcionales
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
  });

  it('Debería fallar si las contraseñas ingresadas no coinciden', async () => {
    render(<RegisterPage />);
    
    // Aquí también usamos la expresión exacta para el input de la contraseña base
    const inputPassword = screen.getByLabelText(/^contraseña$/i); 
    const inputConfirm = screen.getByLabelText(/confirmar contraseña/i);
    const botonEnviar = screen.getByRole('button', { name: /crear cuenta/i }); // Nuestra corrección anterior del botón

    // Simulamos que el usuario escribe contraseñas distintas
    fireEvent.change(inputPassword, { target: { value: 'ClaveSuperSegura123' } });
    fireEvent.change(inputConfirm, { target: { value: 'ClaveDiferente456' } });
    
    // Enviamos el formulario
    fireEvent.click(botonEnviar);

    // Verificamos si salta la validación
    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });
});