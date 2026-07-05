import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from './page';

describe('LoginPage - Pruebas de Interfaz', () => {
  it('Debería renderizar el formulario con sus campos básicos', () => {
    render(<LoginPage />);
    
    // Verificamos que los elementos existan en pantalla
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('Debería mostrar mensajes de error si se intenta enviar vacío', async () => {
    render(<LoginPage />);
    
    const botonEnviar = screen.getByRole('button', { name: /iniciar sesión/i });
    
    // Simulamos el click del usuario sin llenar nada
    fireEvent.click(botonEnviar);
    
    // Verificamos que aparezcan los mensajes de validación que pusimos en el Hook
    expect(await screen.findByText(/ingresa tu correo electrónico/i)).toBeInTheDocument();
  });
});