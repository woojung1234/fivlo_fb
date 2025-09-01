// src/services/authApi.js

import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 회원가입 (POST /api/v1/auth/signup)
export const register = async (profileName, email, password, userType) => {
  const response = await apiClient.post('/auth/signup', { profileName, email, password, userType });
  if (response.data.tokens) { // tokens 객체 안에 accessToken과 refreshToken이 있다고 가정
    await AsyncStorage.setItem('userToken', response.data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.data.tokens.refreshToken); // <-- 이 부분 수정: response.data.tokens.refreshToken
  }
  return response.data;
};

// 로그인 (POST /api/v1/auth/signin)
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/signin', { email, password });
  if (response.data.tokens) { // tokens 객체 안에 accessToken과 refreshToken이 있다고 가정
    await AsyncStorage.setItem('userToken', response.data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken); // <-- 이 부분 수정: response.data.tokens.refreshToken
  }
  return response.data;
};

// 1-3. 구독 정보 조회 (GET /api/users/me/subscription)
export const getSubscriptionStatus = async () => {
  const response = await apiClient.get('/users/me/subscription');
  return response.data;
};

// 1-4. 토큰 갱신 (POST /api/auth/refresh)
export const refreshAuthToken = async (refreshToken) => {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  if (response.data.tokens) {
    await AsyncStorage.setItem('userToken', response.data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken);
  }
  return response.data;
};

// 1-5. 로그아웃 (POST /api/auth/logout)
export const logout = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  try {
    await apiClient.post('/auth/logout', { refreshToken });
  } catch (error) {
    console.warn("Backend logout failed, but clearing local token anyway:", error);
  }
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('refreshToken');
};
