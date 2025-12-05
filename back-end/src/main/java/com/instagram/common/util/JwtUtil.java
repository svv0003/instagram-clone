package com.instagram.common.util;

import lombok.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

/*
JWT 토큰 생성 및 검증 유틸리티
 */

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKeyString;

    // 토큰 유효 시간 (24시간) = 24 * 60 * 60 * 1000(ms)
    @Value("${jwt.expiration}")
    private long expirationTime;

    private SecretKey getSigningKey() {
        return keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    public String generageToken(int userId, String userEmail) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + expirationTime);

    }
}