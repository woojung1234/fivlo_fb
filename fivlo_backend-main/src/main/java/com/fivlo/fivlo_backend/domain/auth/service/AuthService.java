package com.fivlo.fivlo_backend.domain.auth.service;

import com.fivlo.fivlo_backend.domain.auth.dto.AuthDto;
import com.fivlo.fivlo_backend.domain.auth.entity.User;
import com.fivlo.fivlo_backend.domain.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthDto.AuthResponse signup(AuthDto.SignUpRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 새 사용자 생성
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setPurpose(request.getPurpose());
        user.setAuthProvider(User.AuthProvider.LOCAL);

        User savedUser = userRepository.save(user);

        // 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(savedUser);
        String refreshToken = jwtTokenProvider.createRefreshToken(savedUser);

        return createAuthResponse(savedUser, accessToken, refreshToken);
    }

    @Transactional
    public AuthDto.AuthResponse signin(AuthDto.SignInRequest request) {
        // 사용자 찾기
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user);

        return createAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthDto.AuthResponse socialLogin(AuthDto.SocialLoginRequest request) {
        // 소셜 로그인 처리 로직
        // 실제 구현에서는 각 제공자(Google, Kakao, Apple)의 토큰 검증 로직이 필요
        User user = userRepository.findByProviderAndProviderId(
                request.getProvider(),
                request.getToken()
        ).orElseGet(() -> createSocialUser(request));

        String accessToken = jwtTokenProvider.createAccessToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user);

        return createAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthDto.AuthResponse updateSocialLogin(AuthDto.SocialLoginRequest request) {
        // 소셜 로그인 정보 업데이트 로직
        User user = userRepository.findByProviderAndProviderId(
                request.getProvider(),
                request.getToken()
        ).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        String accessToken = jwtTokenProvider.createAccessToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user);

        return createAuthResponse(user, accessToken, refreshToken);
    }

    private User createSocialUser(AuthDto.SocialLoginRequest request) {
        User user = new User();
        user.setAuthProvider(request.getProvider());
        user.setProviderId(request.getToken());
        // 소셜 로그인 제공자로부터 사용자 정보를 가져와서 설정
        // 실제 구현에서는 각 제공자의 API를 호출하여 사용자 정보를 가져와야 함
        return userRepository.save(user);
    }

    private AuthDto.AuthResponse createAuthResponse(User user, String accessToken, String refreshToken) {
        AuthDto.AuthResponse response = new AuthDto.AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);

        AuthDto.AuthResponse.UserDto userDto = new AuthDto.AuthResponse.UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setUsername(user.getUsername());
        userDto.setPurpose(user.getPurpose());
        userDto.setAuthProvider(user.getAuthProvider());

        response.setUser(userDto);
        return response;
    }
}
