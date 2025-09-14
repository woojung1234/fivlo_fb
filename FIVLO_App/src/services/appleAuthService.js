// src/services/appleAuthService.js

import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

// Apple 로그인 가능 여부 확인
export const isAppleSignInAvailable = () => {
  return Platform.OS === 'ios' && AppleAuthentication.isAvailableAsync();
};

// Apple 로그인 실행
export const signInWithApple = async () => {
  try {
    // Apple 로그인 가능 여부 확인
    if (!isAppleSignInAvailable()) {
      throw new Error('Apple Sign-In is not available on this device');
    }

    // Apple 로그인 요청
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // 사용자 정보 구성
    const user = {
      id: credential.user,
      email: credential.email || null,
      name: credential.fullName ? 
        `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim() : 
        null,
      firstName: credential.fullName?.givenName || null,
      lastName: credential.fullName?.familyName || null,
    };

    return {
      success: true,
      user: user,
      tokens: {
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
      },
    };
  } catch (error) {
    console.error('Apple login error:', error);
    
    if (error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'User cancelled login',
      };
    }
    
    return {
      success: false,
      error: error.message,
    };
  }
};

// Apple 로그아웃 (Apple은 서버사이드에서 처리)
export const signOutFromApple = async () => {
  try {
    // Apple 로그아웃은 주로 서버사이드에서 처리
    // 클라이언트에서는 토큰을 제거하는 것으로 충분
    return { success: true };
  } catch (error) {
    console.error('Apple logout error:', error);
    return { success: false, error: error.message };
  }
};
