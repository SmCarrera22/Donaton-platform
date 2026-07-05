package com.donaton.campaign.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CampaignRequest(

        @NotBlank
        String title,

        @NotBlank
        String description,

        @NotNull
        Integer goalAmount,

        LocalDateTime endDate
) {
}
