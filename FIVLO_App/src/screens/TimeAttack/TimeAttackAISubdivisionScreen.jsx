// src/screens/TimeAttack/TimeAttackAISubdivisionScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList, TextInput, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

// API 서비스 임포트
import { createTimeAttackSession, createTimeAttackStep } from '../../services/timeAttackApi';
import { createAIGoal } from '../../services/aiApi'; // AI API 임포트

const TimeAttackAISubdivisionScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal, totalMinutes } = route.params;

  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [subdividedTasks, setSubdividedTasks] = useState([]);

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentEditingTask, setCurrentEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [editedTaskTime, setEditedTaskTime] = useState('');

  // AI 세분화 로직 호출
  useEffect(() => {
    const fetchAIGoalBreakdown = async () => {
      setIsLoadingAI(true);
      try {
        // Postman 7-1 AI 목표 세분화 생성 API 호출
        // totalMinutes는 분 단위로 백엔드에 전달 (백엔드에서 초로 변환)
        const aiResponse = await createAIGoal(
          selectedGoal,
          `${totalMinutes}분`, // duration 필드에 '분' 단위로 전달
          true, // hasDuration
          new Date().toISOString().split('T')[0], // startDate
          null // endDate (단기 목표이므로 null)
        );
        console.log('AI 목표 세분화 응답:', aiResponse);

        // AI 응답의 tasks 필드 파싱
        if (aiResponse && aiResponse.tasks && Array.isArray(aiResponse.tasks)) {
          const formattedTasks = aiResponse.tasks.map((task, index) => ({
            id: task.id || `ai_task_${index}_${Date.now()}`, // 백엔드에서 ID가 없다면 임시 ID 생성
            name: task.title, // 백엔드 tasks의 'title' 필드 사용
            duration: parseInt(task.estimatedTime) || 0, // 'estimatedTime'을 분 단위 숫자로 파싱
            unit: '분',
            editable: true,
            order: index,
          }));
          setSubdividedTasks(formattedTasks);
        } else {
          // AI 응답이 예상과 다를 경우 기본 단계 사용 (폴백)
          const fallbackTasks = [
            { id: 'fb1', name: '준비하기', duration: Math.floor(totalMinutes * 0.1), unit: '분', editable: true },
            { id: 'fb2', name: selectedGoal, duration: Math.floor(totalMinutes * 0.8), unit: '분', editable: true },
            { id: 'fb3', name: '마무리하기', duration: Math.floor(totalMinutes * 0.1), unit: '분', editable: true },
          ];
          setSubdividedTasks(fallbackTasks);
          Alert.alert('알림', 'AI 세분화에 실패하여 기본 단계를 사용합니다.');
        }

      } catch (error) {
        console.error("AI 목표 세분화 실패:", error.response ? error.response.data : error.message);
        Alert.alert('오류', error.response?.data?.message || 'AI 세분화 중 문제가 발생했습니다. 기본 단계를 사용합니다.');
        // 오류 발생 시 기본 단계 사용
        const fallbackTasks = [
          { id: 'fb1', name: '준비하기', duration: Math.floor(totalMinutes * 0.1), unit: '분', editable: true },
          { id: 'fb2', name: selectedGoal, duration: Math.floor(totalMinutes * 0.8), unit: '분', editable: true },
          { id: 'fb3', name: '마무리하기', duration: Math.floor(totalMinutes * 0.1), unit: '분', editable: true },
        ];
        setSubdividedTasks(fallbackTasks);
      } finally {
        setIsLoadingAI(false);
      }
    };
    fetchAIGoalBreakdown();
  }, [selectedGoal, totalMinutes]); // selectedGoal 또는 totalMinutes 변경 시 다시 호출

  const handleEditTask = (task) => {
    setCurrentEditingTask(task);
    setEditedTaskText(task.name);
    setEditedTaskTime(task.duration.toString());
    setIsEditingTask(true);
  };

  const handleSaveEditedTask = () => {
    const duration = parseInt(editedTaskTime, 10);
    if (isNaN(duration) || duration < 0) {
      Alert.alert('알림', '유효한 시간을 입력해주세요.');
      return;
    }
    setSubdividedTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === currentEditingTask.id ? { ...task, name: editedTaskText, duration: duration } : task
      )
    );
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
    setEditedTaskTime('');
    Alert.alert('저장 완료', '일정이 수정되었습니다.');
  };

  const handleCancelEdit = () => {
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
    setEditedTaskTime('');
  };

  // "타임어택 시작" 버튼 클릭 (API 연동)
  const handleStartAttack = async () => {
    setIsLoadingAI(true);
    try {
      // 1. 타임어택 목표 생성
      const goalResponse = await createTimeAttackSession({
        title: selectedGoal,
        totalTime: totalMinutes,
        description: `${selectedGoal}을 위한 ${totalMinutes}분 타임어택`
      });
      console.log('타임어택 목표 생성 성공:', goalResponse);

      // 2. 각 단계별로 타임어택 단계 생성
      const createdSteps = [];
      for (const task of subdividedTasks) {
        const stepResponse = await createTimeAttackStep({
          goalId: goalResponse.id,
          name: task.name,
          minutes: task.duration,
          description: task.name,
          order: subdividedTasks.indexOf(task) + 1
        });
        createdSteps.push(stepResponse);
        console.log('타임어택 단계 생성 성공:', stepResponse);
      }

      Alert.alert('타임어택 시작', '세분화된 목표로 타임어택을 시작합니다!');
      navigation.navigate('TimeAttackInProgress', { 
        selectedGoal, 
        subdividedTasks: subdividedTasks, 
        goalId: goalResponse.id,
        steps: createdSteps
      });
    } catch (error) {
      console.error('타임어택 시작 실패:', error.response ? error.response.data : error.message);
      Alert.alert('오류', error.response?.data?.message || '타임어택 시작 중 문제가 발생했습니다.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const renderSubdividedTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.name}</Text>
      <View style={styles.taskTimeContainer}>
        <Text style={styles.taskTimeText}>- {item.duration}{item.unit}</Text>
        <TouchableOpacity style={styles.removeButton}>
          <FontAwesome5 name="times" size={16} color={Colors.secondaryBrown} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title="타임어택 기능" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {isLoadingAI && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondaryBrown} />
            <Text style={styles.loadingText}>오분이가 당신을 위한{"\n"}{totalMinutes}분 타임어택을 만들어요!</Text> {/* totalMinutes 반영 */}
          </View>
        )}

        {!isLoadingAI && (
          <>
            <Text style={styles.sectionTitle}>오분이가 당신을 위한 {totalMinutes}분 타임어택을 만들었어요!</Text>
            <View style={styles.tasksContainer}>
              {subdividedTasks.map((item) => (
                <View key={item.id} style={styles.taskItem}>
                  <Text style={styles.taskText}>{item.name}</Text>
                  <View style={styles.taskTimeContainer}>
                    <Text style={styles.taskTimeText}>- {item.duration}{item.unit}</Text>
                    <TouchableOpacity style={styles.removeButton}>
                      <FontAwesome5 name="times" size={16} color={Colors.secondaryBrown} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.addTaskButton}>
              <FontAwesome5 name="plus" size={20} color={Colors.secondaryBrown} />
            </TouchableOpacity>
            <Button
              title="타임어택 시작"
              onPress={handleStartAttack}
              style={styles.startButton}
            />
          </>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditingTask}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>시간 수정</Text>
            <View style={styles.editModalInputContainer}>
              <TextInput
                style={styles.editModalTextInput}
                value={editedTaskText}
                onChangeText={setEditedTaskText}
                placeholder="목표 내용"
              />
              <TextInput
                style={styles.editModalTimeInput}
                value={editedTaskTime}
                onChangeText={(text) => setEditedTaskTime(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="분"
              />
              <Text style={styles.editModalTimeUnit}>분</Text>
            </View>
            <View style={styles.editModalButtons}>
              <Button title="취소" onPress={handleCancelEdit} primary={false} style={styles.editModalButton} />
              <Button title="저장" onPress={handleSaveEditedTask} style={styles.editModalButton} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 100,
  },
  loadingText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    lineHeight: 30,
  },
  tasksContainer: {
    width: '100%',
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTimeText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
  addTaskButton: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    marginTop: 30,
    width: '100%',
  },
});

export default TimeAttackAISubdivisionScreen;
