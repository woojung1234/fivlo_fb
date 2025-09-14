// src/screens/TimeAttack/TimeAttackScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

const TimeAttackScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [customGoal, setCustomGoal] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // AI 추천 목표 (이미지 기반)
  const aiRecommendedGoals = ["외출 준비", "식사 준비", "집 정리하기"];

  const handleSelectGoal = (goalText) => {
    if (!goalText.trim()) {
      Alert.alert('알림', '목표를 선택하거나 입력해주세요.');
      return;
    }
    navigation.navigate('TimeAttackGoalSetting', { selectedGoal: goalText });
  };

  const handleCustomGoalSubmit = () => {
    if (!customGoal.trim()) {
      Alert.alert('알림', '목적을 입력해주세요.');
      return;
    }
    setShowCustomModal(false);
    navigation.navigate('TimeAttackGoalSetting', { selectedGoal: customGoal });
    setCustomGoal('');
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="타임어택 기능" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.title}>타임어택 사용 목적이 무엇인가요?</Text>

        {/* AI 추천 목표 버튼들 */}
        {aiRecommendedGoals.map((goal, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.goalButton} 
            onPress={() => handleSelectGoal(goal)}
          >
            <Text style={styles.goalButtonText}>{goal}</Text>
            <TouchableOpacity style={styles.removeButton}>
              <FontAwesome5 name="times" size={16} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* 기타 목적 추가하기 버튼 */}
        <TouchableOpacity 
          style={styles.addGoalButton} 
          onPress={() => setShowCustomModal(true)}
        >
          <Text style={styles.addGoalButtonText}>기타 목적 추가하기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 기타 목적 입력 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomModal}
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>기타 목적 추가하기</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="목적을 입력해주세요"
              placeholderTextColor={Colors.secondaryBrown}
              value={customGoal}
              onChangeText={setCustomGoal}
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleCustomGoalSubmit}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        textAlign: 'center',
        marginBottom: 30,
    },
    goalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.textLight,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    goalButtonText: {
        fontSize: FontSizes.medium,
        fontWeight: FontWeights.medium,
        color: Colors.textDark,
        flex: 1,
    },
    removeButton: {
        padding: 5,
    },
    addGoalButton: {
        backgroundColor: Colors.textLight,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addGoalButtonText: {
        fontSize: FontSizes.medium,
        fontWeight: FontWeights.medium,
        color: Colors.textDark,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: Colors.textLight,
        borderRadius: 20,
        padding: 25,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInput: {
        backgroundColor: Colors.primaryBeige,
        borderRadius: 10,
        padding: 15,
        fontSize: FontSizes.medium,
        color: Colors.textDark,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: Colors.textLight,
        borderWidth: 1,
        borderColor: Colors.secondaryBrown,
    },
    confirmButton: {
        backgroundColor: Colors.accentApricot,
    },
    cancelButtonText: {
        fontSize: FontSizes.medium,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        textAlign: 'center',
    },
    confirmButtonText: {
        fontSize: FontSizes.medium,
        fontWeight: FontWeights.bold,
        color: Colors.textLight,
        textAlign: 'center',
    }
});

export default TimeAttackScreen;