package com.donaton.auth.dto;

public record AuthLoginRequest(
        String email,
        String password,
        String passwordHash,
        String role
) {
}
