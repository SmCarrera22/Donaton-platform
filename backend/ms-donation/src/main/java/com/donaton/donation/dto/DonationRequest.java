package com.donaton.donation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonationRequest {

    @NotNull(message = "El donorId es obligatorio")
    private Long donorId;

    @NotNull(message = "El tipo de donación es obligatorio")
    private String donorType;

    @NotNull(message = "El tipo de recurso es obligatorio")
    private String resourceType;

    @NotNull(message = "La cantidad es obligatoria")
    private Integer quantity;

    @NotNull(message = "El nombre del recurso es obligatorio")
    private String resourceName;
}
