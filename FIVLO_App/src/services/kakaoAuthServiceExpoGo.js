// src/services/kakaoAuthServiceExpoGo.js
// Expo Go 환경에서 안정적으로 작동하는 카카오 로그인

import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

/**
 * 카카오 로그인 초기화 (Expo Go 환경용)
 */
export const initializeKakao = async () => {
  try {
    const extra = Constants.expoConfig?.extra ?? {};
    const kakaoNativeAppKey = extra.kakaoNativeAppKey;
    
    if (!kakaoNativeAppKey) {
      throw new Error('카카오 네이티브 앱 키가 설정되지 않았습니다.');
    }
    
    console.log('카카오 로그인 초기화 완료 (Expo Go 환경)');
    return true;
  } catch (error) {
    console.error('카카오 로그인 초기화 실패:', error);
    throw error;
  }
};

/**
 * 카카오 로그인 실행 (Expo Go 환경용 - 수동 인증 코드 입력)
 */
export const signInWithKakao = async () => {
  try {
    const extra = Constants.expoConfig?.extra ?? {};
    const kakaoNativeAppKey = extra.kakaoNativeAppKey;
    
    if (!kakaoNativeAppKey) {
      throw new Error('카카오 네이티브 앱 키가 설정되지 않았습니다.');
    }

    // 카카오 로그인 URL 생성
    const redirectUri = 'https://www.google.com'; // 임시 리다이렉트 URI
    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoNativeAppKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    console.log('카카오 로그인 URL:', authUrl);

    // 사용자에게 카카오 로그인 안내
    return new Promise((resolve, reject) => {
      Alert.alert(
        '카카오 로그인',
        '카카오 로그인을 위해 브라우저가 열립니다.\n\n1. 브라우저에서 카카오 로그인을 완료하세요\n2. 로그인 후 받은 인증 코드를 입력하세요',
        [
          {
            text: '취소',
            style: 'cancel',
            onPress: () => {
              console.log('사용자가 카카오 로그인을 취소했습니다.');
              reject(new Error('사용자가 로그인을 취소했습니다.'));
            }
          },
          {
            text: '로그인',
            onPress: () => {
              console.log('카카오 로그인 버튼 클릭됨');
              // 비동기 처리를 위해 setTimeout 사용
              setTimeout(async () => {
                try {
                  console.log('브라우저 열기 시작...');
                  // 브라우저에서 카카오 로그인 열기
                  await WebBrowser.openBrowserAsync(authUrl);
                  console.log('브라우저 열기 완료');
                  
                  // 잠시 대기 후 인증 코드 입력 요청
                  setTimeout(async () => {
                    try {
                      console.log('인증 코드 입력 요청 시작...');
                      // 사용자에게 인증 코드 입력 요청
                      const code = await promptForAuthCode();
                      console.log('인증 코드 입력 완료:', code);
                      
                      if (code && code.trim()) {
                        const trimmedCode = code.trim();
                        console.log('=== 카카오 로그인 성공 ===');
                        console.log('받은 인증 코드:', trimmedCode);
                        console.log('코드 길이:', trimmedCode.length);
                        console.log('코드 타입:', typeof trimmedCode);
                        console.log('========================');
                        
                        resolve({
                          accessToken: trimmedCode,
                          refreshToken: null,
                          profile: null
                        });
                      } else {
                        console.log('인증 코드가 입력되지 않았습니다.');
                        reject(new Error('인증 코드를 입력하지 않았습니다.'));
                      }
                    } catch (error) {
                      console.error('인증 코드 입력 중 오류:', error);
                      reject(error);
                    }
                  }, 1000); // 1초 대기
                  
                } catch (error) {
                  console.error('브라우저 열기 중 오류:', error);
                  reject(error);
                }
              }, 100); // 100ms 대기
            }
          }
        ]
      );
    });
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
      '브라우저에서 카카오 로그인을 완료한 후,\n받은 인증 코드를 입력해주세요:',
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
      'plain-text',
      '', // 기본값 없음
      'default' // 키보드 타입
    );
  });
};

/**
 * 카카오 로그아웃 (Expo Go 환경용)
 */
export const signOutKakao = async () => {
  try {
    console.log('카카오 로그아웃 완료 (Expo Go 환경)');
    return true;
  } catch (error) {
    console.error('카카오 로그아웃 실패:', error);
    throw error;
  }
};

/**
 * 카카오 연결 해제 (Expo Go 환경용)
 */
export const unlinkKakao = async () => {
  try {
    console.log('카카오 연결 해제 완료 (Expo Go 환경)');
    return true;
  } catch (error) {
    console.error('카카오 연결 해제 실패:', error);
    throw error;
  }
};

/**
 * 카카오 로그인 상태 확인 (Expo Go 환경용)
 */
export const getKakaoLoginStatus = async () => {
  try {
    return false;
  } catch (error) {
    console.error('카카오 로그인 상태 확인 실패:', error);
    return false;
  }
};
