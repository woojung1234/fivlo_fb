// App.js

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator } from 'react-native';

// [수정] 실제 서버와 통신하는 API 함수를 임포트합니다.
import { getUserInfo } from './src/services/authApi'; 

// 공통 스타일 및 폰트 임포트 (로딩 화면용)
import { Colors } from './src/styles/color';
import { FontSizes } from './src/styles/Fonts';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Onboarding');
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          // [수정] 저장된 토큰이 유효한지 실제 API 서버에 사용자 정보를 요청하여 확인합니다.
          // 이 요청이 성공하면 토큰이 유효한 것입니다.
          try {
            const userInfo = await getUserInfo(); // 실제 API 호출
            
            // 프리미엄 유저 여부 확인 (API 응답 필드에 맞게 'subscriptionStatus' 등을 확인)
            if (userInfo && userInfo.subscriptionStatus === 'premium') {
              setIsPremiumUser(true);
            } else {
              setIsPremiumUser(false);
            }
            setInitialRoute('Main'); // 유효한 토큰이 있으니 메인 화면으로 설정
          } catch (error) {
            // getUserInfo()가 실패하면 (예: 401 Unauthorized) 토큰이 유효하지 않거나 만료된 것입니다.
            console.warn("Token validation failed with server:", error);
            await AsyncStorage.removeItem('userToken');
            setInitialRoute('Onboarding');
            setIsPremiumUser(false);
          }
        } else {
          // 토큰이 없으면 온보딩 화면으로
          setInitialRoute('Onboarding');
          setIsPremiumUser(false);
        }
      } catch (error) {
        console.error("Error in checkUserSession:", error);
        await AsyncStorage.removeItem('userToken');
        setInitialRoute('Onboarding');
        setIsPremiumUser(false);
      } finally {
        setIsAppReady(true);
      }
    };

    checkUserSession();
  }, []);

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primaryBeige }}>
        <ActivityIndicator size="large" color={Colors.secondaryBrown} />
        <Text style={{ fontSize: FontSizes.large, color: Colors.textDark, marginTop: 10 }}>앱 로딩 중...</Text>
      </View>
    );
  }

  return <AppNavigator initialRoute={initialRoute} isPremiumUser={isPremiumUser} />;
}