// src/screens/Pomodoro/PomodoroGoalCreationScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

// API 서비스 임포트
import { createPomodoroSession } from '../../services/pomodoroApi';

// 포모도로 목표 색상 팔레트 (20가지 색상)
const COLOR_PALETTE = [
  '#000000', '#8B4513', '#D2B48C', '#F5DEB3', '#FFD700',
  '#FFA500', '#FF6347', '#FF69B4', '#FF1493', '#DC143C',
  '#32CD32', '#00FF00', '#00CED1', '#1E90FF', '#0000FF',
  '#8A2BE2', '#9400D3', '#FF00FF', '#FFB6C1', '#DDA0DD'
];

const PomodoroGoalCreationScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [goalText, setGoalText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // "저장" 버튼 클릭 핸들러 (API 연동)
  const handleSaveGoal = async () => {
    if (!goalText.trim()) {
      Alert.alert('알림', '집중 목표를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await createPomodoroSession(goalText, selectedColor); // API 호출
      console.log('포모도로 세션 생성 성공:', response);
      Alert.alert('목표 저장', `"${goalText}" 목표가 저장되었습니다.`);
      // 생성된 목표 정보를 다음 화면으로 전달
      navigation.navigate('PomodoroGoalSelection', {
        newGoal: {
          id: response.id, // 백엔드에서 받은 ID 사용
          text: response.title, // 백엔드에서 받은 title 사용
          color: response.color
        }
      });
    } catch (error) {
      console.error('포모도로 세션 생성 실패:', error.response ? error.response.data : error.message);
      Alert.alert('오류', error.response?.data?.message || '목표 저장 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderColorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: item }]}
      onPress={() => setSelectedColor(item)}
      disabled={isLoading}
    >
      {selectedColor === item && (
        <FontAwesome5 name="check" size={20} color={Colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title="포모도로 기능" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.accentApricot} />
          </View>
        )}
        
        {/* 집중 목표 작성하기 */}
        <TouchableOpacity 
          style={styles.inputField}
          onPress={() => {/* 텍스트 입력 활성화 */}}
          disabled={isLoading}
        >
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>집중 목표 작성하기</Text>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
          </View>
          <TextInput
            style={styles.goalInput}
            placeholder="독서하기"
            placeholderTextColor={Colors.secondaryBrown}
            value={goalText}
            onChangeText={setGoalText}
            editable={!isLoading}
          />
        </TouchableOpacity>

        {/* 집중 그래프 색상 설정 */}
        <TouchableOpacity 
          style={styles.inputField}
          onPress={() => setShowColorPicker(true)} 
          disabled={isLoading}
        >
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>집중 그래프 색상 설정</Text>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
          </View>
          <View style={styles.colorPreviewContainer}>
            <View style={[styles.selectedColorPreview, { backgroundColor: selectedColor }]} />
            <Text style={styles.colorPreviewText}>색상 선택됨</Text>
          </View>
        </TouchableOpacity>

        <Button title="완료" onPress={handleSaveGoal} style={styles.completeButton} disabled={isLoading} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showColorPicker}
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.colorPickerOverlay}>
          <View style={styles.colorPickerContent}>
            <Text style={styles.colorPickerTitle}>색상 설정</Text>
            <FlatList
              data={COLOR_PALETTE}
              renderItem={renderColorItem}
              keyExtractor={item => item}
              numColumns={5}
              contentContainerStyle={styles.colorOptionsGrid}
              scrollEnabled={false}
            />
            <Button title="완료" onPress={() => setShowColorPicker(false)} style={styles.colorPickerDoneButton} />
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
    paddingBottom: 40,
    paddingTop: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 10,
  },
  inputField: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accentApricot,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  goalInput: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    paddingVertical: 10,
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedColorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
  },
  colorPreviewText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  completeButton: {
    marginTop: 30,
    backgroundColor: Colors.accentApricot,
  },
  colorPickerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  colorPickerContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  colorPickerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  colorOptionsGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerDoneButton: {
    marginTop: 20,
    width: '80%',
  },
});

export default PomodoroGoalCreationScreen;
