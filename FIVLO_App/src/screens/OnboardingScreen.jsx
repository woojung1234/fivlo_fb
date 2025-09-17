// src/screens/OnboardingScreen.jsx

import React, {useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../styles/GlobalStyles';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      // 2초 후 PurposeSelectionScreen으로 이동
      navigation.navigate('PurposeSelection'); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[GlobalStyles.container, styles.container, { paddingTop: insets.top }]}>
      {/* 이미지에 표시된 로고 (문자 포함) */}
      <Image
        // 이미지 파일 경로는 실제 프로젝트에 맞게 확인 및 수정해주세요.
        source={require('../../assets/images/fivlo_logo.png')} 
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250, // 이미지 크기에 맞게 조절
    height: 120, // 이미지 크기에 맞게 조절
    resizeMode: 'contain',
  },
});

export default OnboardingScreen;