package com.donaton.donation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long donorId;

    @Enumerated(EnumType.STRING)
    private DonorType donorType;

    @Enumerated(EnumType.STRING)
    private ResourceType resourceType;

    private Integer quantity;

    private String description;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    private LocalDateTime createdAt;
}
