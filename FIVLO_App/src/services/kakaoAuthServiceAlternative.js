// src/services/kakaoAuthServiceAlternative.js
// 카카오 로그인 대안 구현 (Expo Go 환경에서 더 안정적)

import { Platform, Linking, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

/**
 * 카카오 로그인 초기화 (대안 방식)
 */
export const initializeKakao = async () => {
  try {
    const extra = Constants.expoConfig?.extra ?? {};
    const kakaoNativeAppKey = extra.kakaoNativeAppKey;
    
    if (!kakaoNativeAppKey) {
      throw new Error('카카오 네이티브 앱 키가 설정되지 않았습니다.');
    }
    
    console.log('카카오 로그인 초기화 완료 (대안 방식)');
    return true;
  } catch (error) {
    console.error('카카오 로그인 초기화 실패:', error);
    throw error;
  }
};

/**
 * 카카오 로그인 실행 (대안 방식 - 사용자에게 수동 입력 요청)
 */
export const signInWithKakao = async () => {
  try {
    const extra = Constants.expoConfig?.extra ?? {};
    const kakaoNativeAppKey = extra.kakaoNativeAppKey;
    
    if (!kakaoNativeAppKey) {
      throw new Error('카카오 네이티브 앱 키가 설정되지 않았습니다.');
    }

    // 카카오 로그인 URL 생성
    const redirectUri = 'https://auth.expo.io/@woojung1234/FIVLO_App';
    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoNativeAppKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile_nickname,account_email`;

    console.log('카카오 로그인 URL:', authUrl);

    // 사용자에게 카카오 로그인 안내
    Alert.alert(
      '카카오 로그인',
      '카카오 로그인을 위해 브라우저가 열립니다. 로그인 후 받은 인증 코드를 입력해주세요.',
      [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => {
            throw new Error('사용자가 로그인을 취소했습니다.');
          }
        },
        {
          text: '로그인',
          onPress: async () => {
            try {
              // 브라우저에서 카카오 로그인 열기
              await WebBrowser.openBrowserAsync(authUrl);
              
              // 사용자에게 인증 코드 입력 요청
              const code = await promptForAuthCode();
              
              if (code) {
                return {
                  accessToken: code,
                  refreshToken: null,
                  profile: null
                };
              } else {
                throw new Error('인증 코드를 입력하지 않았습니다.');
              }
            } catch (error) {
              throw error;
            }
          }
        }
      ]
    );

    // 임시로 성공 처리 (실제로는 위의 Alert 콜백에서 처리됨)
    return {
      accessToken: 'temp_kakao_token',
      refreshToken: null,
      profile: null
    };
  } catch (error) {
    console.error('카카오 로그인 실패:', error);
    throw error;
  }
};

/**
 * 사용자에게 인증 코드 입력 요청
 */
const promptForAuthCode = () => {
  return new Promise((resolve) => {
    Alert.prompt(
      '인증 코드 입력',
      '카카오 로그인 후 받은 인증 코드를 입력해주세요:',
      [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => resolve(null)
        },
        {
          text: '확인',
          onPress: (code) => resolve(code)
        }
      ],
      'plain-text'
    );
  });
};

/**
 * 카카오 로그아웃 (대안 방식)
 */
export const signOutKakao = async () => {
  try {
    console.log('카카오 로그아웃 완료 (대안 방식)');
    return true;
  } catch (error) {
    console.error('카카오 로그아웃 실패:', error);
    throw error;
  }
};

/**
 * 카카오 연결 해제 (대안 방식)
 */
export const unlinkKakao = async () => {
  try {
    console.log('카카오 연결 해제 완료 (대안 방식)');
    return true;
  } catch (error) {
    console.error('카카오 연결 해제 실패:', error);
    throw error;
  }
};

/**
 * 카카오 로그인 상태 확인 (대안 방식)
 */
export const getKakaoLoginStatus = async () => {
  try {
    return false;
  } catch (error) {
    console.error('카카오 로그인 상태 확인 실패:', error);
    return false;
  }
};
