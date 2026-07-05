package com.donaton.donation.controller;

import com.donaton.donation.dto.DonationRequest;
import com.donaton.donation.dto.DonationResponse;
import com.donaton.donation.service.DonationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService service;

    @Operation(
            summary = "Crear donación",
            description = "Registra una nueva donación en el sistema"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Donación creada correctamente"
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DonationResponse create(
            @Valid
            @RequestBody DonationRequest request
    ) {

        return service.create(request);
    }

    @Operation(
            summary = "Listar donaciones",
            description = "Obtiene todas las donaciones registradas"
    )
    @GetMapping
    public List<DonationResponse> findAll() {

        return service.findAll();
    }

    @Operation(
            summary = "Buscar donación",
            description = "Obtiene una donación por ID"
    )
    @GetMapping("/{id}")
    public DonationResponse findById(
            @PathVariable Long id
    ) {
        return service.findById(id);
    }

    @Operation(
            summary = "Actualizar donación",
            description = "Actualiza información de una donación"
    )
    @PutMapping("/{id}")
    public DonationResponse update(
            @PathVariable Long id,
            @Valid
            @RequestBody DonationRequest request
    ) {
        return service.update(id, request);
    }

    @Operation(
            summary = "Eliminar donación",
            description = "Elimina una donación existente"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Donación eliminada correctamente"
    )
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {
        service.delete(id);
    }
}