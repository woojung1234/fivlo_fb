package com.fivlo.fivlo_backend.domain.auth.service;

import com.fivlo.fivlo_backend.domain.auth.entity.User;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.accessTokenExpirationMs}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refreshTokenExpirationMs}")
    private long refreshTokenExpirationMs;

    public String createAccessToken(User user) {
        return createToken(user, accessTokenExpirationMs);
    }

    public String createRefreshToken(User user) {
        return createToken(user, refreshTokenExpirationMs);
    }

    private String createToken(User user, long expirationMs) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .claim("email", user.getEmail())
                .claim("username", user.getUsername())
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (SignatureException ex) {
            // 잘못된 JWT 서명
            throw new RuntimeException("잘못된 JWT 서명");
        } catch (MalformedJwtException ex) {
            // 잘못된 JWT 토큰
            throw new RuntimeException("잘못된 JWT 토큰");
        } catch (ExpiredJwtException ex) {
            // 만료된 JWT 토큰
            throw new RuntimeException("만료된 JWT 토큰");
        } catch (UnsupportedJwtException ex) {
            // 지원되지 않는 JWT 토큰
            throw new RuntimeException("지원되지 않는 JWT 토큰");
        } catch (IllegalArgumentException ex) {
            // JWT claims string이 비어있음
            throw new RuntimeException("JWT claims string이 비어있음");
        }
    }
}
