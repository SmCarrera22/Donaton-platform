package com.donaton.auth.service;

import com.donaton.auth.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(
            AuthLoginRequest request
    ){
        boolean passwordValid =
                passwordEncoder.matches(
                        request.password(),
                        request.passwordHash()
                );
        if(!passwordValid){
            throw new RuntimeException(
                    "Credenciales inválidas"
            );
        }
        String token =
                jwtService.generateToken(
                        request.email(),
                        request.role()
                );
        return new LoginResponse(token);
    }

    public ValidateResponse validate(
            String token
    ){
        try {
            var claims =
                    jwtService.validateToken(token);
            return new ValidateResponse(
                    true,
                    claims.getSubject(),
                    claims.get("role",String.class)
            );
        } catch(Exception e){
            return new ValidateResponse(
                    false,
                    null,
                    null
            );
        }
    }
}