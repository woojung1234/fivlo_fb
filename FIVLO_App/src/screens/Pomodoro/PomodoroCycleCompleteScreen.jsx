// src/screens/Pomodoro/PomodoroCycleCompleteScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

// API 서비스 임포트
import { updatePomodoroSessionStatus, awardPomodoroCoins } from '../../services/pomodoroApi';

const PomodoroCycleCompleteScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal, cycleCount, coinEarned } = route.params; // coinEarned 받기
  const [isLoading, setIsLoading] = useState(false);

  // "계속하기" 버튼 (API 연동 준비)
  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await updatePomodoroSessionStatus(selectedGoal.id, 'start'); // 세션 상태를 start로 업데이트
      console.log('다음 사이클 계속');
      navigation.navigate('PomodoroTimer', { selectedGoal, initialTimeLeft: 25 * 60, initialIsFocusMode: true, initialCycleCount: cycleCount, resume: true });
    } catch (error) {
      console.error('다음 사이클 계속 실패:', error.response ? error.response.data : error.message);
      Alert.alert('오류', error.response?.data?.message || '진행 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // "그만하기" 버튼 (API 연동 준비)
  const handleStop = async () => {
    setIsLoading(true);
    try {
      // 뽀모도로 완료 시 코인 지급 API 호출
      if (isPremiumUser && coinEarned > 0) {
        await awardPomodoroCoins({
          goalId: selectedGoal.id,
          amount: coinEarned,
          source: 'pomodoro_completion',
          description: `뽀모도로 ${cycleCount}사이클 완료`
        });
        console.log('뽀모도로 코인 지급 완료:', coinEarned);
      }
      
      // 최종 완료 화면으로 이동 (PomodoroFinishScreen)
      navigation.navigate('PomodoroFinish', { selectedGoal, isPremiumUser, coinEarned });
    } catch (error) {
      console.error('뽀모도로 코인 지급 실패:', error.response ? error.response.data : error.message);
      // 코인 지급 실패해도 완료 화면으로 이동
      navigation.navigate('PomodoroFinish', { selectedGoal, isPremiumUser, coinEarned: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title="포모도로 기능" showBackButton={true} />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.accentApricot} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.cycleCompleteText}>{cycleCount} 사이클 완료!</Text>
        
        <Image
          source={require('../../../assets/images/obooni_happy.png')}
          style={styles.obooniCharacter}
        />
        
        <Text style={styles.questionText}>1 사이클을 더 하실래요?</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={isLoading}>
            <Text style={styles.continueButtonText}>계속하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopButton} onPress={handleStop} disabled={isLoading}>
            <Text style={styles.stopButtonText}>그만하기</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.hintText}>3초가 지나면 '계속하기'로 진행합니다.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    zIndex: 10,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cycleCompleteText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  obooniCharacter: {
    width: 250,
    height: 250,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  questionText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: Colors.accentApricot,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopButton: {
    backgroundColor: Colors.textLight,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    textAlign: 'center',
  },
  stopButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  hintText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
});

export default PomodoroCycleCompleteScreen;
