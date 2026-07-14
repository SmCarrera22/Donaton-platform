package com.donaton.auth.controller;

import com.donaton.auth.dto.AuthLoginRequest;
import com.donaton.auth.dto.LoginResponse;
import com.donaton.auth.dto.ValidateResponse;
import com.donaton.auth.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(
        name = "Autenticación",
        description = "Operaciones relacionadas con el inicio de sesión y la validación de tokens JWT"
)
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Iniciar sesión",
            description = "Valida las credenciales recibidas y genera un token JWT cuando la autenticación es correcta"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Inicio de sesión realizado correctamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de autenticación inválidos"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Credenciales incorrectas"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody AuthLoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @Operation(
            summary = "Validar token JWT",
            description = "Comprueba la validez del token JWT enviado mediante el encabezado Authorization"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Token procesado correctamente"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Token inválido, expirado o inexistente"
            )
    })
    @PostMapping("/validate")
    public ResponseEntity<ValidateResponse> validate(
            @Parameter(
                    description = "Token JWT utilizando el formato Bearer",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader("Authorization")
            String authorization
    ) {
        String token = authorization.replace(
                "Bearer ",
                ""
        );

        return ResponseEntity.ok(
                authService.validate(token)
        );
    }
}