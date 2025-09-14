// src/screens/GoalDetailScreenV2.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

const GoalDetailScreenV2 = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [goalText, setGoalText] = useState('');
  const [noEndDate, setNoEndDate] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ year: '', month: '', day: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleGenerateSchedule = () => {
    if (!goalText.trim()) {
      Alert.alert('알림', '목표를 입력해주세요.');
      return;
    }

    if (!noEndDate && !hasEndDate) {
      Alert.alert('알림', '목표 달성 기간을 선택해주세요.');
      return;
    }

    if (hasEndDate && (!selectedDate.year || !selectedDate.month || !selectedDate.day)) {
      Alert.alert('알림', '목표 달성 기간을 설정해주세요.');
      return;
    }

    // AI 일정 생성 화면으로 이동
    navigation.navigate('GoalScheduleGeneration', {
      goalText,
      noEndDate,
      hasEndDate,
      selectedDate
    });
  };

  const handleDateInput = (type, value) => {
    setSelectedDate(prev => ({ ...prev, [type]: value }));
  };

  const toggleNoEndDate = () => {
    setNoEndDate(!noEndDate);
    if (!noEndDate) {
      setHasEndDate(false);
    }
  };

  const toggleHasEndDate = () => {
    setHasEndDate(!hasEndDate);
    if (!hasEndDate) {
      setNoEndDate(false);
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="목표 세부설정" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 목표 입력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 입력</Text>
          <TextInput
            style={styles.textInput}
            value={goalText}
            onChangeText={setGoalText}
            placeholder="달성하고자 하는 목표를 자유롭게 입력해주세요. (ex. 매일 아침 6시 기상, 매일 운동 30분 하기)"
            placeholderTextColor={Colors.secondaryBrown}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 목표 달성 기간 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>목표 달성 기한</Text>
          
          {/* 종료 기한 없음 */}
          <TouchableOpacity style={styles.checkboxRow} onPress={toggleNoEndDate}>
            <View style={[styles.checkbox, noEndDate && styles.checkboxChecked]}>
              {noEndDate && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>특정 기한 없음</Text>
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

          {/* 매주 반복 */}
          <TouchableOpacity style={styles.checkboxRow} onPress={toggleHasEndDate}>
            <View style={[styles.checkbox, hasEndDate && styles.checkboxChecked]}>
              {hasEndDate && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>매주 1회 이상이어야</Text>
          </TouchableOpacity>
        </View>

        {/* 맞춤일정 생성 버튼 */}
        <View style={styles.buttonContainer}>
          <Button 
            title="목표 설정 완료하기" 
            onPress={handleGenerateSchedule}
            style={styles.generateButton}
          />
        </View>
      </ScrollView>

      {/* 날짜 선택 모달 */}
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>목표 달성 기간 설정</Text>
            
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
  buttonContainer: {
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: Colors.accentApricot,
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

export default GoalDetailScreenV2;
