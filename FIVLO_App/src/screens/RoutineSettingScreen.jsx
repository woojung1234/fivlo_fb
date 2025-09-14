// src/screens/RoutineSettingScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';

const RoutineSettingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [goalText, setGoalText] = useState('');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [noEndDate, setNoEndDate] = useState(true);
  const [selectedDate, setSelectedDate] = useState({ year: '', month: '', day: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRecommendedSchedule, setShowRecommendedSchedule] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState({
    task1: false,
    task2: false,
    task3: false,
  });

  const handleGenerateSchedule = () => {
    if (!goalText.trim()) {
      Alert.alert('알림', '목표를 입력해주세요.');
      return;
    }

    if (hasEndDate && (!selectedDate.year || !selectedDate.month || !selectedDate.day)) {
      Alert.alert('알림', '목표 달성 기간을 설정해주세요.');
      return;
    }

    // 로딩 상태로 이동
    navigation.navigate('RoutineLoading', {
      goalText,
      hasEndDate,
      noEndDate,
      selectedDate
    });
  };

  const handleDateInput = (type, value) => {
    setSelectedDate(prev => ({ ...prev, [type]: value }));
  };

  const toggleHasEndDate = () => {
    setHasEndDate(!hasEndDate);
    if (!hasEndDate) {
      setNoEndDate(false);
    } else {
      setNoEndDate(true);
    }
  };

  const toggleNoEndDate = () => {
    setNoEndDate(!noEndDate);
    if (!noEndDate) {
      setHasEndDate(false);
    } else {
      setHasEndDate(true);
    }
  };

  const toggleTask = (taskKey) => {
    setSelectedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  const handleSave = () => {
    const selectedTasksList = Object.values(selectedTasks).filter(Boolean);
    if (selectedTasksList.length === 0) {
      Alert.alert('알림', '최소 하나의 할일을 선택해주세요.');
      return;
    }

    Alert.alert('완료', '루틴이 저장되었습니다!', [
      { text: '확인', onPress: () => navigation.navigate('Main') }
    ]);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="목표 세분화" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 목표 입력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 입력</Text>
          <TextInput
            style={styles.textInput}
            value={goalText}
            onChangeText={setGoalText}
            placeholder="달성하고자 하는 목표를 작성해주세요. Ex. TOEIC 800점 이상, 매일 운동하기 등"
            placeholderTextColor={Colors.secondaryBrown}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 목표 달성 기간 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 달성 기간</Text>
          
          {/* 달성 기간 설정 */}
          <TouchableOpacity style={styles.checkboxRow} onPress={toggleHasEndDate}>
            <View style={[styles.checkbox, hasEndDate && styles.checkboxChecked]}>
              {hasEndDate && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>달성 기간 설정</Text>
          </TouchableOpacity>

          {/* 날짜 입력 필드들 */}
          <View style={styles.dateInputContainer}>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={selectedDate.year ? styles.dateText : styles.datePlaceholder}>
                {selectedDate.year || '____'}
              </Text>
              <Text style={styles.dateUnit}>년</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={selectedDate.month ? styles.dateText : styles.datePlaceholder}>
                {selectedDate.month || '____'}
              </Text>
              <Text style={styles.dateUnit}>월</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={selectedDate.day ? styles.dateText : styles.datePlaceholder}>
                {selectedDate.day || '____'}
              </Text>
              <Text style={styles.dateUnit}>일</Text>
            </TouchableOpacity>
          </View>

          {/* 종료 기한 없이 지속 */}
          <TouchableOpacity style={styles.checkboxRow} onPress={toggleNoEndDate}>
            <View style={[styles.checkbox, noEndDate && styles.checkboxChecked]}>
              {noEndDate && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>종료 기한 없이 지속</Text>
          </TouchableOpacity>
        </View>

        {/* 추천 일정 섹션 (조건부 표시) */}
        {showRecommendedSchedule && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>오분이가 추천하는 1달 반복 일정</Text>
            
            <View style={styles.scheduleCard}>
              <TouchableOpacity 
                style={styles.scheduleItem}
                onPress={() => toggleTask('task1')}
              >
                <View style={[styles.checkbox, selectedTasks.task1 && styles.checkboxChecked]}>
                  {selectedTasks.task1 && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.scheduleText}>할일</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.scheduleItem}
                onPress={() => toggleTask('task2')}
              >
                <View style={[styles.checkbox, selectedTasks.task2 && styles.checkboxChecked]}>
                  {selectedTasks.task2 && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.scheduleText}>할일</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.scheduleItem}
                onPress={() => toggleTask('task3')}
              >
                <View style={[styles.checkbox, selectedTasks.task3 && styles.checkboxChecked]}>
                  {selectedTasks.task3 && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.scheduleText}>할일</Text>
              </TouchableOpacity>
            </View>

            {/* 저장 버튼 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 맞춤일정 생성 버튼 */}
        {!showRecommendedSchedule && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateSchedule}>
              <Text style={styles.generateButtonText}>맞춤일정 생성하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 날짜 선택 모달 */}
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>날짜 설정</Text>
            
            <View style={styles.datePickerContent}>
              <View style={styles.dateColumn}>
                <Text style={styles.dateColumnTitle}>년</Text>
                <ScrollView style={styles.dateScrollView}>
                  {Array.from({ length: 10 }, (_, i) => 2024 + i).map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.dateOption,
                        selectedDate.year === year.toString() && styles.dateOptionSelected
                      ]}
                      onPress={() => handleDateInput('year', year.toString())}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        selectedDate.year === year.toString() && styles.dateOptionTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateColumn}>
                <Text style={styles.dateColumnTitle}>월</Text>
                <ScrollView style={styles.dateScrollView}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.dateOption,
                        selectedDate.month === month.toString() && styles.dateOptionSelected
                      ]}
                      onPress={() => handleDateInput('month', month.toString())}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        selectedDate.month === month.toString() && styles.dateOptionTextSelected
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateColumn}>
                <Text style={styles.dateColumnTitle}>일</Text>
                <ScrollView style={styles.dateScrollView}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dateOption,
                        selectedDate.day === day.toString() && styles.dateOptionSelected
                      ]}
                      onPress={() => handleDateInput('day', day.toString())}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        selectedDate.day === day.toString() && styles.dateOptionTextSelected
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.datePickerButtons}>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  textInput: {
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.primaryBeige,
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
  checkboxChecked: {
    backgroundColor: Colors.accentApricot,
    borderColor: Colors.accentApricot,
  },
  checkmark: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
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
  dateText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
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
    marginBottom: 20,
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
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: Colors.accentApricot,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
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
  // 날짜 선택 모달 스타일
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  datePickerContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  datePickerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerContent: {
    flexDirection: 'row',
    height: 200,
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateColumnTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  dateScrollView: {
    flex: 1,
  },
  dateOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 2,
  },
  dateOptionSelected: {
    backgroundColor: Colors.accentApricot,
  },
  dateOptionText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
  },
  dateOptionTextSelected: {
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  datePickerButton: {
    backgroundColor: Colors.accentApricot,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  datePickerButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
});

export default RoutineSettingScreen;