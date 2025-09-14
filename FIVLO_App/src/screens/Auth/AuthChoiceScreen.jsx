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
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: Constants.appOwnership === 'expo', // Expo Go에서는 true
    scheme: 'fivlo', // app.json의 scheme 값
  });

  // ==============================================================
  // == Google 로그인 ==
  // ==============================================================
  const [gRequest, gResponse, gPromptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: extra.googleClientIdIos,
    androidClientId: extra.googleClientIdAndroid,
    webClientId: extra.googleClientIdWeb,
    redirectUri, // ✅ 추가
  });

  useEffect(() => {
    if (gResponse) {
      setIsLoading(false);
      if (gResponse.type === 'success' && gResponse.params.id_token) {
        setIsLoading(true);
        handleServerLogin(gResponse.params.id_token, 'GOOGLE');
      } else if (gResponse.type === 'error') {
        console.error('[Google] 로그인 오류:', gResponse.error);
        Alert.alert('로그인 실패', 'Google 로그인 중 오류가 발생했습니다.');
      }
    }
  }, [gResponse]);

  // ==============================================================
  // == Kakao 로그인 ==
  // ==============================================================
  const [kRequest, kResponse, kPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: extra.kakaoRestApiKey,
      scopes: ['profile_nickname', 'account_email'],
      redirectUri, // ✅ 동일한 redirectUri 사용
      responseType: AuthSession.ResponseType.Code,
    },
    { authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize' }
  );

  useEffect(() => {
    if (kResponse) {
      setIsLoading(false);
      if (kResponse.type === 'success') {
        setIsLoading(true);
        exchangeKakaoCodeForToken(kResponse.params.code);
      } else if (kResponse.type === 'error') {
        console.error('[Kakao] 로그인 오류:', kResponse.error);
        Alert.alert('로그인 실패', '카카오 로그인 중 오류가 발생했습니다.');
      }
    }
  }, [kResponse]);

  const exchangeKakaoCodeForToken = async (code) => {
    try {
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          code,
          clientId: extra.kakaoRestApiKey,
          redirectUri,
          extraParams: { grant_type: 'authorization_code' },
        },
        { tokenEndpoint: 'https://kauth.kakao.com/oauth/token' }
      );
      await handleServerLogin(tokenResponse.accessToken, 'KAKAO');
    } catch (e) {
      console.error('[Kakao] 토큰 교환 실패:', e);
      Alert.alert('로그인 실패', '카카오 인증 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  // ==============================================================
  // == 공통 및 기타 로직 ==
  // ==============================================================
  const handleServerLogin = async (token, provider) => {
    try {
      await socialLogin(provider, token);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      console.error('서버 API 호출 실패:', err);
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

  const onKakao = () => {
    if (!isLoading && kRequest) {
      setIsLoading(true);
      kPromptAsync();
    }
  };

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
