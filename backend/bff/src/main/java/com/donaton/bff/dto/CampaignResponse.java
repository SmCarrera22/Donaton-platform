package com.donaton.bff.dto;

import java.time.LocalDateTime;

public record CampaignResponse (
    Long id,
    String title,
    String description,
    Integer goalAmount,
    Integer collectedAmount,
    String status,
    LocalDateTime createdAt,
    LocalDateTime endDate
) {}