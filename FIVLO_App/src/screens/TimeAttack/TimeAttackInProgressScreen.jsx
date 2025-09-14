import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Vibration,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Button from '../../components/common/Button';
import { timeAttackApi, updateTimeAttackStep } from '../../services/timeAttackApi';

const TimeAttackInProgressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { tasks, totalTime, goal } = route.params;
  
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  
  const currentTask = tasks[currentTaskIndex];
  const totalSeconds = Math.floor(timeLeft);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  useEffect(() => {
    // 첫 번째 태스크의 시간으로 초기화
    if (tasks && tasks.length > 0) {
      setTimeLeft(tasks[0].duration * 60); // 분을 초로 변환
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks]);
  
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTaskComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);
  
  const handleStart = async () => {
    try {
      setIsRunning(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
      
      // 타임어택 세션 시작 API 호출
      const response = await timeAttackApi.createTimeAttackSession({
        goal: goal,
        totalTime: totalTime,
        tasks: tasks,
      });
      
      if (response.success) {
        setSessionId(response.data.sessionId);
      }
    } catch (error) {
      console.error('타임어택 세션 시작 실패:', error);
      Alert.alert('오류', '타임어택을 시작할 수 없습니다.');
    }
  };
  
  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
    pausedTimeRef.current = Date.now();
  };
  
  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
    startTimeRef.current = Date.now() - (pausedTimeRef.current - startTimeRef.current);
  };
  
  const handleTaskComplete = async () => {
    try {
      // 현재 태스크 완료 음성 알림
      if (currentTask) {
        await Speech.speak(`${currentTask.name}을(를) 완료했어요!`, {
          language: 'ko-KR',
          rate: 0.8,
        });
      }
      
      // 진동 알림
      Vibration.vibrate([0, 500, 200, 500]);
      
      // 현재 단계 완료 API 호출 (단계 ID가 있는 경우)
      if (currentTask && currentTask.id) {
        try {
          await updateTimeAttackStep(currentTask.id, {
            status: 'completed',
            completedAt: new Date().toISOString()
          });
          console.log('타임어택 단계 완료 API 호출 성공:', currentTask.id);
        } catch (apiError) {
          console.error('타임어택 단계 완료 API 호출 실패:', apiError);
        }
      }
      
      // 다음 태스크로 이동
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setTimeLeft(tasks[currentTaskIndex + 1].duration * 60);
        setIsRunning(false);
        setIsPaused(false);
      } else {
        // 모든 태스크 완료
        handleAllTasksComplete();
      }
    } catch (error) {
      console.error('태스크 완료 처리 실패:', error);
    }
  };
  
  const handleAllTasksComplete = async () => {
    try {
      // 타임어택 완료 API 호출
      if (sessionId) {
        await timeAttackApi.completeTimeAttackSession(sessionId);
      }
      
      // 완료 음성 알림
      await Speech.speak('모든 목표를 완료했어요! 정말 잘했어요!', {
        language: 'ko-KR',
        rate: 0.8,
      });
      
      // 완료 화면으로 이동
      navigation.navigate('TimeAttackComplete', {
        goal: goal,
        totalTime: totalTime,
        completedTasks: tasks,
      });
    } catch (error) {
      console.error('타임어택 완료 처리 실패:', error);
    }
  };
  
  const handleStop = () => {
    Alert.alert(
      '타임어택 중단',
      '타임어택을 중단하시겠어요?',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '예',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('TimeAttackStop', {
              goal: goal,
              totalTime: totalTime,
              completedTasks: tasks.slice(0, currentTaskIndex),
              currentTask: currentTask,
            });
          },
        },
      ]
    );
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getProgressPercentage = () => {
    if (!currentTask) return 0;
    const totalTaskSeconds = currentTask.duration * 60;
    return ((totalTaskSeconds - timeLeft) / totalTaskSeconds) * 100;
  };
  
  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>타임어택</Text>
        <TouchableOpacity
          style={styles.stopButton}
          onPress={handleStop}
        >
          <FontAwesome5 name="stop" size={20} color={Colors.textDark} />
        </TouchableOpacity>
      </View>
      
      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 목표 표시 */}
        <Text style={styles.goalText}>{goal}</Text>
        
        {/* 현재 태스크 */}
        <View style={styles.currentTaskContainer}>
          <Text style={styles.currentTaskTitle}>현재 작업</Text>
          <Text style={styles.currentTaskName}>{currentTask?.name}</Text>
          <Text style={styles.taskProgress}>
            {currentTaskIndex + 1} / {tasks.length}
          </Text>
        </View>
        
        {/* 타이머 */}
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>남은 시간</Text>
          </View>
          
          {/* 진행률 바 */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${getProgressPercentage()}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getProgressPercentage())}% 완료
            </Text>
          </View>
        </View>
        
        {/* 컨트롤 버튼 */}
        <View style={styles.controlButtons}>
          {!isRunning && !isPaused ? (
            <Button
              title="시작"
              onPress={handleStart}
              style={styles.startButton}
            />
          ) : (
            <View style={styles.pauseResumeContainer}>
              {isPaused ? (
                <Button
                  title="계속"
                  onPress={handleResume}
                  style={styles.resumeButton}
                />
              ) : (
                <Button
                  title="일시정지"
                  onPress={handlePause}
                  style={styles.pauseButton}
                />
              )}
            </View>
          )}
        </View>
        
        {/* 다음 태스크 미리보기 */}
        {currentTaskIndex < tasks.length - 1 && (
          <View style={styles.nextTaskContainer}>
            <Text style={styles.nextTaskTitle}>다음 작업</Text>
            <Text style={styles.nextTaskName}>
              {tasks[currentTaskIndex + 1].name}
            </Text>
            <Text style={styles.nextTaskTime}>
              {tasks[currentTaskIndex + 1].duration}분
            </Text>
          </View>
        )}
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.textLight,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  stopButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  goalText: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  currentTaskContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  currentTaskTitle: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginBottom: 10,
  },
  currentTaskName: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  taskProgress: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    opacity: 0.7,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryBeige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timerText: {
    fontSize: 36,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 5,
  },
  timerLabel: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: Colors.textLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
  },
  controlButtons: {
    alignItems: 'center',
    marginBottom: 30,
  },
  startButton: {
    width: 200,
  },
  pauseResumeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pauseButton: {
    width: 150,
    backgroundColor: Colors.secondaryBrown,
  },
  resumeButton: {
    width: 150,
    backgroundColor: Colors.primaryBeige,
  },
  nextTaskContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  nextTaskTitle: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginBottom: 10,
  },
  nextTaskName: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 5,
  },
  nextTaskTime: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    opacity: 0.7,
  },
});

export default TimeAttackInProgressScreen;