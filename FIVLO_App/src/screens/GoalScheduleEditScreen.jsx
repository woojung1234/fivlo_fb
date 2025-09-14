// src/screens/GoalScheduleEditScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';

const GoalScheduleEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { goalText, generatedSchedule, onSave } = route.params;
  const [editedSchedule, setEditedSchedule] = useState(generatedSchedule);

  const handleSave = () => {
    onSave(editedSchedule);
    navigation.goBack();
  };

  const updateTask = (taskId, newTitle, weekIndex = null) => {
    if (editedSchedule.type === 'daily') {
      setEditedSchedule(prev => ({
        ...prev,
        schedule: prev.schedule.map(task => 
          task.id === taskId ? { ...task, title: newTitle } : task
        )
      }));
    } else {
      setEditedSchedule(prev => ({
        ...prev,
        schedule: prev.schedule.map((week, index) => 
          index === weekIndex ? {
            ...week,
            tasks: week.tasks.map(task => 
              task.id === taskId ? { ...task, title: newTitle } : task
            )
          } : week
        )
      }));
    }
  };

  const addNewTask = (weekIndex = null) => {
    if (editedSchedule.type === 'daily') {
      const newId = Math.max(...editedSchedule.schedule.map(t => t.id)) + 1;
      setEditedSchedule(prev => ({
        ...prev,
        schedule: [...prev.schedule, { id: newId, title: '새로운 일정', completed: false }]
      }));
    } else {
      const newId = Math.max(...editedSchedule.schedule[weekIndex].tasks.map(t => t.id)) + 1;
      setEditedSchedule(prev => ({
        ...prev,
        schedule: prev.schedule.map((week, index) => 
          index === weekIndex ? {
            ...week,
            tasks: [...week.tasks, { id: newId, title: '새로운 일정', completed: false }]
          } : week
        )
      }));
    }
  };

  const removeTask = (taskId, weekIndex = null) => {
    if (editedSchedule.type === 'daily') {
      setEditedSchedule(prev => ({
        ...prev,
        schedule: prev.schedule.filter(task => task.id !== taskId)
      }));
    } else {
      setEditedSchedule(prev => ({
        ...prev,
        schedule: prev.schedule.map((week, index) => 
          index === weekIndex ? {
            ...week,
            tasks: week.tasks.filter(task => task.id !== taskId)
          } : week
        )
      }));
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="목표 세분화" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 목표 입력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 입력</Text>
          <View style={styles.goalDisplay}>
            <Text style={styles.goalText}>{goalText}</Text>
          </View>
        </View>

        {/* 목표 달성 기간 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 달성 기간</Text>
          <View style={styles.periodDisplay}>
            <Text style={styles.periodText}>
              {editedSchedule.type === 'daily' ? '종료 기한 없이 지속' : '달성 기간 설정'}
            </Text>
          </View>
        </View>

        {/* 수정 가능한 일정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오분이가 추천하는 일정</Text>
          
          {editedSchedule.type === 'daily' ? (
            <View style={styles.scheduleCard}>
              {editedSchedule.schedule.map((item) => (
                <View key={item.id} style={styles.taskItem}>
                  <TextInput
                    style={styles.taskInput}
                    value={item.title}
                    onChangeText={(text) => updateTask(item.id, text)}
                    placeholder="일정을 입력하세요"
                  />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeTask(item.id)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.addTaskButton}
                onPress={() => addNewTask()}
              >
                <Text style={styles.addTaskButtonText}>+ 일정 추가</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.weeklySchedule}>
              {editedSchedule.schedule.map((week, weekIndex) => (
                <View key={week.week} style={styles.weekCard}>
                  <Text style={styles.weekTitle}>{week.title}</Text>
                  {week.tasks.map((task) => (
                    <View key={task.id} style={styles.taskItem}>
                      <TextInput
                        style={styles.taskInput}
                        value={task.title}
                        onChangeText={(text) => updateTask(task.id, text, weekIndex)}
                        placeholder="일정을 입력하세요"
                      />
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeTask(task.id, weekIndex)}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={styles.addTaskButton}
                    onPress={() => addNewTask(weekIndex)}
                  >
                    <Text style={styles.addTaskButtonText}>+ 일정 추가</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 저장 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  goalDisplay: {
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
  },
  goalText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    lineHeight: 22,
  },
  periodDisplay: {
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
  },
  periodText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  scheduleCard: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
  },
  weeklySchedule: {
    gap: 15,
  },
  weekCard: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
  },
  weekTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskInput: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 8,
    padding: 12,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 18,
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  addTaskButton: {
    backgroundColor: Colors.accentApricot,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addTaskButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.primaryBeige,
  },
  saveButton: {
    backgroundColor: Colors.accentApricot,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
});

export default GoalScheduleEditScreen;
