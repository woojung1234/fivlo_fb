package com.fivlo.fivlo_backend.domain.user.dto;

import com.fivlo.fivlo_backend.domain.user.entity.User;

public record JoinUserResponse(String token, Long user_id, User.OnboardingType onboardingType) {
}
