package com.donaton.auth.service;

import com.donaton.auth.dto.AuthLoginRequest;
import com.donaton.auth.dto.LoginResponse;
import com.donaton.auth.dto.ValidateResponse;

import io.jsonwebtoken.Claims;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Claims claims;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                jwtService,
                passwordEncoder
        );
    }

    @Test
    void shouldLoginWhenPasswordIsValid() {
        AuthLoginRequest request = new AuthLoginRequest(
                "usuario@donaton.cl",
                "Password123",
                "$2a$10$encryptedPassword",
                "USER"
        );

        when(passwordEncoder.matches(
                request.password(),
                request.passwordHash()
        )).thenReturn(true);

        when(jwtService.generateToken(
                request.email(),
                request.role()
        )).thenReturn("jwt-token-generado");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals(
                "jwt-token-generado",
                response.token()
        );

        verify(passwordEncoder).matches(
                "Password123",
                "$2a$10$encryptedPassword"
        );

        verify(jwtService).generateToken(
                "usuario@donaton.cl",
                "USER"
        );
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsInvalid() {
        AuthLoginRequest request = new AuthLoginRequest(
                "usuario@donaton.cl",
                "password-incorrecta",
                "$2a$10$encryptedPassword",
                "USER"
        );

        when(passwordEncoder.matches(
                request.password(),
                request.passwordHash()
        )).thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login(request)
        );

        assertEquals(
                "Credenciales inválidas",
                exception.getMessage()
        );

        verify(passwordEncoder).matches(
                "password-incorrecta",
                "$2a$10$encryptedPassword"
        );

        verifyNoInteractions(jwtService);
    }

    @Test
    void shouldReturnValidResponseWhenTokenIsValid() {
        String token = "token-valido";

        when(jwtService.validateToken(token))
                .thenReturn(claims);

        when(claims.getSubject())
                .thenReturn("usuario@donaton.cl");

        when(claims.get("role", String.class))
                .thenReturn("USER");

        ValidateResponse response =
                authService.validate(token);

        assertTrue(response.valid());
        assertEquals(
                "usuario@donaton.cl",
                response.email()
        );
        assertEquals(
                "USER",
                response.role()
        );

        verify(jwtService).validateToken(token);
        verify(claims).getSubject();
        verify(claims).get("role", String.class);
    }

    @Test
    void shouldReturnInvalidResponseWhenTokenValidationFails() {
        String token = "token-invalido";

        when(jwtService.validateToken(token))
                .thenThrow(
                        new RuntimeException(
                                "Token inválido"
                        )
                );

        ValidateResponse response =
                authService.validate(token);

        assertFalse(response.valid());
        assertNull(response.email());
        assertNull(response.role());

        verify(jwtService).validateToken(token);
    }
}