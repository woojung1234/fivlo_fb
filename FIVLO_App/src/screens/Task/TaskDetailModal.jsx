import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';

const TaskDetailModal = ({
  selectedDate,
  tasks,
  categories,
  onClose,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
}) => {
  const navigation = useNavigation();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    categoryId: 'daily',
    repeatDaily: false,
    linkToAlbum: false,
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    return `${month}월 ${day}일(${weekDay})`;
  };

  const handleAddTaskSubmit = () => {
    if (!newTask.title.trim()) {
      Alert.alert('알림', '할 일 내용을 입력해주세요.');
      return;
    }

    onAddTask(newTask);
    setNewTask({
      title: '',
      categoryId: 'daily',
      repeatDaily: false,
      linkToAlbum: false,
    });
    setShowAddTask(false);
  };

  const handleTaskSwipe = (task, direction) => {
    if (direction === 'left') {
      // 수정
      onEditTask(task);
    } else if (direction === 'right') {
      // 삭제
      onDeleteTask(task);
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : categories[0].color;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categories[0].name;
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{formatDate(selectedDate)}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>아직 등록된 할 일이 없습니다.</Text>
            </View>
          ) : (
            <View style={styles.tasksList}>
              {tasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <TouchableOpacity
                    style={styles.taskContent}
                    onPress={() => {
                      if (task.linkToAlbum && !task.completed) {
                        // 성장앨범 연동이 체크된 경우 성장앨범 화면으로 이동
                        navigation.navigate('GrowthAlbum', { taskData: task });
                      } else {
                        onToggleComplete(task.id);
                        
                        // 모든 Task가 완료되었는지 확인
                        const updatedTasks = tasks.map(t => 
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        );
                        const allCompleted = updatedTasks.every(t => t.completed);
                        if (allCompleted && updatedTasks.length > 0) {
                          setShowCompleteModal(true);
                        }
                      }
                    }}
                  >
                    <View style={styles.taskLeft}>
                      <View style={[
                        styles.checkbox,
                        task.completed && styles.checkedBox
                      ]}>
                        {task.completed && (
                          <FontAwesome5 name="check" size={12} color={Colors.textLight} />
                        )}
                      </View>
                      <View style={styles.taskInfo}>
                        <Text style={[
                          styles.taskTitle,
                          task.completed && styles.completedTaskTitle
                        ]}>
                          {task.title}
                        </Text>
                        <Text style={styles.taskCategory}>
                          {getCategoryName(task.categoryId)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onEditTask(task)}
                      >
                        <FontAwesome5 name="bars" size={16} color={Colors.textDark} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onDeleteTask(task)}
                      >
                        <FontAwesome5 name="trash" size={16} color={Colors.textDark} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* 할 일 추가 버튼 */}
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => setShowAddTask(true)}
        >
          <FontAwesome5 name="plus" size={16} color={Colors.textDark} />
          <Text style={styles.addTaskText}>할 일을 추가하세요</Text>
        </TouchableOpacity>

        {/* 할 일 추가 폼 */}
        {showAddTask && (
          <View style={styles.addTaskForm}>
            <TextInput
              style={styles.taskInput}
              placeholder="내용을 입력해주세요."
              placeholderTextColor={Colors.secondaryBrown}
              value={newTask.title}
              onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
              autoFocus={true}
            />
            
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>카테고리 설정</Text>
              <View style={styles.categoryButtons}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      newTask.categoryId === category.id && styles.selectedCategoryButton
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, categoryId: category.id }))}
                  >
                    <View style={[
                      styles.categoryColor,
                      { backgroundColor: category.color }
                    ]} />
                    <Text style={[
                      styles.categoryText,
                      newTask.categoryId === category.id && styles.selectedCategoryText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.addCategoryButton}>
                  <FontAwesome5 name="plus" size={16} color={Colors.textDark} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.checkboxSection}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setNewTask(prev => ({ ...prev, repeatDaily: !prev.repeatDaily }))}
              >
                <View style={[
                  styles.checkbox,
                  newTask.repeatDaily && styles.checkedBox
                ]}>
                  {newTask.repeatDaily && (
                    <FontAwesome5 name="check" size={12} color={Colors.textLight} />
                  )}
                </View>
                <Text style={styles.checkboxText}>매일 반복</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setNewTask(prev => ({ ...prev, linkToAlbum: !prev.linkToAlbum }))}
              >
                <View style={[
                  styles.checkbox,
                  newTask.linkToAlbum && styles.checkedBox
                ]}>
                  {newTask.linkToAlbum && (
                    <FontAwesome5 name="check" size={12} color={Colors.textLight} />
                  )}
                </View>
                <Text style={styles.checkboxText}>설정값별 연동</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formButtons}>
              <Button
                title="취소"
                onPress={() => setShowAddTask(false)}
                style={styles.cancelButton}
              />
              <Button
                title="Task 입력하기"
                onPress={handleAddTaskSubmit}
                style={styles.submitButton}
              />
            </View>
          </View>
        )}
      </View>

      {/* 일일 Task 완료 코인 지급 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCompleteModal}
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={styles.completeModalOverlay}>
          <View style={styles.completeModalContent}>
            <View style={styles.obooniContainer}>
              <Image
                source={require('../../../assets/images/obooni_happy.png')}
                style={styles.obooniImage}
              />
              <View style={styles.coinContainer}>
                <Text style={styles.coinText}>7</Text>
              </View>
            </View>
            
            <Text style={styles.completeTitle}>일일 TASK를 완료했습니다.</Text>
            <Text style={styles.completeSubtitle}>오분이가 코인을 드리겠습니다</Text>
            <Text style={styles.completeMessage}>고생하셨습니다.</Text>
            
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => setShowCompleteModal(false)}
            >
              <Text style={styles.completeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textLight,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
  tasksList: {
    paddingVertical: 20,
  },
  taskItem: {
    marginBottom: 10,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkedBox: {
    backgroundColor: Colors.primaryBeige,
    borderColor: Colors.primaryBeige,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginBottom: 5,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskCategory: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    marginLeft: 5,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  addTaskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginLeft: 10,
  },
  addTaskForm: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.textLight,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginBottom: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primaryBeige,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
  },
  selectedCategoryText: {
    fontWeight: FontWeights.bold,
  },
  addCategoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSection: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginLeft: 10,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: Colors.textLight,
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: Colors.primaryBeige,
  },
  // 코인 지급 모달 스타일
  completeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeModalContent: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    maxWidth: 350,
  },
  obooniContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  obooniImage: {
    width: 120,
    height: 120,
  },
  coinContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: Colors.textDark,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinText: {
    color: Colors.textLight,
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
  },
  completeTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  completeSubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 5,
  },
  completeMessage: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  completeButton: {
    backgroundColor: Colors.textDark,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  completeButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
  },
});

export default TaskDetailModal;