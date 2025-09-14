// src/screens/GoalScheduleGenerationScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

const GoalScheduleGenerationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { goalText, noEndDate, hasEndDate, selectedDate } = route.params;
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedSchedule, setGeneratedSchedule] = useState(null);

  useEffect(() => {
    // AI 일정 생성 시뮬레이션 (3초 후 완료)
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSchedule(generateMockSchedule());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const generateMockSchedule = () => {
    if (noEndDate) {
      // 종료 기한 없음 - 매일 반복 일정
      return {
        type: 'daily',
        schedule: [
          { id: 1, title: '매일 아침 6시 기상', completed: false },
          { id: 2, title: '매일 30분 운동하기', completed: false },
          { id: 3, title: '매일 2시간 공부하기', completed: false },
        ]
      };
    } else {
      // 기간 설정 - 주차별 일정
      return {
        type: 'weekly',
        schedule: [
          {
            week: 1,
            title: '1주차',
            tasks: [
              { id: 1, title: '기본기 다지기 - 매일 1시간 공부', completed: false },
              { id: 2, title: '운동 루틴 시작 - 주 3회', completed: false },
              { id: 3, title: '아침 기상 루틴 - 매일 6시', completed: false },
            ]
          },
          {
            week: 2,
            title: '2주차',
            tasks: [
              { id: 4, title: '학습량 증가 - 매일 2시간 공부', completed: false },
              { id: 5, title: '운동 강도 높이기 - 주 4회', completed: false },
              { id: 6, title: '복습 시간 확보 - 매일 30분', completed: false },
            ]
          }
        ]
      };
    }
  };

  const handleAddToTask = () => {
    // TASK에 추가하는 로직
    Alert.alert('완료', 'TASK에 추가되었습니다!', [
      { text: '확인', onPress: () => navigation.navigate('Main') }
    ]);
  };

  const handleEditSchedule = () => {
    navigation.navigate('GoalScheduleEdit', {
      goalText,
      generatedSchedule,
      onSave: (updatedSchedule) => {
        setGeneratedSchedule(updatedSchedule);
      }
    });
  };

  if (isGenerating) {
    return (
      <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
        <Header title="목표 세부설정" showBackButton={true} />
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingTitle}>목표 입력</Text>
            <View style={styles.goalDisplay}>
              <Text style={styles.goalText}>{goalText}</Text>
            </View>

            <Text style={styles.loadingTitle}>목표 달성 기간</Text>
            <View style={styles.periodDisplay}>
              {noEndDate ? (
                <Text style={styles.periodText}>종료 기한 없이 지속</Text>
              ) : (
                <Text style={styles.periodText}>
                  {selectedDate.year}년 {selectedDate.month}월 {selectedDate.day}일까지
                </Text>
              )}
            </View>

            <View style={styles.generationContainer}>
              <Button 
                title="루틴 자동 생성하기" 
                onPress={() => {}}
                style={styles.generateButton}
                disabled={true}
              />
              
              <View style={styles.loadingMessage}>
                <ActivityIndicator size="small" color={Colors.accentApricot} />
                <Text style={styles.loadingText}>오분이가 목표 달성을 위한 일정을 생성하고 있어요!</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="목표 세부설정" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 목표 입력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 정의</Text>
          <View style={styles.goalDisplay}>
            <Text style={styles.goalText}>{goalText}</Text>
          </View>
        </View>

        {/* 목표 달성 기간 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 달성 기간</Text>
          <View style={styles.periodDisplay}>
            {noEndDate ? (
              <Text style={styles.periodText}>기간 설정 안함</Text>
            ) : (
              <Text style={styles.periodText}>
                {selectedDate.year}년 {selectedDate.month}월 {selectedDate.day}일까지
              </Text>
            )}
          </View>
        </View>

        {/* 추천 일정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {noEndDate ? '오분이가 추천하는 반복일정' : '오분이가 추천하는 일정'}
          </Text>
          
          {generatedSchedule?.type === 'daily' ? (
            <View style={styles.scheduleCard}>
              {generatedSchedule.schedule.map((item) => (
                <View key={item.id} style={styles.scheduleItem}>
                  <View style={styles.checkbox}>
                    <Text style={styles.checkboxText}>☐</Text>
                  </View>
                  <Text style={styles.scheduleText}>{item.title}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.weeklySchedule}>
              {generatedSchedule?.schedule.map((week) => (
                <View key={week.week} style={styles.weekCard}>
                  <Text style={styles.weekTitle}>{week.title}</Text>
                  {week.tasks.map((task) => (
                    <View key={task.id} style={styles.scheduleItem}>
                      <View style={styles.checkbox}>
                        <Text style={styles.checkboxText}>☐</Text>
                      </View>
                      <Text style={styles.scheduleText}>{task.title}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditSchedule}>
            <FontAwesome5 name="edit" size={16} color={Colors.textDark} />
            <Text style={styles.editButtonText}>수정</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddToTask}>
            <FontAwesome5 name="plus" size={16} color={Colors.textLight} />
            <Text style={styles.addButtonText}>TASK에 추가하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
  },
  loadingTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  goalDisplay: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  goalText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    lineHeight: 22,
  },
  periodDisplay: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  periodText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  generationContainer: {
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: Colors.accentApricot,
    marginBottom: 20,
  },
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginLeft: 10,
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
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  scheduleText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  editButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentApricot,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
    marginLeft: 8,
  },
});

export default GoalScheduleGenerationScreen;
