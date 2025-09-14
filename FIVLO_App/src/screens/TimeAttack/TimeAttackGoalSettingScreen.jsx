// src/screens/TimeAttack/TimeAttackGoalSettingScreen.jsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

// API 서비스 임포트
import { getTimeAttackGoals, getTimeAttackSteps } from '../../services/timeAttackApi';

const { width } = Dimensions.get('window');

const TimeAttackGoalSettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal } = route.params;
  const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [existingGoals, setExistingGoals] = useState([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  
  const hoursScrollRef = useRef(null);
  const minutesScrollRef = useRef(null);
  const secondsScrollRef = useRef(null);

  // 기존 타임어택 목표들 불러오기
  const fetchExistingGoals = async () => {
    setIsLoadingGoals(true);
    try {
      const goals = await getTimeAttackGoals();
      setExistingGoals(goals);
      console.log('기존 타임어택 목표들:', goals);
    } catch (error) {
      console.error('기존 타임어택 목표 불러오기 실패:', error);
      setExistingGoals([]);
    } finally {
      setIsLoadingGoals(false);
    }
  };

  useEffect(() => {
    // 초기 스크롤 위치 설정
    const scrollToValue = (scrollRef, value) => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: value * 40, animated: false });
      }
    };

    scrollToValue(hoursScrollRef, totalTime.hours);
    scrollToValue(minutesScrollRef, totalTime.minutes);
    scrollToValue(secondsScrollRef, totalTime.seconds);

    // 기존 목표들 불러오기
    fetchExistingGoals();
  }, []);

  const formatTime = () => {
    const { hours, minutes, seconds } = totalTime;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} 시`;
    } else if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} 분`;
    } else {
      return `${seconds.toString().padStart(2, '0')} 초`;
    }
  };

  // 기존 목표 선택 시 단계들 불러오기
  const handleSelectExistingGoal = async (goal) => {
    try {
      const steps = await getTimeAttackSteps(goal.id);
      console.log('선택된 목표의 단계들:', steps);
      
      // 기존 목표와 단계들로 타임어택 진행 화면으로 이동
      navigation.navigate('TimeAttackInProgress', {
        selectedGoal: goal.title,
        subdividedTasks: steps.map(step => ({
          id: step.id,
          name: step.name,
          duration: step.minutes,
          unit: '분'
        })),
        goalId: goal.id,
        steps: steps
      });
    } catch (error) {
      console.error('기존 목표 단계 불러오기 실패:', error);
      Alert.alert('오류', '기존 목표의 단계를 불러오는데 실패했습니다.');
    }
  };

  const handleStartAttack = () => {
    const totalMinutes = totalTime.hours * 60 + totalTime.minutes + (totalTime.seconds > 0 ? 1 : 0);
    if (totalMinutes <= 0) {
      Alert.alert('알림', '1분 이상의 유효한 시간을 설정해주세요.');
      return;
    }
    navigation.navigate('TimeAttackAISubdivision', { selectedGoal, totalMinutes });
  };

  const handleTimeChange = (unit, value) => {
    setTotalTime(prev => ({
      ...prev,
      [unit]: value
    }));
  };

  const generateNumbers = (max) => {
    return Array.from({ length: max }, (_, i) => i);
  };

  const onScroll = (unit, event, scrollRef) => {
    const y = event.nativeEvent.contentOffset.y;
    const itemHeight = 40;
    const index = Math.round(y / itemHeight);
    const maxValue = unit === 'hours' ? 23 : 59;
    const value = Math.min(Math.max(index, 0), maxValue);
    
    // 스크롤 위치를 정확한 위치로 조정
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: value * itemHeight, animated: false });
    }
    
    handleTimeChange(unit, value);
  };

  const renderNumberPicker = (unit, numbers, scrollRef) => (
    <View style={styles.pickerColumn}>
      <ScrollView
        ref={scrollRef}
        style={styles.pickerScrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => onScroll(unit, event, scrollRef)}
        contentContainerStyle={styles.pickerContentContainer}
      >
        {numbers.map((number) => (
          <View key={number} style={styles.pickerItem}>
            <Text style={[
              styles.pickerText,
              totalTime[unit] === number && styles.selectedPickerText
            ]}>
              {number.toString().padStart(2, '0')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="타임어택 기능" showBackButton={true} />
      
      <View style={styles.content}>
        <Text style={styles.questionText}>몇 분안에 마쳐야 하나요?</Text>

        <View style={styles.timeDisplayContainer}>
          <Text style={styles.timeDisplayText}>{formatTime()}</Text>
        </View>

        {/* 기존 목표 섹션 */}
        {existingGoals.length > 0 && (
          <View style={styles.existingGoalsSection}>
            <Text style={styles.existingGoalsTitle}>기존 목표</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalsScrollView}>
              {existingGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.existingGoalItem}
                  onPress={() => handleSelectExistingGoal(goal)}
                >
                  <Text style={styles.existingGoalText}>{goal.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.timeSettingSection}>
          <View style={styles.timeSettingHeader}>
            <Text style={styles.timeSettingTitle}>새로운 시간 설정</Text>
            <Text style={styles.saveText}>저장</Text>
          </View>
          
          <View style={styles.unitButtons}>
            <View style={styles.unitButton}>
              <Text style={styles.unitButtonText}>시</Text>
            </View>
            <View style={[styles.unitButton, styles.selectedUnitButton]}>
              <Text style={[styles.unitButtonText, styles.selectedUnitButtonText]}>분</Text>
            </View>
            <View style={styles.unitButton}>
              <Text style={styles.unitButtonText}>초</Text>
            </View>
          </View>
          
          <View style={styles.timePickerContainer}>
            {renderNumberPicker('hours', generateNumbers(24), hoursScrollRef)}
            {renderNumberPicker('minutes', generateNumbers(60), minutesScrollRef)}
            {renderNumberPicker('seconds', generateNumbers(60), secondsScrollRef)}
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="시작하기"
          onPress={handleStartAttack}
          disabled={totalTime.hours === 0 && totalTime.minutes === 0 && totalTime.seconds === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  questionText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  timeDisplayContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 30,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeDisplayText: {
    fontSize: 48,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  timeSettingSection: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  timeSettingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeSettingTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  saveText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  unitButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: Colors.primaryBeige,
  },
  selectedUnitButton: {
    backgroundColor: '#FFD700',
  },
  unitButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
  },
  selectedUnitButtonText: {
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerScrollView: {
    height: 200,
  },
  pickerContentContainer: {
    paddingVertical: 80,
  },
  pickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
  },
  selectedPickerText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  existingGoalsSection: {
    marginBottom: 20,
  },
  existingGoalsTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  goalsScrollView: {
    flexDirection: 'row',
  },
  existingGoalItem: {
    backgroundColor: Colors.accentApricot,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  existingGoalText: {
    fontSize: FontSizes.small,
    color: Colors.textLight,
    fontWeight: FontWeights.medium,
  },
  buttonContainer: {
    padding: 20,
  },
});

export default TimeAttackGoalSettingScreen;