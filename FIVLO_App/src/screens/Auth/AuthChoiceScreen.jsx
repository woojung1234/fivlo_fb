// src/screens/Auth/AuthChoiceScreen.jsx

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator,
} from 'react-native';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { socialLogin } from '../../services/authApi';
import { signInWithApple } from '../../services/appleAuthService';
// 카카오 로그인 관련 import 제거
// import { signInWithKakao } from '../../services/kakaoAuthServiceExpoGo'; 

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest } from 'expo-auth-session';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const AuthChoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const selectedPurpose = route.params?.userType;
  const [isLoading, setIsLoading] = useState(false);

  const extra = Constants.expoConfig?.extra ?? {};
  
  const redirectUri = 'https://auth.expo.io/@woojung1234/FIVLO_App'

  // ==============================================================
  // == Google 로그인 로직 ==
  // ==============================================================
  const [gRequest, gResponse, gPromptAsync] = useAuthRequest(
    {
      clientId: extra.googleClientIdWeb,
      redirectUri,
      scopes: ['profile', 'email'],
      responseType: 'code',
    }
  );

  useEffect(() => {
    if (gResponse) {
      setIsLoading(false);
      if (gResponse.type === 'success' && gResponse.params.code) {
        setIsLoading(true);
        handleServerLogin(gResponse.params.code, 'GOOGLE');
      } else if (gResponse.type === 'error') {
        console.error('[Google] 로그인 오류:', gResponse.error);
        Alert.alert('로그인 실패', 'Google 로그인 중 오류가 발생했습니다.');
      }
    }
  }, [gResponse]);
  
  // ==============================================================
  // == 공통 및 기타 로직 ==
  // ==============================================================
  const handleServerLogin = async (authCodeOrToken, provider) => {
    try {
      const result = await socialLogin(provider, authCodeOrToken);
      console.log('서버 로그인 성공:', result);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      console.error('서버 API 호출 실패:', err.response?.data || err.message);
      Alert.alert('로그인 실패', '서버와 통신 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const onGoogle = () => {
    if (!isLoading && gRequest) {
      setIsLoading(true);
      gPromptAsync();
    }
  };

  // 카카오 로그인 함수 제거
  // const onKakao = async () => { ... };

  const onApple = async () => {
    try {
      setIsLoading(true);
      const token = await signInWithApple();
      if (token) {
        await handleServerLogin(token, 'APPLE');
      } else {
        Alert.alert('로그인 실패', 'Apple 인증 토큰을 가져오지 못했습니다.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('[Apple] 로그인 실패:', err);
      // Apple 로그인은 사용자가 취소할 수 있으므로, 에러 메시지를 항상 띄우지 않을 수 있습니다.
      if (err.code !== 'ERR_REQUEST_CANCELED') {
          Alert.alert('로그인 실패', 'Apple 로그인 중 오류가 발생했습니다.');
      }
      setIsLoading(false);
    }
  };

  const onEmailSignUp = () => navigation.navigate('EmailSignUp', { selectedPurpose });
  const onEmailLogin = () => navigation.navigate('EmailLogin');

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* 이미지에 맞게 뒤로가기 아이콘 텍스트 변경 */}
          <Text style={styles.backButtonText}>‹</Text> 
        </TouchableOpacity>
      </View>

      {/* 로고 섹션: 하나의 이미지로 변경 */}
      <View style={styles.logoSection}>
        <Image 
          source={require('../../../assets/images/fivlo_logo.png')} 
          style={styles.logoImage} 
        />
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>짧은 몰입이 긴 변화를 만든다.</Text>
        <Text style={styles.descriptionSubText}>삶을 바꾸는 집중 루틴 플랫폼</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton, isLoading && styles.disabledButton]}
          onPress={onGoogle}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.googleButtonText}>Google로 시작하기</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.appleButton, isLoading && styles.disabledButton]}
          onPress={onApple}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.appleButtonText}>Apple로 시작하기</Text>}
        </TouchableOpacity>
        
        {/* 카카오 로그인 버튼 제거 */}

        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={onEmailSignUp}
          disabled={isLoading}
        >
          <Text style={styles.emailButtonText}>이메일로 시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={onEmailLogin} disabled={isLoading}>
          <Text style={styles.loginLinkText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, // 좌우 패딩 조정
    paddingVertical: 15,
    width: '100%',
  },
  backButton: { 
    padding: 10,
  },
  backButtonText: { 
    fontSize: 28, // 아이콘 크기 조정
    color: Colors.textDark,
    fontWeight: 'bold',
  },
  logoSection: { 
    alignItems: 'center', 
    marginTop: 20, // 마진 조정
    marginBottom: 40,
  },
  // 기존 로고 스타일 제거 및 새로운 이미지 스타일 추가
  logoImage: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  descriptionContainer: { 
    alignItems: 'center', 
    paddingHorizontal: 40, 
    marginBottom: 60,
  },
  descriptionText: { 
    fontSize: FontSizes.medium, // 폰트 크기 조정
    fontWeight: FontWeights.bold, 
    color: Colors.textDark, 
    textAlign: 'center', 
    marginBottom: 10,
  },
  descriptionSubText: { 
    fontSize: FontSizes.small, // 폰트 크기 조정
    color: Colors.textSecondary, 
    textAlign: 'center',
  },
  buttonContainer: { 
    width: '100%', 
    paddingHorizontal: 30, // 버튼 좌우 패딩 조정
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: { 
    width: '100%', 
    paddingVertical: 16, // 버튼 높이 조정
    borderRadius: 12, // 버튼 둥글기 조정
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 15, 
    borderWidth: 1, 
  },
  googleButton: { 
    backgroundColor: '#4285F4', // Google 색상 명시
    borderColor: '#4285F4',
  },
  googleButtonText: { 
    fontSize: FontSizes.medium, 
    fontWeight: FontWeights.medium, 
    color: Colors.white,
  },
  appleButton: { 
    backgroundColor: Colors.black, // Apple 색상 명시
    borderColor: Colors.black,
  },
  appleButtonText: { 
    fontSize: FontSizes.medium, 
    fontWeight: FontWeights.medium, 
    color: Colors.white,
  },
  emailButton: { 
    backgroundColor: Colors.white,
    borderColor: Colors.border,
  },
  emailButtonText: { 
    fontSize: FontSizes.medium, 
    fontWeight: FontWeights.medium, 
    color: Colors.textDark,
  },
  loginLink: { 
    alignItems: 'center', 
    marginTop: 20,
    padding: 10,
  },
  loginLinkText: { 
    fontSize: FontSizes.medium, 
    color: Colors.textDark,
    textDecorationLine: 'underline',
  },
  disabledButton: { 
    opacity: 0.6,
  },
});

export default AuthChoiceScreen;