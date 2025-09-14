// src/screens/OnboardingScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Button from '../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OnboardingScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartButton(true);
    }, 2000); // 2초 후 시작 버튼 표시
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    // 인증 선택 화면으로 이동
    navigation.navigate('AuthChoice');
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Image
          source={require('../../assets/images/fivlo_logo.png')}
          style={styles.logo}
        />
        
        <Image
          source={require('../../assets/images/obooni_clock.png')}
          style={styles.clockImage}
        />

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>FIVLO에 오신 것을 환영합니다!</Text>
          <Text style={styles.welcomeSubtitle}>
            짧은 몰입이 긴 변화를 만듭니다.{'\n'}
            삶을 바꾸는 집중 루틴 플랫폼
          </Text>
        </View>

        {showStartButton && (
          <View style={styles.startContainer}>
            <Button
              title="시작하기"
              onPress={handleGetStarted}
              style={styles.startButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  clockImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  welcomeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  startContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    width: '80%',
  },
});

export default OnboardingScreen;

