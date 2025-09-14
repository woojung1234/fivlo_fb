// src/screens/Pomodoro/PomodoroPauseScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

// API 서비스 임포트
import { updatePomodoroSessionStatus, completePomodoroSession } from '../../services/pomodoroApi';

const PomodoroPauseScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal, timeLeft, isFocusMode, cycleCount } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // "다시 시작" 버튼 (API 연동)
  const handleResume = async () => {
    setIsLoading(true);
    try {
      await updatePomodoroSessionStatus(selectedGoal.id, 'start'); // API 호출
      console.log('포모도로 재개 성공');
      navigation.navigate('PomodoroTimer', {
        selectedGoal,
        initialTimeLeft: timeLeft,
        initialIsFocusMode: isFocusMode,
        initialCycleCount: cycleCount,
        resume: true,
      });
    } catch (error) {
      console.error('포모도로 재개 실패:', error.response ? error.response.data : error.message);
      Alert.alert('오류', error.response?.data?.message || '타이머 재개 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // "초기화" 버튼 (API 연동)
  const handleReset = () => {
    navigation.navigate('PomodoroResetConfirmModal', {
      sessionId: selectedGoal.id, // 세션 ID 전달
      onConfirm: async () => {
        // PomodoroResetConfirmModal에서 이미 completeSession을 호출하므로, 여기서는 내비게이션만 처리
        navigation.popToTop();
        navigation.navigate('Pomodoro');
      },
      onCancel: () => {
        // 모달 닫기만 함
      }
    });
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
        <Text style={styles.goalText}>{selectedGoal.title}</Text>
        
        <Image
          source={require('../../../assets/images/obooni_clock.png')}
          style={styles.obooniClock}
        />
        
        <Text style={styles.pausedTimeText}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={styles.remainingTimeText}>
          {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}분 ${
            (timeLeft % 60).toString().padStart(2, '0')}초 남았습니다.`}
        </Text>

        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlButton} onPress={handleResume} disabled={isLoading}>
            <FontAwesome5 name="play" size={24} color={Colors.secondaryBrown} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleReset} disabled={isLoading}>
            <FontAwesome5 name="stop" size={24} color={Colors.secondaryBrown} />
          </TouchableOpacity>
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
  goalText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  obooniClock: {
    width: 250,
    height: 250,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  pausedTimeText: {
    fontSize: FontSizes.extraLarge * 1.2,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  remainingTimeText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginBottom: 50,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
  controlButton: {
    backgroundColor: Colors.textLight,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default PomodoroPauseScreen;
