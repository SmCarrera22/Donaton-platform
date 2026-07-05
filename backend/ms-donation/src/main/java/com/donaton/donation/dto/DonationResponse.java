package com.donaton.donation.dto;

import com.donaton.donation.entity.DonationStatus;
import com.donaton.donation.entity.DonorType;
import com.donaton.donation.entity.ResourceType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class DonationResponse {

    private Long id;
    private Long donorId;
    private DonorType donorType;
    private ResourceType resourceType;
    private Integer quantity;
    private String description;
    private DonationStatus status;
    private LocalDateTime createdAt;

}
