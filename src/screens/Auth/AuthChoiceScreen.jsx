import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AuthChoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const selectedPurpose = route.params?.userType;

  const handleGoogleLogin = () => {
    // Google 로그인 구현
  };

  const handleAppleLogin = () => {
    // Apple 로그인 구현
  };

  const handleEmailSignUp = () => {
    navigation.navigate('EmailSignUp', { selectedPurpose });
  };

  const handleEmailLogin = () => {
    navigation.navigate('EmailLogin');
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* 로고 섹션 */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/obooni_clock.png')}
            style={styles.logoIcon}
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>FIVLO</Text>
            <Text style={styles.logoSubText}>5 FLOW</Text>
          </View>
        </View>
      </View>

      {/* 중앙 설명 텍스트 */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>짧은 몰입이 긴 변화를 만든다.</Text>
        <Text style={styles.descriptionSubText}>삶을 바꾸는 집중 루틴 플랫폼</Text>
      </View>

      {/* 버튼 컨테이너 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleButtonText}>Google로 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={handleAppleLogin}
        >
          <Text style={styles.appleButtonText}>Apple로 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={handleEmailSignUp}
        >
          <Text style={styles.emailButtonText}>이메일로 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={handleEmailLogin}
        >
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.textDark,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: FontSizes.xlarge || 28,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  logoSubText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 60,
  },
  descriptionText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionSubText: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  googleButton: {
    backgroundColor: Colors.buttonPrimary,
  },
  googleButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.white,
  },
  appleButton: {
    backgroundColor: Colors.buttonSecondary,
  },
  appleButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.white,
  },
  emailButton: {
    backgroundColor: Colors.white,
  },
  emailButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
});

export default AuthChoiceScreen;