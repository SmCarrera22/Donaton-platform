package com.donaton.campaign.dto;

import com.donaton.campaign.entity.CampaignStatus;

import java.time.LocalDateTime;

public record CampaignResponse(
        Long id,
        String title,
        String description,
        Integer goalAmount,
        Integer collectedAmount,
        CampaignStatus status,
        LocalDateTime createdAt,
        LocalDateTime endDate
) {
}
