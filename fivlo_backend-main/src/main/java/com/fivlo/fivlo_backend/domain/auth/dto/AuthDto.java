package com.fivlo.fivlo_backend.domain.auth.dto;

import com.fivlo.fivlo_backend.domain.auth.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDto {

    @Data
    public static class SignUpRequest {
        @NotBlank(message = "이메일은 필수입니다")
        @Email(message = "올바른 이메일 형식이 아닙니다")
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다")
        private String password;

        @NotBlank(message = "사용자 이름은 필수입니다")
        private String username;

        private String purpose;
    }

    @Data
    public static class SignInRequest {
        @NotBlank(message = "이메일은 필수입니다")
        @Email(message = "올바른 이메일 형식이 아닙니다")
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다")
        private String password;
    }

    @Data
    public static class SocialLoginRequest {
        @NotBlank(message = "토큰은 필수입니다")
        private String token;
        
        @NotBlank(message = "제공자는 필수입니다")
        private User.AuthProvider provider;
    }

    @Data
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private UserDto user;

        @Data
        public static class UserDto {
            private Long id;
            private String email;
            private String username;
            private String purpose;
            private User.AuthProvider authProvider;
        }
    }
}
