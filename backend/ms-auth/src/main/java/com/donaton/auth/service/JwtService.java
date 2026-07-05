package com.donaton.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final SecretKey key;

    public String generateToken(
            String email,
            String role
    ){
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .signWith(key)
                .compact();
    }

    public Claims validateToken(
            String token
    ){
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(
            String token
    ){
        try {
            validateToken(token);
            return true;
        } catch(Exception e){
            return false;
        }
    }
}