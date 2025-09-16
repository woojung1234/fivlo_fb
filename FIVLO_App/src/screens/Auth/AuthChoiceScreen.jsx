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
import { signInWithKakao } from '../../services/kakaoAuthServiceExpoGo';

import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const AuthChoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const selectedPurpose = route.params?.userType;
  const [isLoading, setIsLoading] = useState(false);

  const extra = Constants.expoConfig?.extra ?? {};

  // ==============================================================
  // 공통 redirectUri 설정
  // ==============================================================
  const redirectUri = 'https://auth.expo.io/@woojung1234/FIVLO_App'

  // ==============================================================
  // == Google 로그인 (최종 수정본) ==
  // ==============================================================
  // == Google 로그인 (수정본) ==
const [gRequest, gResponse, gPromptAsync] = AuthSession.useAuthRequest(
  {
    clientId: extra.googleClientIdWeb,
    redirectUri,
    scopes: ['profile', 'email'],
    prompt: AuthSession.Prompt.SelectAccount,
    responseType: AuthSession.ResponseType.Code, // ✅ 수정
  },
  Google.discovery
);

useEffect(() => {
  console.log("Google redirectUri:", redirectUri); // ✅ 디버깅용
  console.log("Google response:", gResponse);     // ✅ 디버깅용

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
  // == Kakao 로그인 (네이티브 SDK 사용) ==
  // ==============================================================

  // ==============================================================
  // == 공통 및 기타 로직 ==
  // ==============================================================
  const handleServerLogin = async (authCodeOrToken, provider) => {
    try {
      console.log('=== 서버 로그인 시작 ===');
      console.log('Provider:', provider);
      console.log('Auth Code/Token:', authCodeOrToken);
      console.log('Token 길이:', authCodeOrToken?.length);
      
      // authApi.js의 socialLogin이 (provider, code)를 인자로 받도록 수정되어 있어야 합니다.
      const result = await socialLogin(provider, authCodeOrToken);
      console.log('서버 로그인 성공:', result);
      console.log('=== 서버 로그인 완료 ===');
      
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      console.error('=== 서버 API 호출 실패 ===');
      console.error('서버 API 호출 실패:', err);
      console.error('에러 메시지:', err.message);
      console.error('에러 응답:', err.response?.data);
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

  const onKakao = async () => {
    try {
      if (!isLoading) {
        setIsLoading(true);
        console.log('=== 카카오 로그인 시작 ===');
        
        try {
          const kakaoResult = await signInWithKakao();
          console.log('카카오 로그인 결과:', kakaoResult);
          
          if (kakaoResult && kakaoResult.accessToken) {
            console.log('서버로 전송할 토큰:', kakaoResult.accessToken);
            console.log('서버 로그인 시작...');
            await handleServerLogin(kakaoResult.accessToken, 'KAKAO');
            console.log('=== 카카오 로그인 완료 ===');
          } else {
            console.log('카카오 인증 토큰을 가져오지 못했습니다.');
            Alert.alert('로그인 실패', '카카오 인증 토큰을 가져오지 못했습니다.');
            setIsLoading(false);
          }
        } catch (kakaoError) {
          console.error('카카오 로그인 중 오류:', kakaoError);
          throw kakaoError;
        }
      }
    } catch (err) {
      console.error('=== 카카오 로그인 실패 ===');
      console.error('[Kakao] 로그인 실패:', err);
      console.error('에러 메시지:', err.message);
      Alert.alert('로그인 실패', `카카오 로그인 중 오류가 발생했습니다.\n${err.message}`);
      setIsLoading(false);
    }
  };

  const onApple = async () => {
    try {
      setIsLoading(true);
      const token = await signInWithApple();
      if (token) {
        // Apple 로그인은 토큰 방식이므로 기존 로직 유지
        await handleServerLogin(token, 'APPLE');
      } else {
        Alert.alert('로그인 실패', 'Apple 인증 토큰을 가져오지 못했습니다.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('[Apple] 로그인 실패:', err);
      Alert.alert('로그인 실패', 'Apple 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const onEmailSignUp = () => navigation.navigate('EmailSignUp', { selectedPurpose });
  const onEmailLogin = () => navigation.navigate('EmailLogin');

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/images/obooni_clock.png')} style={styles.logoIcon} />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>FIVLO</Text>
            <Text style={styles.logoSubText}>5 FLOW</Text>
          </View>
        </View>
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
        <TouchableOpacity
          style={[styles.button, styles.kakaoButton, isLoading && styles.disabledButton]}
          onPress={onKakao}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#191919" /> : <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>}
        </TouchableOpacity>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { width: 40 },
  backButtonText: { fontSize: 24, color: Colors.textDark },
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 50, height: 50, marginRight: 15 },
  logoTextContainer: { alignItems: 'flex-start' },
  logoText: { fontSize: FontSizes.xlarge || 28, fontWeight: FontWeights.bold, color: Colors.textDark },
  logoSubText: { fontSize: FontSizes.medium, color: Colors.textDark },
  descriptionContainer: { alignItems: 'center', paddingHorizontal: 40, marginBottom: 60 },
  descriptionText: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, textAlign: 'center', marginBottom: 10 },
  descriptionSubText: { fontSize: FontSizes.medium, color: Colors.textSecondary, textAlign: 'center' },
  buttonContainer: { width: '100%', paddingHorizontal: 20, paddingBottom: 40 },
  button: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: Colors.border },
  googleButton: { backgroundColor: Colors.buttonPrimary },
  googleButtonText: { fontSize: FontSizes.medium, fontWeight: FontWeights.medium, color: Colors.white },
  appleButton: { backgroundColor: Colors.buttonSecondary },
  appleButtonText: { fontSize: FontSizes.medium, fontWeight: FontWeights.medium, color: Colors.white },
  kakaoButton: { backgroundColor: '#FEE500' },
  kakaoButtonText: { color: '#191919', fontSize: FontSizes.medium, fontWeight: FontWeights.medium },
  emailButton: { backgroundColor: Colors.white },
  emailButtonText: { fontSize: FontSizes.medium, fontWeight: FontWeights.medium, color: Colors.textDark },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginLinkText: { fontSize: FontSizes.medium, color: Colors.textDark },
  disabledButton: { opacity: 0.6 },
});

export default AuthChoiceScreen;