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
    if (tasks && tasks.length > 0) {
      setTimeLeft(tasks[0].duration * 60);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks]);
  
  useEffect(() => {
    if (isRunning && !isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);
  
  const handleStart = async () => {
    try {
      setIsRunning(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
      try {
        const response = await timeAttackApi.createTimeAttackSession({ goal, totalTime, tasks });
        if (response?.success) setSessionId(response.data.sessionId);
      } catch (e) {
        console.warn('타임어택 세션 시작 - 오프라인 모드로 진행');
      }
    } catch (error) {
      // 오프라인에서도 로컬로 진행
      setIsRunning(true);
      setIsPaused(false);
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
    // 현재 태스크 종료 처리 (오프라인에서도 진행)
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < tasks.length) {
      setCurrentTaskIndex(nextIndex);
      setTimeLeft(tasks[nextIndex].duration * 60);
      // 서버 업데이트 실패해도 무시
      try { await updateTimeAttackStep('dummy', { status: 'completed' }); } catch (e) {}
    } else {
      // 모든 태스크 완료 → 완료 화면
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
      navigation.navigate('TimeAttackComplete', { goal, totalTime, tasks });
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.goalTitle}>{goal}</Text>
      <Image source={require('../../../assets/images/타임어택.png')} style={styles.hero} />
      <Text style={styles.timer}>{`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`}</Text>
      <Text style={styles.taskTitle}>{currentTask?.title}</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={handleStart} disabled={isRunning && !isPaused}>
          <FontAwesome5 name="play" size={20} color={Colors.secondaryBrown} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={handlePause} disabled={!isRunning || isPaused}>
          <FontAwesome5 name="pause" size={20} color={Colors.secondaryBrown} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={handleResume} disabled={!isPaused}>
          <FontAwesome5 name="redo" size={20} color={Colors.secondaryBrown} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBeige, alignItems: 'center' },
  goalTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginTop: 10 },
  hero: { width: 200, height: 200, resizeMode: 'contain', marginVertical: 20 },
  timer: { fontSize: FontSizes.extraLarge, fontWeight: FontWeights.bold, color: Colors.textDark, marginBottom: 10 },
  taskTitle: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, marginBottom: 20 },
  controls: { flexDirection: 'row', gap: 16 },
  controlBtn: { backgroundColor: Colors.textLight, padding: 14, borderRadius: 10 },
});

export default TimeAttackInProgressScreen;