package com.donaton.user.dto;

public record UserAuthResponse(
        String email,
        String passwordHash,
        String role
) {
}
