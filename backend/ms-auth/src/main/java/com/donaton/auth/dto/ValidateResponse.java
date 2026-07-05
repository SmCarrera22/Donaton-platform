package com.donaton.auth.dto;

public record ValidateResponse(
        boolean valid,
        String email,
        String role
) {
}
