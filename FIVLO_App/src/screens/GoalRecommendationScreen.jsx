// src/screens/GoalRecommendationScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';

const GoalRecommendationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { goalText, noEndDate, hasEndDate, selectedDate } = route.params;
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const days = [
    { key: 'monday', label: '월요일' },
    { key: 'tuesday', label: '화요일' },
    { key: 'wednesday', label: '수요일' },
    { key: 'thursday', label: '목요일' },
    { key: 'friday', label: '금요일' },
    { key: 'saturday', label: '토요일' },
    { key: 'sunday', label: '일요일' },
  ];

  const toggleDay = (dayKey) => {
    setSelectedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  const handleAddToTask = () => {
    const selectedDaysList = days.filter(day => selectedDays[day.key]);
    if (selectedDaysList.length === 0) {
      Alert.alert('알림', '최소 하나의 요일을 선택해주세요.');
      return;
    }

    Alert.alert('완료', 'TASK에 추가되었습니다!', [
      { text: '확인', onPress: () => navigation.navigate('Main') }
    ]);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="목록 세부 정보" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 목표 입력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목록 입력</Text>
          <View style={styles.goalDisplay}>
            <Text style={styles.goalText}>{goalText}</Text>
          </View>
        </View>

        {/* 목표 달성 기간 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목록 실행 기간</Text>
          
          {/* 실행 기간 없음 */}
          <TouchableOpacity style={styles.checkboxRow}>
            <View style={[styles.checkbox, styles.checkboxUnchecked]}>
              <Text style={styles.checkboxText}>☐</Text>
            </View>
            <Text style={styles.checkboxLabel}>실행 기간 없음</Text>
          </TouchableOpacity>

          {/* 날짜 입력 필드들 */}
          <View style={styles.dateInputContainer}>
            <View style={styles.dateInput}>
              <Text style={styles.datePlaceholder}>____</Text>
              <Text style={styles.dateUnit}>년</Text>
            </View>
            
            <View style={styles.dateInput}>
              <Text style={styles.datePlaceholder}>____</Text>
              <Text style={styles.dateUnit}>월</Text>
            </View>
            
            <View style={styles.dateInput}>
              <Text style={styles.datePlaceholder}>____</Text>
              <Text style={styles.dateUnit}>일</Text>
            </View>
          </View>

          {/* 매주 기간 반복 */}
          <TouchableOpacity style={styles.checkboxRow}>
            <View style={[styles.checkbox, styles.checkboxChecked]}>
              <Text style={styles.checkboxText}>☑</Text>
            </View>
            <Text style={styles.checkboxLabel}>매주 기간 반복</Text>
          </TouchableOpacity>
        </View>

        {/* 오분이가 추천하는 7일 반복 일정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오분이가 추천하는 7일 반복 일정</Text>
          
          <View style={styles.scheduleCard}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={styles.scheduleItem}
                onPress={() => toggleDay(day.key)}
              >
                <View style={[styles.checkbox, selectedDays[day.key] && styles.checkboxSelected]}>
                  <Text style={styles.checkboxText}>
                    {selectedDays[day.key] ? '☑' : '☐'}
                  </Text>
                </View>
                <Text style={styles.scheduleText}>{day.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* TASK에 추가하기 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToTask}>
          <FontAwesome5 name="plus" size={16} color={Colors.textLight} />
          <Text style={styles.addButtonText}>TASK에 추가하기</Text>
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: Colors.textLight,
  },
  checkboxUnchecked: {
    backgroundColor: Colors.textLight,
  },
  checkboxChecked: {
    backgroundColor: Colors.accentApricot,
    borderColor: Colors.accentApricot,
  },
  checkboxSelected: {
    backgroundColor: Colors.accentApricot,
    borderColor: Colors.accentApricot,
  },
  checkboxText: {
    fontSize: 12,
    color: Colors.textDark,
  },
  checkboxLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.primaryBeige,
  },
  datePlaceholder: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
  },
  dateUnit: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginLeft: 5,
  },
  scheduleCard: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.primaryBeige,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentApricot,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
    marginLeft: 8,
  },
});

export default GoalRecommendationScreen;
