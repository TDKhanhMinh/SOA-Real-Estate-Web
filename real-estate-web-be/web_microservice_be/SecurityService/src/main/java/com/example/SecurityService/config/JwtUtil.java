package com.example.SecurityService.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "12345678901234567890123456789012";

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String generateToken(String username) {
        long EXPIRATION = 1000 * 60 * 60;
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