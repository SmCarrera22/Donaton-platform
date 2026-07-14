package com.donaton.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        SecretKey key = Keys.hmacShaKeyFor(
                "donaton-test-secret-key-minimum-32-characters"
                        .getBytes(StandardCharsets.UTF_8)
        );

        jwtService = new JwtService(key);
    }

    @Test
    void shouldGenerateToken() {
        String token = jwtService.generateToken(
                "usuario@donaton.cl",
                "USER"
        );

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertEquals(
                3,
                token.split("\\.").length
        );
    }

    @Test
    void shouldGenerateTokenContainingEmailAndRole() {
        String token = jwtService.generateToken(
                "usuario@donaton.cl",
                "ADMIN"
        );

        Claims claims =
                jwtService.validateToken(token);

        assertEquals(
                "usuario@donaton.cl",
                claims.getSubject()
        );

        assertEquals(
                "ADMIN",
                claims.get("role", String.class)
        );
    }

    @Test
    void shouldValidateGeneratedToken() {
        String token = jwtService.generateToken(
                "usuario@donaton.cl",
                "USER"
        );

        Claims claims =
                jwtService.validateToken(token);

        assertNotNull(claims);
        assertEquals(
                "usuario@donaton.cl",
                claims.getSubject()
        );
    }

    @Test
    void shouldReturnTrueForValidToken() {
        String token = jwtService.generateToken(
                "usuario@donaton.cl",
                "USER"
        );

        boolean result =
                jwtService.isValid(token);

        assertTrue(result);
    }

    @Test
    void shouldReturnFalseForMalformedToken() {
        boolean result =
                jwtService.isValid(
                        "token-incorrecto"
                );

        assertFalse(result);
    }

    @Test
    void shouldRejectTokenSignedWithDifferentKey() {
        SecretKey differentKey =
                Keys.hmacShaKeyFor(
                        "another-test-secret-key-with-32-characters"
                                .getBytes(StandardCharsets.UTF_8)
                );

        JwtService anotherJwtService =
                new JwtService(differentKey);

        String token =
                anotherJwtService.generateToken(
                        "usuario@donaton.cl",
                        "USER"
                );

        assertThrows(
                RuntimeException.class,
                () -> jwtService.validateToken(token)
        );
    }

    @Test
    void shouldThrowExceptionForMalformedToken() {
        assertThrows(
                RuntimeException.class,
                () -> jwtService.validateToken(
                        "not-a-valid-jwt"
                )
        );
    }
}