package com.donaton.bff.dto;

public record UserUpdateRequest(
        String name,
        String phone,
        String address,
        String region,
        String comuna
) {
}