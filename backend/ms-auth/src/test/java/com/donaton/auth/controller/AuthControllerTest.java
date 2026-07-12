package com.donaton.auth.controller;

import com.donaton.auth.dto.AuthLoginRequest;
import com.donaton.auth.dto.LoginResponse;
import com.donaton.auth.dto.ValidateResponse;
import com.donaton.auth.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        authController =
                new AuthController(authService);
    }

    @Test
    void shouldLoginSuccessfully() {
        AuthLoginRequest request =
                new AuthLoginRequest(
                        "usuario@donaton.cl",
                        "Password123",
                        "$2a$10$encryptedPassword",
                        "USER"
                );

        LoginResponse expectedResponse =
                new LoginResponse(
                        "jwt-token"
                );

        when(authService.login(request))
                .thenReturn(expectedResponse);

        ResponseEntity<LoginResponse> response =
                authController.login(request);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                "jwt-token",
                response.getBody().token()
        );

        verify(authService).login(request);
    }

    @Test
    void shouldRemoveBearerPrefixBeforeValidatingToken() {
        ValidateResponse expectedResponse =
                new ValidateResponse(
                        true,
                        "usuario@donaton.cl",
                        "USER"
                );

        when(authService.validate("jwt-token"))
                .thenReturn(expectedResponse);

        ResponseEntity<ValidateResponse> response =
                authController.validate(
                        "Bearer jwt-token"
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());
        assertTrue(response.getBody().valid());

        assertEquals(
                "usuario@donaton.cl",
                response.getBody().email()
        );

        assertEquals(
                "USER",
                response.getBody().role()
        );

        verify(authService).validate(
                "jwt-token"
        );
    }

    @Test
    void shouldPassTokenWithoutBearerPrefix() {
        ValidateResponse expectedResponse =
                new ValidateResponse(
                        false,
                        null,
                        null
                );

        when(authService.validate("token-directo"))
                .thenReturn(expectedResponse);

        ResponseEntity<ValidateResponse> response =
                authController.validate(
                        "token-directo"
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());
        assertFalse(response.getBody().valid());

        verify(authService).validate(
                "token-directo"
        );
    }
}