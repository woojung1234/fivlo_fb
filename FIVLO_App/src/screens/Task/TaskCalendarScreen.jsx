import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Header from '../../components/common/Header';
import TaskDetailModal from './TaskDetailModal';
import TaskEditModal from './TaskEditModal';
import TaskDeleteConfirmModal from './TaskDeleteConfirmModal';

const { width } = Dimensions.get('window');

const TaskCalendarScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // 기본 카테고리 (일상)
  const [categories] = useState([
    { id: 'daily', name: '일상', color: '#8B4513' }
  ]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // 이전 달의 빈 날짜들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const getDateKey = (date) => {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getTasksForDate = (date) => {
    const dateKey = getDateKey(date);
    return tasks[dateKey] || [];
  };

  const handleDatePress = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setShowTaskDetail(true);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleAddTask = (taskData) => {
    const dateKey = getDateKey(selectedDate);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask]
    }));
    
    setShowTaskDetail(false);
  };

  const handleEditTask = (taskData) => {
    const dateKey = getDateKey(selectedDate);
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task => 
        task.id === editingTask.id ? { ...task, ...taskData } : task
      )
    }));
    
    setShowTaskEdit(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    const dateKey = getDateKey(selectedDate);
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(task => task.id !== taskId)
    }));
    
    setShowDeleteConfirm(false);
    setEditingTask(null);
  };

  const handleToggleTaskComplete = (taskId) => {
    const dateKey = getDateKey(selectedDate);
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
    
    // 모든 태스크 완료 확인
    const updatedTasks = tasks[dateKey].map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    const allCompleted = updatedTasks.every(task => task.completed);
    if (allCompleted && updatedTasks.length > 0) {
      // 모든 태스크 완료 시 코인 지급 모달 표시
      setTimeout(() => {
        Alert.alert(
          '일일 TASK 완료!',
          '오분이가 코인을 드리겠습니다\n고생하셨습니다.',
          [{ text: '확인' }]
        );
      }, 500);
    }
  };

  const handleEditTaskPress = (task) => {
    setEditingTask(task);
    setShowTaskEdit(true);
  };

  const handleDeleteTaskPress = (task) => {
    setEditingTask(task);
    setShowDeleteConfirm(true);
  };

  const renderCalendarDay = (date, index) => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }
    
    const dayTasks = getTasksForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          isToday && styles.todayDay,
          isSelected && styles.selectedDay
        ]}
        onPress={() => handleDatePress(date)}
      >
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          isSelected && styles.selectedText
        ]}>
          {date.getDate()}
        </Text>
        
        {/* 태스크 표시 - 이미지처럼 작은 사각형으로 */}
        <View style={styles.taskIndicators}>
          {dayTasks.slice(0, 4).map((task, taskIndex) => {
            const category = categories.find(cat => cat.id === task.categoryId) || categories[0];
            return (
              <View
                key={taskIndex}
                style={[
                  styles.taskIndicator,
                  { backgroundColor: category.color }
                ]}
              />
            );
          })}
          {dayTasks.length > 4 && (
            <Text style={styles.moreTasksText}>+{dayTasks.length - 4}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    
    return (
      <View style={styles.calendarContainer}>
        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>
        
        {/* 달력 그리드 */}
        <View style={styles.calendarGrid}>
          {days.map((date, index) => renderCalendarDay(date, index))}
        </View>
      </View>
    );
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <Header title="task" showBackButton={true} />
      
      <ScrollView style={styles.content}>
        {/* 월 선택 헤더 */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthButton}>
            <FontAwesome5 name="chevron-left" size={20} color={Colors.textDark} />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </Text>
          
          <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
            <FontAwesome5 name="chevron-right" size={20} color={Colors.textDark} />
          </TouchableOpacity>
        </View>
        
        {renderCalendar()}
      </ScrollView>
      
      {/* 태스크 상세 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTaskDetail}
        onRequestClose={() => setShowTaskDetail(false)}
      >
        <TaskDetailModal
          selectedDate={selectedDate}
          tasks={getTasksForDate(selectedDate)}
          categories={categories}
          onClose={() => setShowTaskDetail(false)}
          onAddTask={handleAddTask}
          onEditTask={handleEditTaskPress}
          onDeleteTask={handleDeleteTaskPress}
          onToggleComplete={handleToggleTaskComplete}
        />
      </Modal>
      
      {/* 태스크 수정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTaskEdit}
        onRequestClose={() => setShowTaskEdit(false)}
      >
        <TaskEditModal
          task={editingTask}
          categories={categories}
          onClose={() => setShowTaskEdit(false)}
          onSave={handleEditTask}
          onDelete={() => {
            setShowTaskEdit(false);
            setShowDeleteConfirm(true);
          }}
        />
      </Modal>
      
      {/* 삭제 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <TaskDeleteConfirmModal
          task={editingTask}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => handleDeleteTask(editingTask?.id)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 5,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  monthButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.textLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthText: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  calendarContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 5,
    marginBottom: 5,
    marginHorizontal: 0,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    paddingVertical: 10,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBeige,
    position: 'relative',
  },
  emptyDay: {
    width: '14.28%',
    height: 500,
  },
  todayDay: {
    backgroundColor: Colors.primaryBeige,
  },
  selectedDay: {
    backgroundColor: Colors.accentApricot,
  },
  dayText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  todayText: {
    fontWeight: FontWeights.bold,
  },
  selectedText: {
    fontWeight: FontWeights.bold,
  },
  taskIndicators: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  taskIndicator: {
    width: 8,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  moreTasksText: {
    fontSize: 8,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
});

export default TaskCalendarScreen;