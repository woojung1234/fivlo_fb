// src/screens/Auth/EmailSignUpScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. devAuthApi 대신 실제 authApi에서 signup 함수를 가져옵니다.
import { signup } from '../../services/authApi';

const EmailSignUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const userType = route.params?.userType;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 닉네임 입력을 위한 상태 추가
  const [profileName, setProfileName] = useState('');

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !profileName.trim()) {
      Alert.alert('회원가입 오류', '닉네임, 이메일, 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // 2. signup 함수가 요구하는 데이터 형식에 맞춰 객체로 전달합니다.
      const signupData = {
        profileName: profileName,
        email: email,
        password: password,
        userType: userType
      };

      const response = await signup(signupData); // 실제 서버에 회원가입 요청
      console.log('회원가입 성공:', response);
      
      // 회원가입 성공 후 온보딩(목적 선택) 화면으로 이동
      navigation.navigate('PurposeSelection', { 
        userType: userType,
        isSocialLogin: false,
        provider: 'email'
      });
    } catch (error) {
      console.error('회원가입 실패:', error);
      
      // 403 오류의 경우 구체적인 메시지 표시
      if (error.response?.status === 403) {
        Alert.alert(
          '회원가입 실패', 
          '이미 가입된 이메일이거나 서버에서 요청을 거부했습니다. 다른 이메일을 시도해보세요.'
        );
      } else if (error.response?.status === 400) {
        Alert.alert(
          '입력 오류', 
          '입력한 정보를 다시 확인해주세요. 비밀번호는 8자 이상이어야 합니다.'
        );
      } else {
        Alert.alert(
          '회원가입 실패', 
          error.message || '회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
      }
    }
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>이메일로 시작하기</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* 닉네임 입력 필드 추가 */}
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="none"
          value={profileName}
          onChangeText={setProfileName}
        />

        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>루틴 관리 시작하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  signUpButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
  },
});

export default EmailSignUpScreen;