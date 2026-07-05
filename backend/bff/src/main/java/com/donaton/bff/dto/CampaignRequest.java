package com.donaton.bff.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CampaignRequest {
    private String title;
    private String description;
    private Integer goalAmount;
    private LocalDateTime endDate;
}
