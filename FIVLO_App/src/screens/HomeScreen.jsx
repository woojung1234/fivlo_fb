// src/screens/HomeScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import CharacterImage from '../components/common/CharacterImage';
import Button from '../components/common/Button';

// Modal 컴포넌트 임포트
import PhotoUploadModal from '../screens/Album/PhotoUploadModal';
import TaskDetailModal from '../screens/Task/TaskDetailModal';

// API 서비스 임포트
import { getTasksByDate, completeTask, createTask, deleteTask } from '../services/taskApi';
import { getCoinBalance } from '../services/coinApi';

const HomeScreen = ({ isPremiumUser = true }) => { // 개발 환경에서 테스트를 위해 기본값 true 설정
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [obooniState, setObooniState] = useState('default');

  const [coins, setCoins] = useState(0);
  const [showCoinGrantModal, setShowCoinGrantModal] = useState(false);
  
  // 디버깅을 위한 useEffect
  useEffect(() => {
    console.log("HomeScreen 렌더링:", { isPremiumUser, tasksCount: tasks.length });
  }, [isPremiumUser, tasks]);
  
  // 수정: PhotoUploadModal 관련 상태 추가
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [taskForPhoto, setTaskForPhoto] = useState(null);
  
  // TaskDetailModal 관련 상태 추가
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);

  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);
  const [isCompletingTask, setIsCompletingTask] = useState(false);

  const fetchTasks = async (dateToFetch) => {
    setIsLoadingTasks(true);
    try {
      const formattedDate = format(new Date(dateToFetch), 'yyyy-MM-dd');
      const data = await getTasksByDate(formattedDate);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks for date:", dateToFetch, error.message);
      // 개발 환경에서 API 서버 연결 실패 시 임시 데이터 사용
      if (__DEV__) {
        console.log("개발 환경: 임시 데이터 사용");
        setTasks([
          { id: '1', title: '아침 운동하기', isCompleted: false },
          { id: '2', title: '책 읽기', isCompleted: true },
          { id: '3', title: '프로젝트 작업', isCompleted: false },
        ]);
      } else {
        setTasks([]);
      }
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchCoinBalance = async () => {
    setIsLoadingCoins(true);
    try {
      const data = await getCoinBalance();
      setCoins(data.balance || 0);
    } catch (error) {
      console.error("Failed to fetch coin balance:", error.message);
      // 개발 환경에서 API 서버 연결 실패 시 임시 데이터 사용
      if (__DEV__) {
        console.log("개발 환경: 임시 코인 데이터 사용");
        setCoins(5); // 임시로 5개 코인 설정
      } else {
        setCoins(0);
      }
    } finally {
      setIsLoadingCoins(false);
    }
  };

  // 초기 데이터 설정
  useEffect(() => {
    // 초기 데이터 로드
    fetchTasks(currentDate);
    fetchCoinBalance();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchTasks(currentDate);
      fetchCoinBalance();
    }
  }, [isFocused, currentDate, isPremiumUser]);

  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const toggleTaskCompletion = async (taskId) => {
    setIsCompletingTask(true);
    try {
      if (__DEV__) {
        // 개발 환경: 로컬 상태 업데이트
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          );
          
          // 모든 일정 완료 확인
          const allCompleted = updatedTasks.every(task => task.isCompleted);
          const hasTasks = updatedTasks.length > 0;
          
          console.log("할 일 완료 상태 확인:", {
            allCompleted,
            hasTasks,
            isPremiumUser,
            tasks: updatedTasks.map(t => ({ id: t.id, title: t.title, isCompleted: t.isCompleted }))
          });
          
          if (allCompleted && hasTasks && isPremiumUser) {
            // 코인 증정 모달 표시
            setTimeout(() => {
              console.log("코인 증정 모달 표시");
              setShowCoinGrantModal(true);
            }, 500);
          }
          
          return updatedTasks;
        });
        
        setIsCompletingTask(false);
        return;
      }
      
      const response = await completeTask(taskId);
      console.log("Task 완료 처리 성공:", response);

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, isCompleted: response.isCompleted, completedAt: response.completedAt } : task
        )
      );

      fetchCoinBalance();

      // 성장앨범 연동 로직 (프리미엄 사용자용)
      if (response.needsGrowthAlbumPhoto && isPremiumUser) {
        const taskForAlbum = tasks.find(t => t.id === taskId);
        setTaskForPhoto(taskForAlbum);
        setShowPhotoUploadModal(true);
      }

      // 모든 일정 완료 시 코인 증정 (유료 사용자용)
      if (response.allTasksCompleted && isPremiumUser && response.coinReward && response.coinReward.amount > 0) {
        setShowCoinGrantModal(true);
      }

    } catch (error) {
      console.error("Task 완료 처리 실패:", error.response ? error.response.data : error.message);
      Alert.alert('오류', error.response?.data?.message || 'Task 완료 처리 중 문제가 발생했습니다.');
    } finally {
      setIsCompletingTask(false);
    }
  };
  
  const handleObooniPress = () => {
    navigation.navigate('ObooniCustomization', { isPremiumUser: isPremiumUser });
  };

  // 할 일 추가 함수
  const handleAddTask = async (taskData) => {
    try {
      if (__DEV__) {
        // 개발 환경: 로컬 상태에 추가
        const newTask = {
          id: Date.now().toString(),
          title: taskData.title,
          isCompleted: false,
          categoryId: taskData.categoryId || 'daily',
        };
        setTasks(prev => [...prev, newTask]);
        setShowTaskDetailModal(false);
        return;
      }
      
      // API를 통해 할 일 추가
      const response = await createTask({
        ...taskData,
        date: format(currentDate, 'yyyy-MM-dd'),
        isCompleted: false,
      });
      
      // 할 일 목록 새로고침
      fetchTasks(currentDate);
      setShowTaskDetailModal(false);
    } catch (error) {
      console.error("할 일 추가 실패:", error);
      Alert.alert('오류', '할 일 추가 중 문제가 발생했습니다.');
    }
  };

  // 할 일 수정 함수
  const handleEditTask = (task) => {
    // 할 일 수정 로직 (필요시 구현)
    console.log("할 일 수정:", task);
  };

  // 할 일 삭제 함수
  const handleDeleteTask = async (taskId) => {
    try {
      if (__DEV__) {
        // 개발 환경: 로컬 상태에서 삭제
        setTasks(prev => prev.filter(task => task.id !== taskId));
        return;
      }
      
      // API를 통해 할 일 삭제
      await deleteTask(taskId);
      
      // 할 일 목록 새로고침
      fetchTasks(currentDate);
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
      Alert.alert('오류', '할 일 삭제 중 문제가 발생했습니다.');
    }
  };
  
  // Task 항목을 눌렀을 때의 동작은 TaskDetailModal로 이동하여 수정/삭제 등을 할 수 있게 함
  const goToTaskDetail = (task) => {
    navigation.navigate('TaskDetailModal', {
      selectedDate: format(currentDate, 'yyyy-MM-dd'),
      onTaskUpdate: () => fetchTasks(currentDate),
      onTaskDelete: () => fetchTasks(currentDate),
    });
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* 상단 날짜 네비게이션 */}
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton} disabled={isLoadingTasks || isCompletingTask}>
            <FontAwesome name="chevron-left" size={20} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.currentDateText}>
            {format(currentDate, 'M월 d일 EEEE', { locale: ko })}
          </Text>
          <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton} disabled={isLoadingTasks || isCompletingTask}>
            <FontAwesome name="chevron-right" size={20} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* 오분이 메시지 */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {format(currentDate, 'M월 d일')}, 오늘 오분이는 3분 정도 고쳐졌어요!
          </Text>
        </View>

        {/* 코인 표시 */}
        {isPremiumUser && (
          <View style={styles.coinDisplayContainer}>
            <View style={styles.coinIconContainer}>
              <Text style={styles.coinIconText}>$</Text>
            </View>
            <Text style={styles.coinCountText}>{coins}개</Text>
          </View>
        )}

        {/* 오분이 캐릭터 */}
        <View style={styles.characterContainer}>
          <TouchableOpacity onPress={handleObooniPress} disabled={isLoadingTasks || isLoadingCoins || isCompletingTask}>
            <CharacterImage state={obooniState} style={styles.obooniCharacter} />
          </TouchableOpacity>
        </View>


        {/* 오늘의 일정 섹션 */}
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>오늘의 일정</Text>
            <TouchableOpacity 
              onPress={() => setShowTaskDetailModal(true)}
              style={styles.addButton}
            >
              <FontAwesome name="plus" size={16} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          </View>
          
          {isLoadingTasks || isCompletingTask ? (
            <ActivityIndicator size="large" color={Colors.secondaryBrown} style={styles.loadingIndicator} />
          ) : tasks.length > 0 ? (
            <View style={styles.taskList}>
              {tasks.map((task, index) => (
                <View key={task.id} style={styles.taskItem}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => toggleTaskCompletion(task.id)}
                    disabled={isCompletingTask}
                  >
                    <Text style={task.isCompleted ? styles.checkboxChecked : styles.checkboxUnchecked}>
                      {task.isCompleted ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.taskTextContainer}
                    onPress={() => setShowTaskDetailModal(true)}
                  >
                    <Text style={[styles.taskText, task.isCompleted && styles.taskTextCompleted]}>
                      {task.title || '할일'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.noTaskContainer}
              onPress={() => setShowTaskDetailModal(true)}
            >
              <Text style={styles.noTaskText}>오늘의 일정을 정해주세요!</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 코인 증정 모달 (유료 사용자용) */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showCoinGrantModal}
          onRequestClose={() => setShowCoinGrantModal(false)}
        >
          <View style={styles.coinGrantModalOverlay}>
            <View style={styles.coinGrantModalContent}>
              <View style={styles.coinGrantCard}>
                <Image 
                  source={require('../../assets/images/coin.png')} 
                  style={styles.coinGrantImage} 
                />
                <Text style={styles.coinGrantMessage1}>출석을 하셨네요</Text>
                <Text style={styles.coinGrantMessage2}>오분이가 코만를 드리겠습니다</Text>
                <Text style={styles.coinGrantMessage3}>오늘도 화이팅!!</Text>
              </View>
              <Button 
                title="확인" 
                onPress={() => setShowCoinGrantModal(false)} 
                style={styles.coinGrantModalButton} 
              />
            </View>
          </View>
        </Modal>

        {/* TaskDetailModal 렌더링 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showTaskDetailModal}
          onRequestClose={() => setShowTaskDetailModal(false)}
        >
          <TaskDetailModal
            selectedDate={currentDate}
            tasks={tasks}
            categories={[{ id: 'daily', name: '일상', color: '#8B4513' }]}
            onClose={() => setShowTaskDetailModal(false)}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={toggleTaskCompletion}
          />
        </Modal>

        {/* 수정: PhotoUploadModal 렌더링 추가 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPhotoUploadModal}
          onRequestClose={() => setShowPhotoUploadModal(false)}
        >
          <PhotoUploadModal 
            onClose={() => setShowPhotoUploadModal(false)} 
            isPremiumUser={isPremiumUser} 
            taskId={taskForPhoto?.id} 
          />
        </Modal>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  // 상단 날짜 네비게이션
  dateNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 15,
    marginTop: 50,
  },
  dateNavButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  currentDateText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  // 오분이 메시지
  messageContainer: {
    width: '90%',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  messageText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 22,
  },
  // 코인 표시
  coinDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  coinIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accentApricot,
  },
  coinIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accentApricot,
  },
  coinCountText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginLeft: 8,
    fontWeight: FontWeights.medium,
  },
  // 오분이 캐릭터 컨테이너
  characterContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  // 오분이 캐릭터
  obooniCharacter: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
  // 오늘의 일정 섹션
  scheduleContainer: {
    width: '90%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  scheduleTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
  // 할일 목록
  taskList: {
    paddingBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: Colors.textLight,
  },
  checkboxChecked: {
    color: Colors.accentApricot,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxUnchecked: {
    color: 'transparent',
    fontSize: 14,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.secondaryBrown,
  },
  // 할일이 없을 때
  noTaskContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noTaskText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
  // 코인 증정 모달 스타일 (유료 사용자용)
  coinGrantModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 불투명 배경
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  coinGrantModalContent: {
    alignItems: 'center',
    width: '90%',
  },
  coinGrantCard: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  coinGrantImage: {
    width: 120,
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  coinGrantMessage1: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  coinGrantMessage2: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 5,
  },
  coinGrantMessage3: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.accentApricot,
    textAlign: 'center',
    marginBottom: 20,
  },
  coinGrantModalButton: {
    width: '60%',
    marginTop: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default HomeScreen;