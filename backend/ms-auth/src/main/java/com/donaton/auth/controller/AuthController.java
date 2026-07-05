package com.donaton.auth.controller;

import com.donaton.auth.dto.*;
import com.donaton.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody AuthLoginRequest request
    ){
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidateResponse> validate(
            @RequestHeader("Authorization")
            String authorization
    ){
        String token =
                authorization.replace(
                        "Bearer ",
                        ""
                );
        return ResponseEntity.ok(
                authService.validate(token)
        );
    }
}