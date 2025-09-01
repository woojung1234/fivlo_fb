package com.fivlo.fivlo_backend.domain.auth.controller;

import com.fivlo.fivlo_backend.domain.auth.dto.AuthDto;
import com.fivlo.fivlo_backend.domain.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthDto.AuthResponse> signup(
            @Valid @RequestBody AuthDto.SignUpRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthDto.AuthResponse> signin(
            @Valid @RequestBody AuthDto.SignInRequest request) {
        return ResponseEntity.ok(authService.signin(request));
    }

    @PostMapping("/social-login")
    public ResponseEntity<AuthDto.AuthResponse> socialLogin(
            @Valid @RequestBody AuthDto.SocialLoginRequest request) {
        return ResponseEntity.ok(authService.socialLogin(request));
    }

    @PatchMapping("/social-login")
    public ResponseEntity<AuthDto.AuthResponse> updateSocialLogin(
            @Valid @RequestBody AuthDto.SocialLoginRequest request) {
        return ResponseEntity.ok(authService.updateSocialLogin(request));
    }
}
