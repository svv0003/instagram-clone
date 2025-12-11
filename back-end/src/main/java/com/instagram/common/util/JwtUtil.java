package com.instagram.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/*
JWT 토큰 생성 및 검증 유틸리티
JwtUtil = 디지털 학생증 발급기
secretKeyString         도장 낙인(위조 방지용)
expirationTime          유효 기간 설정(24시간 = 24 * 60 * 60 * 1000(ms))
getSigningKey()         도장 찍을 준비하는 과정
generateToken()         학생증 만들기(24시간 유효한 학생증)
getUserIdFromToken()    학생증에서 학번 읽기
getEmailFromToken()     학생증에서 이메일 읽기
validateToken           학생증 검증(API 오청 시 확인)
 */

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKeyString;     // 위조 방지 도장 낙인

    @Value("${jwt.expiration}")
    private long expirationTime;        // 24시간 유효 시간

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * JWT 토큰 생성
     * 토큰 형태는 32lk2ew4ara3sl43asd34iwl4ejf 이와 같은 형식으로 생성된다.
     */
    public String generateToken(int userId, String userEmail) {
        Date now = new Date();                                      // 현재시간
        Date validity = new Date(now.getTime() + expirationTime);   // 현재시간 기준 +24시간 유효기간 설정
        return Jwts.builder()
                .subject(String.valueOf(userId))                    // 학번
                .claim("email", userEmail)                       // 이메일
                .issuedAt(now)                                      // 발급일
                .expiration(validity)                               // 도장 만료일
                .signWith(getSigningKey())                          // 도장 낙인
                .compact();                                         // 학생증 완성!
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    public int getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Integer.parseInt(claims.getSubject());
    }

    /**
     * 토큰에서 이메일 추출
     */
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("email", String.class);
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}