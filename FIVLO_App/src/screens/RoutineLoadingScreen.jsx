// src/screens/RoutineLoadingScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';

const RoutineLoadingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { goalText, hasEndDate, noEndDate, selectedDate } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3초 후 로딩 완료
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBackToRoutine = () => {
    navigation.goBack();
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
          
          {/* 달성 기간 설정 */}
          <TouchableOpacity style={styles.checkboxRow}>
            <View style={[styles.checkbox, hasEndDate && styles.checkboxChecked]}>
              {hasEndDate && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>달성 기간 설정</Text>
          </TouchableOpacity>

          {/* 날짜 입력 필드들 */}
          <View style={styles.dateInputContainer}>
            <View style={styles.dateInput}>
              <Text style={selectedDate.year ? styles.dateText : styles.datePlaceholder}>
                {selectedDate.year || '____'}
              </Text>
              <Text style={styles.dateUnit}>년</Text>
            </View>
            
            <View style={styles.dateInput}>
              <Text style={selectedDate.month ? styles.dateText : styles.datePlaceholder}>
                {selectedDate.month || '____'}
              </Text>
              <Text style={styles.dateUnit}>월</Text>
            </View>
            
            <View style={styles.dateInput}>
              <Text style={selectedDate.day ? styles.dateText : styles.datePlaceholder}>
                {selectedDate.day || '____'}
              </Text>
              <Text style={styles.dateUnit}>일</Text>
            </View>
          </View>

          {/* 종료 기한 없이 지속 */}
          <TouchableOpacity style={styles.checkboxRow}>
            <View style={[styles.checkbox, noEndDate && styles.checkboxChecked]}>
              {noEndDate && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>종료 기한 없이 지속</Text>
          </TouchableOpacity>
        </View>

        {/* 맞춤일정 생성 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.generateButton} disabled={true}>
            <ActivityIndicator size="small" color={Colors.textDark} style={styles.loadingIcon} />
            <Text style={styles.generateButtonText}>오분이가 목표 달성을 위한 일정을 생성하고 있어요!</Text>
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
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    marginRight: 10,
  },
  generateButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
    flex: 1,
    textAlign: 'center',
  },
});

export default RoutineLoadingScreen;
