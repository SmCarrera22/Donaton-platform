package com.donaton.bff.dto;

public record AuthLoginRequest(
        String email,
        String password,
        String passwordHash,
        String role
) {
}
