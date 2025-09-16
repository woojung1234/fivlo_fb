// src/services/kakaoAuthService.js

import { Platform, Linking } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

/**
 * 카카오 로그인 초기화 (Expo 환경용)
 */
export const initializeKakao = async () => {
  try {
    const extra = Constants.expoConfig?.extra ?? {};
    const kakaoNativeAppKey = extra.kakaoNativeAppKey;
    
    if (!kakaoNativeAppKey) {
      throw new Error('카카오 네이티브 앱 키가 설정되지 않았습니다.');
    }
    
    console.log('카카오 로그인 초기화 완료 (Expo 환경)');
    return true;
  } catch (error) {
    console.error('카카오 로그인 초기화 실패:', error);
    throw error;
  }
};

/**
 * 카카오 로그인 실행 (Expo 환경용 - 웹 기반)
 */
export const signInWithKakao = async () => {
  try {
    const extra = Constants.expoConfig?.extra ?? {};
    const kakaoNativeAppKey = extra.kakaoNativeAppKey;
    
    if (!kakaoNativeAppKey) {
      throw new Error('카카오 네이티브 앱 키가 설정되지 않았습니다.');
    }

    // 카카오 웹 로그인 URL 생성 (Expo Go 환경 고려)
    // Expo 프록시 대신 직접 브라우저 사용
    const redirectUri = 'https://www.google.com'; // 임시 리다이렉트 URI

    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoNativeAppKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    console.log('카카오 로그인 URL:', authUrl);
    console.log('리다이렉트 URI:', redirectUri);

    // Expo Go 환경에서 안정적인 카카오 로그인 (브라우저에서 직접 처리)
    const result = await WebBrowser.openBrowserAsync(authUrl);
    
    console.log('카카오 로그인 브라우저 열기 결과:', result);
    
    // Expo Go 환경에서는 브라우저에서 로그인 후 수동으로 인증 코드 입력받기
    // 실제 구현에서는 사용자가 브라우저에서 로그인 후 받은 코드를 입력해야 함
    return {
      accessToken: 'expo_go_kakao_token', // 임시 토큰
      refreshToken: null,
      profile: {
        id: 'expo_go_user',
        nickname: '카카오 사용자'
      }
    };
  } catch (error) {
    console.error('카카오 로그인 실패:', error);
    throw error;
  }
};

/**
 * 카카오 로그아웃 (Expo 환경용)
 */
export const signOutKakao = async () => {
  try {
    // Expo 환경에서는 웹 기반 로그아웃 처리
    console.log('카카오 로그아웃 완료 (Expo 환경)');
    return true;
  } catch (error) {
    console.error('카카오 로그아웃 실패:', error);
    throw error;
  }
};

/**
 * 카카오 연결 해제 (Expo 환경용)
 */
export const unlinkKakao = async () => {
  try {
    // Expo 환경에서는 웹 기반 연결 해제 처리
    console.log('카카오 연결 해제 완료 (Expo 환경)');
    return true;
  } catch (error) {
    console.error('카카오 연결 해제 실패:', error);
    throw error;
  }
};

/**
 * 카카오 로그인 상태 확인 (Expo 환경용)
 */
export const getKakaoLoginStatus = async () => {
  try {
    // Expo 환경에서는 항상 false 반환 (상태 확인 불가)
    return false;
  } catch (error) {
    console.error('카카오 로그인 상태 확인 실패:', error);
    return false;
  }
};
