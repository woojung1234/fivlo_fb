package com.fivlo.fivlo_backend.domain.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)  // 소셜 로그인의 경우 비밀번호가 없을 수 있음
    private String password;

    @Column(name = "purpose")
    private String purpose;  // 사용 목적

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider;  // 인증 제공자 (LOCAL, GOOGLE, KAKAO, APPLE)

    @Column(name = "provider_id")
    private String providerId;  // 소셜 로그인 제공자의 ID

    public enum AuthProvider {
        LOCAL,
        GOOGLE,
        KAKAO,
        APPLE
    }
}
