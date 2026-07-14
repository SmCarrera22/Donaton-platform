package com.donaton.bff.controller;

import com.donaton.bff.dto.CampaignRequest;
import com.donaton.bff.dto.DonationRequest;
import com.donaton.bff.dto.LoginRequest;
import com.donaton.bff.dto.RegisterRequest;
import com.donaton.bff.dto.UserUpdateRequest;
import com.donaton.bff.service.BackendGatewayService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(
        name = "API Donaton",
        description = "Endpoints utilizados por el frontend para comunicarse con los microservicios de la plataforma"
)
public class BffController {

    private final BackendGatewayService backendGatewayService;

    public BffController(
            BackendGatewayService backendGatewayService
    ) {
        this.backendGatewayService = backendGatewayService;
    }

    @Operation(
            summary = "Registrar usuario",
            description = "Registra un nuevo usuario mediante el microservicio de usuarios"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Usuario registrado correctamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de registro inválidos"
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Correo electrónico ya registrado"
            )
    })
    @PostMapping("/register")
    public ResponseEntity<Object> register(
            @Valid
            @RequestBody RegisterRequest request
    ) {
        return backendGatewayService.registerUser(request);
    }

    @Operation(
            summary = "Iniciar sesión",
            description = "Coordina la validación del usuario y genera un token JWT mediante el microservicio de autenticación"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Inicio de sesión realizado correctamente"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Credenciales incorrectas"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @Valid
            @RequestBody LoginRequest request
    ) {
        return backendGatewayService.loginUser(request);
    }

    @Operation(
            summary = "Consultar usuario por ID",
            description = "Obtiene la información de un usuario mediante su identificador"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario encontrado correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado"
            )
    })
    @GetMapping("/users/{id}")
    public ResponseEntity<Object> getUserById(
            @Parameter(
                    description = "Identificador único del usuario",
                    example = "1"
            )
            @PathVariable Long id
    ) {
        return backendGatewayService.getUserById(id);
    }

    @Operation(
            summary = "Consultar perfil autenticado",
            description = "Obtiene la información del usuario asociado al token JWT enviado en el encabezado Authorization"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Perfil obtenido correctamente"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Token inválido o usuario no autenticado"
            )
    })
    @GetMapping("/users/me")
    public ResponseEntity<Object> getCurrentUser(
            @Parameter(
                    description = "Token JWT utilizando el formato Bearer",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader("Authorization")
            String authorization
    ) {
        return backendGatewayService.getCurrentUser(authorization);
    }

    @Operation(
            summary = "Actualizar usuario",
            description = "Actualiza los datos editables de un usuario existente"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario actualizado correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado"
            )
    })
    @PutMapping("/users/{id}")
    public ResponseEntity<Object> updateUser(
            @Parameter(
                    description = "Identificador único del usuario",
                    example = "1"
            )
            @PathVariable Long id,

            @RequestBody UserUpdateRequest request
    ) {
        return backendGatewayService.updateUser(id, request);
    }

    @Operation(
            summary = "Validar token",
            description = "Valida el token JWT mediante el microservicio de autenticación"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Token validado correctamente"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Token inválido o expirado"
            )
    })
    @PostMapping("/validate")
    public ResponseEntity<Object> validate(
            @Parameter(
                    description = "Token JWT utilizando el formato Bearer",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader("Authorization")
            String authorization
    ) {
        return backendGatewayService.validateToken(
                authorization
        );
    }

    @Operation(
            summary = "Registrar donación",
            description = "Registra una donación y la asocia automáticamente al usuario autenticado"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Donación registrada correctamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de donación inválidos"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Usuario no autenticado"
            )
    })
    @PostMapping("/donations")
    public ResponseEntity<Object> createDonation(
            @Parameter(
                    description = "Token JWT utilizando el formato Bearer",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader("Authorization")
            String authorization,

            @Valid
            @RequestBody DonationRequest request
    ) {
        return backendGatewayService.createDonation(
                request,
                authorization
        );
    }

    @Operation(
            summary = "Listar donaciones",
            description = "Obtiene todas las donaciones registradas"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Donaciones obtenidas correctamente"
    )
    @GetMapping("/donations")
    public ResponseEntity<Object> getAllDonations() {
        return backendGatewayService.getAllDonations();
    }

    @Operation(
            summary = "Consultar donación por ID",
            description = "Obtiene una donación mediante su identificador"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Donación encontrada correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Donación no encontrada"
            )
    })
    @GetMapping("/donations/{id}")
    public ResponseEntity<Object> getDonationById(
            @Parameter(
                    description = "Identificador único de la donación",
                    example = "1"
            )
            @PathVariable Long id
    ) {
        return backendGatewayService.getDonationById(id);
    }

    @Operation(
            summary = "Crear campaña",
            description = "Registra una nueva campaña mediante el microservicio de campañas"
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
    @PostMapping("/campaigns")
    public ResponseEntity<Object> createCampaign(
            @Valid
            @RequestBody CampaignRequest request
    ) {
        return backendGatewayService.createCampaign(request);
    }

    @Operation(
            summary = "Listar campañas",
            description = "Obtiene todas las campañas registradas"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Campañas obtenidas correctamente"
    )
    @GetMapping("/campaigns")
    public ResponseEntity<Object> getCampaigns() {
        return backendGatewayService.getCampaigns();
    }

    @Operation(
            summary = "Consultar campaña por ID",
            description = "Obtiene una campaña mediante su identificador"
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
    @GetMapping("/campaigns/{id}")
    public ResponseEntity<Object> getCampaignById(
            @Parameter(
                    description = "Identificador único de la campaña",
                    example = "1"
            )
            @PathVariable Long id
    ) {
        return backendGatewayService.getCampaignById(id);
    }

    @Operation(
            summary = "Actualizar campaña",
            description = "Actualiza una campaña existente mediante el microservicio de campañas"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Campaña actualizada correctamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Campaña no encontrada"
            )
    })
    @PutMapping("/campaigns/{id}")
    public ResponseEntity<Object> updateCampaign(
            @Parameter(
                    description = "Identificador único de la campaña",
                    example = "1"
            )
            @PathVariable Long id,

            @Valid
            @RequestBody CampaignRequest request
    ) {
        return backendGatewayService.updateCampaign(
                id,
                request
        );
    }

    @Operation(
            summary = "Eliminar campaña",
            description = "Elimina una campaña mediante el microservicio de campañas"
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
    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<Object> deleteCampaign(
            @Parameter(
                    description = "Identificador único de la campaña",
                    example = "1"
            )
            @PathVariable Long id
    ) {
        return backendGatewayService.deleteCampaign(id);
    }
}