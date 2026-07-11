package com.donaton.campaign.controller;

import com.donaton.campaign.dto.CampaignRequest;
import com.donaton.campaign.dto.CampaignResponse;
import com.donaton.campaign.service.CampaignService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
@Tag(
        name = "Campañas",
        description = "Operaciones relacionadas con la creación, consulta, actualización y eliminación de campañas solidarias"
)
public class CampaignController {

    private final CampaignService service;

    @Operation(
            summary = "Crear campaña",
            description = "Registra una nueva campaña solidaria y la deja inicialmente en estado ACTIVA"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Campaña creada correctamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de campaña inválidos"
            )
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CampaignResponse create(
            @Valid
            @RequestBody CampaignRequest request
    ) {
        return service.create(request);
    }

    @Operation(
            summary = "Listar campañas",
            description = "Obtiene todas las campañas solidarias registradas en el sistema"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Campañas obtenidas correctamente"
    )
    @GetMapping
    public List<CampaignResponse> findAll() {
        return service.findAll();
    }

    @Operation(
            summary = "Buscar campaña por ID",
            description = "Obtiene la información de una campaña mediante su identificador"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Campaña encontrada correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Campaña no encontrada"
            )
    })
    @GetMapping("/{id}")
    public CampaignResponse findById(
            @Parameter(
                    description = "Identificador único de la campaña",
                    example = "1"
            )
            @PathVariable Long id
    ) {
        return service.findById(id);
    }

    @Operation(
            summary = "Actualizar campaña",
            description = "Actualiza los datos de una campaña existente"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Campaña actualizada correctamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de campaña inválidos"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Campaña no encontrada"
            )
    })
    @PutMapping("/{id}")
    public CampaignResponse update(
            @Parameter(
                    description = "Identificador único de la campaña",
                    example = "1"
            )
            @PathVariable Long id,

            @Valid
            @RequestBody CampaignRequest request
    ) {
        return service.update(id, request);
    }

    @Operation(
            summary = "Eliminar campaña",
            description = "Elimina una campaña existente mediante su identificador"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Campaña eliminada correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Campaña no encontrada"
            )
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @Parameter(
                    description = "Identificador único de la campaña",
                    example = "1"
            )
            @PathVariable Long id
    ) {
        service.delete(id);
    }
}