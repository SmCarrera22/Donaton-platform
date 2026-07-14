package com.donaton.bff.dto;

public record UserAuthData(
        String email,
        String passwordHash,
        String role
) {
}
