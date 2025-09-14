// src/services/authApi.js

import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 회원가입
 */
export const signup = async (signupData) => {
  const response = await apiClient.post('/auth/signup', signupData);
  if (response.data.tokens) {
    await AsyncStorage.setItem('userToken', response.data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken);
  }
  return response.data;
};

/**
 * 로그인
 */
export const signin = async (email, password) => {
  const response = await apiClient.post('/auth/signin', { email, password });
  if (response.data.tokens) {
    await AsyncStorage.setItem('userToken', response.data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken);
  }
  return response.data;
};

/**
 * 소셜 로그인 (Google, Apple, Kakao 공통)
 * @param {string} provider - 'GOOGLE', 'APPLE', 'KAKAO'
 * @param {string} token - 각 소셜 플랫폼에서 발급받은 토큰
 */
export const socialLogin = async (provider, token) => {
  // apiClient를 사용하면 baseURL이 자동으로 적용되고, 공개 엔드포인트라 토큰도 자동으로 첨부되지 않습니다.
  const response = await apiClient.post('/auth/social-login', {
    provider: provider.toUpperCase(),
    token: token, // 키 이름을 'token'으로 통일하여 모든 소셜 로그인 처리
  });

  if (response.data.tokens) {
    await AsyncStorage.setItem('userToken', response.data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken);
  }
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken });
    }
  } catch (error) {
    console.warn("백엔드 로그아웃 실패, 로컬 토큰만 삭제합니다.", error);
  }
  await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
};

// ... (getUserInfo 등 나머지 함수들은 그대로 유지) ...
export const completeOnboarding = async (onboardingData) => {
    const response = await apiClient.post('/users/onboarding', onboardingData);
    return response.data;
};
export const getUserInfo = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};
export const updateUserInfo = async (userData) => {
    const response = await apiClient.patch('/users/me', userData);
    return response.data;
};
export const reissueToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await apiClient.post('/auth/reissue', { refreshToken });
    if (response.data.tokens) {
        await AsyncStorage.setItem('userToken', response.data.tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }
    return response.data;
};