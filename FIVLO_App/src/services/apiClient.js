// src/services/apiClient.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = 'https://fivlo.net/api/v1'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const publicEndpoints = [
        '/auth/signup',
        '/auth/signin', 
        '/auth/social-login', // 소셜 로그인도 인증 토큰 없이 요청
        '/auth/reissue'
      ];
      
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      );
      
      if (!isPublicEndpoint) {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn(`인증이 필요한 요청(${config.url})에 토큰이 없습니다.`);
        }
      }
    } catch (error) {
      console.error("AsyncStorage에서 토큰을 가져오는 중 오류:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ... (기존 응답 인터셉터 로직은 그대로 유지) ...
    if (error.response) {
      const { status, data, config } = error.response;
      
      if (status === 401) {
        await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
        Alert.alert('세션 만료', '다시 로그인해주세요.');
      } else if (status === 403) {
        const errorMessage = data?.message || '접근 권한이 없습니다.';
        if (config.url?.includes('/auth/')) {
          Alert.alert('인증 오류', data?.message || '이미 가입된 계정이거나, 계정 정보가 올바르지 않습니다.');
        } else {
          Alert.alert('접근 권한 없음', errorMessage);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;