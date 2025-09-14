// src/screens/Pomodoro/PomodoroBreakChoiceScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
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
import { updatePomodoroSessionStatus } from '../../services/pomodoroApi';

const PomodoroBreakChoiceScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  // "네" (휴식 없이 바로 진행) - API 연동
  const handleNoBreak = async () => {
    setIsLoading(true);
    try {
      // 백엔드에 휴식 없이 다음 집중 세션으로 바로 넘어간다고 알림 (필요시 API 추가)
      // 현재 API 명세에는 직접적인 API가 없으므로, start 상태로 업데이트하는 것으로 대체
      await updatePomodoroSessionStatus(selectedGoal.id, 'start');
      console.log('휴식 없이 다음 집중 세션으로 진행');
      navigation.navigate('PomodoroTimer', { selectedGoal, initialTimeLeft: 25 * 60, initialIsFocusMode: true, initialCycleCount: 0, resume: true });
    } catch (error) {
      console.error('휴식 없이 진행 실패:', error.response ? error.response.data : error.message);
      Alert.alert('오류', error.response?.data?.message || '진행 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // "아니오" (휴식 시간 진행) - API 연동
  const handleTakeBreak = async () => {
    setIsLoading(true);
    try {
      // 백엔드에 휴식 세션 시작을 알림 (필요시 API 추가)
      // 현재 API 명세에는 직접적인 API가 없으므로, start 상태로 업데이트하는 것으로 대체
      await updatePomodoroSessionStatus(selectedGoal.id, 'start');
      console.log('휴식 시간 시작');
      navigation.navigate('PomodoroTimer', { selectedGoal, initialTimeLeft: 5 * 60, initialIsFocusMode: false, initialCycleCount: 0, resume: true }); // 휴식 모드로 시작
    } catch (error) {
      console.error('휴식 시간 시작 실패:', error.response ? error.response.data : error.message);
      Alert.alert('오류', error.response?.data?.message || '휴식 시작 중 문제가 발생했습니다.');
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
        <Text style={styles.titleText}>휴식시간</Text>
        
        <Image
          source={require('../../../assets/images/obooni_clock.png')}
          style={styles.obooniCharacter}
        />
        
        <Text style={styles.questionText}>휴식시간 없이 바로 사이클을 진행하시겠어요?</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleNoBreak} disabled={isLoading}>
            <Text style={styles.buttonText}>네</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleTakeBreak} disabled={isLoading}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>아니오</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.hintText}>3초가 지나면 '네'로 진행합니다.</Text>
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
  titleText: {
    fontSize: FontSizes.large,
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
    fontSize: FontSizes.medium,
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
  actionButton: {
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
  secondaryButton: {
    backgroundColor: Colors.textLight,
  },
  buttonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: Colors.textDark,
  },
  hintText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
});

export default PomodoroBreakChoiceScreen;
