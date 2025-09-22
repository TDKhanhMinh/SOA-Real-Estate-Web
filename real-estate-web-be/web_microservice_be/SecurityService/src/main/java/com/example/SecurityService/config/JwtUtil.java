package com.example.SecurityService.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }
    public String generateToken(String username) {
        long EXPIRATION = 1000 * 60 * 60 * 24 * 7;
        return Jwts.builder()
                .subject(username)
                .issuedAt(new java.util.Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }
    private Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
    }
    public String extractUsername(String token) {
        return getClaims(token).getPayload().getSubject();
    }

    public boolean validateToken (String token){
            try {
                getClaims(token);
                return true;
            } catch (Exception e) {
                return false;
            }
        }


}