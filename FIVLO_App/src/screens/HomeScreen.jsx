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

// 개발용 API 서비스 임포트

const HomeScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [obooniState, setObooniState] = useState('default');

  const [coins, setCoins] = useState(0);
  const [showCoinGrantModal, setShowCoinGrantModal] = useState(false);
  
  // 수정: PhotoUploadModal 관련 상태 추가
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [taskForPhoto, setTaskForPhoto] = useState(null);

  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);
  const [isCompletingTask, setIsCompletingTask] = useState(false);

  const fetchTasks = async (dateToFetch) => {
    setIsLoadingTasks(true);
    try {
      const formattedDate = format(new Date(dateToFetch), 'yyyy-MM-dd');
      const data = await devGetTasksByDate(formattedDate);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks for date:", dateToFetch, error.message);
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchCoinBalance = async () => {
    setIsLoadingCoins(true);
    try {
      const data = await devGetCoinBalance();
      setCoins(data.coinBalance || 0);
    } catch (error) {
      console.error("Failed to fetch coin balance:", error.message);
      setCoins(0);
    } finally {
      setIsLoadingCoins(false);
    }
  };

  // 개발용 초기 데이터 설정
  useEffect(() => {
    const initializeDevData = async () => {
      try {
        await devInitializeData();
        console.log('개발용 초기 데이터가 설정되었습니다.');
      } catch (error) {
        console.error('개발용 초기 데이터 설정 실패:', error);
      }
    };
    
    // 개발 환경에서만 초기 데이터 설정
    if (__DEV__) {
      initializeDevData();
    }
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
      const response = await devCompleteTask(taskId);
      console.log("Task 완료 처리 성공:", response);

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, isCompleted: response.task.isCompleted, completedAt: response.task.completedAt } : task
        )
      );

      fetchCoinBalance();

      // 수정: 성장앨범 연동 로직 추가
      if (response.needsGrowthAlbumPhoto && isPremiumUser) {
        const taskForAlbum = tasks.find(t => t.id === taskId);
        setTaskForPhoto(taskForAlbum);
        setShowPhotoUploadModal(true);
      }

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

        {/* 코인/아이템 개수 표시 (검정 바탕 제외) */}
        {isPremiumUser && tasks.length > 0 && (
          <View style={styles.itemCountContainer}>
            <FontAwesome name="star" size={16} color={Colors.accentApricot} />
            <Text style={styles.itemCountText}>{tasks.length}개</Text>
          </View>
        )}

        {/* 오분이 캐릭터와 코인 표시 */}
        <View style={styles.characterContainer}>
          {/* 유료 사용자 코인 표시 */}
          {isPremiumUser && (
            <View style={styles.coinDisplayAboveCharacter}>
              <Text style={styles.coinDisplayText}>{coins}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleObooniPress} disabled={isLoadingTasks || isLoadingCoins || isCompletingTask}>
            <CharacterImage state={obooniState} style={styles.obooniCharacter} />
          </TouchableOpacity>
        </View>

        {/* 오늘의 일정 섹션 */}
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>오늘의 일정</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('TaskDetailModal', { 
                selectedDate: format(currentDate, 'yyyy-MM-dd'),
                onTaskUpdate: () => fetchTasks(currentDate),
                onTaskDelete: () => fetchTasks(currentDate),
              })}
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
                  <Text style={[styles.taskText, task.isCompleted && styles.taskTextCompleted]}>
                    할일
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noTaskContainer}>
              <Text style={styles.noTaskText}>오늘의 일정을 정해주세요!</Text>
            </View>
          )}
        </View>

        {/* 출석 보상 모달 */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showCoinGrantModal}
          onRequestClose={() => setShowCoinGrantModal(false)}
        >
          <View style={styles.attendanceModalOverlay}>
            <View style={styles.attendanceModalContent}>
              <View style={styles.attendanceCard}>
                <View style={styles.attendanceBadge}>
                  <Text style={styles.attendanceBadgeText}>7</Text>
                </View>
                <CharacterImage style={styles.attendanceObooni} />
                <Text style={styles.attendanceMessage1}>출석을 하셨네요</Text>
                <Text style={styles.attendanceMessage2}>오분이가 코인을 드리겠습니다</Text>
                <Text style={styles.attendanceMessage3}>오늘도 화이팅!!</Text>
              </View>
              <Button title="확인" onPress={() => setShowCoinGrantModal(false)} style={styles.attendanceModalButton} />
            </View>
          </View>
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
    marginTop: 20,
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
    marginBottom: 10,
  },
  messageText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 22,
  },
  // 아이템 개수 표시 (검정 바탕 제외)
  itemCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemCountText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginLeft: 5,
  },
  // 오분이 캐릭터 컨테이너
  characterContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  // 오분이 머리 위 코인 표시
  coinDisplayAboveCharacter: {
    position: 'absolute',
    top: -10,
    zIndex: 10,
    backgroundColor: Colors.textDark,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  coinDisplayText: {
    color: Colors.textLight,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
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
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
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
  // 출석 보상 모달 스타일
  attendanceModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  attendanceModalContent: {
    alignItems: 'center',
    width: '90%',
  },
  attendanceCard: {
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
    position: 'relative',
  },
  attendanceBadge: {
    position: 'absolute',
    top: -15,
    left: 20,
    backgroundColor: Colors.textDark,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  attendanceBadgeText: {
    color: Colors.textLight,
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
  },
  attendanceObooni: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  attendanceMessage1: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  attendanceMessage2: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  attendanceMessage3: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.accentApricot,
    textAlign: 'center',
    marginBottom: 20,
  },
  attendanceModalButton: {
    width: '60%',
    marginTop: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default HomeScreen;