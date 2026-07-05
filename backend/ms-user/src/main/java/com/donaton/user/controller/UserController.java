package com.donaton.user.controller;

import com.donaton.user.dto.UserAuthResponse;
import com.donaton.user.dto.UserCreateRequest;
import com.donaton.user.dto.UserResponse;
import com.donaton.user.dto.UserUpdateRequest;
import com.donaton.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.boot.model.source.spi.IdentifierSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @Operation(
            summary = "Crear usuario",
            description = "Registra un nuevo usuario en el sistema"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Usuario creado correctamente"
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create (
            @Valid
            @RequestBody UserCreateRequest request
    ) {
        return service.create(request);
    }

    @Operation(
            summary = "Listar usuarios",
            description = "Obtiene todos los usuarios registrados"
    )
    @GetMapping
    public List<UserResponse> findAll() {
        return service.findAll();
    }

    @Operation(
            summary = "Buscar usuario",
            description = "Busca un usuario mediante su ID"
    )
    @GetMapping("/{id}")
    public UserResponse findById(
            @PathVariable Long id
    ) {
        return service.findById(id);
    }

    @Operation(
            summary = "Actualizar usuario",
            description = "Actualiza información del usuario"
    )
    @PutMapping("/{id}")
    public UserResponse update(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request
            ) {
        return service.update(id, request);
    }

    @Operation(
            summary = "Eliminar usuario",
            description = "Elimina un usuario existente"
    )
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {
        service.delete(id);
    }

    @Operation(
            summary = "Buscar datos para autenticación",
            description = "Endpoint utilizado por BFF/Auth para validar credenciales"
    )
    @GetMapping("/auth/{email}")
    public UserAuthResponse findAuth(
            @PathVariable String email
    ) {
        return service.findAuthByEmail(email);
    }
}
