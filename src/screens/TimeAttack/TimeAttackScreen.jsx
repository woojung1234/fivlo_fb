// src/screens/TimeAttack/TimeAttackScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

const TimeAttackScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [customGoal, setCustomGoal] = useState('');

  // AI 추천 목표 (피그마 시안 기반)
  const aiRecommendedGoals = ["외출 준비", "식사 준비", "집 돌아와서 할 일"];

  const handleSelectGoal = (goalText) => {
    if (!goalText.trim()) {
      Alert.alert('알림', '목표를 선택하거나 입력해주세요.');
      return;
    }
    navigation.navigate('TimeAttackGoalSetting', { selectedGoal: goalText });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="타임어택 기능" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.title}>타임어택, 지금 바로 시작할까요?</Text>
        <Text style={styles.subtitle}>AI 추천 목표</Text>

        {/* AI 추천 목표 버튼들 */}
        {aiRecommendedGoals.map((goal, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.goalButton} 
            onPress={() => handleSelectGoal(goal)}
          >
            <Text style={styles.goalButtonText}>{goal}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.subtitle}>기타 목표 설정</Text>
        
        {/* 사용자 맞춤 설정 칸 */}
        <View style={styles.customGoalContainer}>
            <TextInput
                style={styles.customGoalInput}
                placeholder="직접 입력하기"
                placeholderTextColor={Colors.secondaryBrown}
                value={customGoal}
                onChangeText={setCustomGoal}
            />
            <Button
                title="시작"
                onPress={() => handleSelectGoal(customGoal)}
                style={styles.customGoalButton}
                textStyle={styles.customGoalButtonText}
                disabled={!customGoal.trim()}
            />
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
    scrollViewContentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: FontSizes.extraLarge,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        textAlign: 'center',
        marginBottom: 30,
    },
    subtitle: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        marginTop: 20,
        marginBottom: 15,
    },
    goalButton: {
        backgroundColor: Colors.textLight,
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 15,
        width: '100%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    goalButtonText: {
        fontSize: FontSizes.medium,
        fontWeight: FontWeights.medium,
        color: Colors.textDark,
    },
    customGoalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customGoalInput: {
        flex: 1,
        backgroundColor: Colors.textLight,
        borderRadius: 15,
        padding: 15,
        fontSize: FontSizes.medium,
        color: Colors.textDark,
    },
    customGoalButton: {
        width: 80,
        marginLeft: 10,
        paddingVertical: 18,
    },
    customGoalButtonText: {
        fontSize: FontSizes.medium
    }
});

export default TimeAttackScreen;