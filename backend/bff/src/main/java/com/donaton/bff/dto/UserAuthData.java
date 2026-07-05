package com.donaton.bff.dto;

public record UserAuthData(
        String email,
        String password,
        String role
) {
}
