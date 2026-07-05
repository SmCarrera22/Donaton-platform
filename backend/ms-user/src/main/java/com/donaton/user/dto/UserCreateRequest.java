package com.donaton.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserCreateRequest(
        @NotBlank
        String name,

        @NotBlank
        @Email
        String email,

        @NotBlank
        String password,

        String phone,

        String address,

        String region,

        String comuna
) {}