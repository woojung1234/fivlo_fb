// src/screens/PurposeSelectionScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import CharacterImage from '../components/common/CharacterImage';
import { completeOnboarding } from '../services/authApi';

const PurposeSelectionScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const isSocialLogin = route.params?.isSocialLogin;
  const provider = route.params?.provider;
  const userInfo = route.params?.userInfo;

  const handlePurposeSelect = async (purpose) => {
    console.log('Selected purpose:', purpose);
    
    try {
      // 소셜 로그인 후 온보딩 완료인 경우
      if (isSocialLogin) {
        // 온보딩 완료 API 호출
        await completeOnboarding({
          purpose: purpose,
          provider: provider
        });
        
        // 메인 화면으로 이동
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { isPremiumUser: false } }],
        });
      } else {
        // 일반적인 경우 AuthChoice로 이동
        navigation.navigate('AuthChoice', { userType: purpose });
      }
    } catch (error) {
      console.error('온보딩 완료 실패:', error);
      Alert.alert('오류', '온보딩 완료에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title="사용 목적 선택" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CharacterImage style={styles.obooniCharacter} />

        <Text style={styles.purposeQuestion}>
          {isSocialLogin 
            ? '어떤 목적으로 FIVLO를 사용하시나요?' 
            : '어떤 목적으로 FIVLO를 사용하시나요?'
          }
        </Text>
        
        {isSocialLogin && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              {provider === 'google' ? 'Google' : 'Apple'} 로그인이 완료되었습니다!
            </Text>
            {userInfo && (
              <Text style={styles.userNameText}>
                안녕하세요, {userInfo.name || userInfo.email}님!
              </Text>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="집중력 개선"
            onPress={() => handlePurposeSelect('집중력개선')} // 백엔드 enum 값과 일치
            style={styles.purposeButton}
          />
          <Button
            title="루틴 형성"
            onPress={() => handlePurposeSelect('루틴형성')} // 백엔드 enum 값과 일치
            style={styles.purposeButton}
            primary={false}
          />
          <Button
            title="목표 관리"
            onPress={() => handlePurposeSelect('목표관리')} // 백엔드 enum 값과 일치
            style={styles.purposeButton}
            primary={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  obooniCharacter: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  purposeQuestion: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  purposeButton: {
    width: '100%',
    marginVertical: 8,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: FontWeights.medium,
  },
  userNameText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    textAlign: 'center',
    fontWeight: FontWeights.bold,
  },
});

export default PurposeSelectionScreen;
