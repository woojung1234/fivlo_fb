// src/screens/Pomodoro/PomodoroFinishScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

// API 서비스 임포트
import { earnCoin } from '../../services/coinApi';

const PomodoroFinishScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal, coinEarned } = route.params; // coinEarned 받기
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 코인 지급 로직 (모달이 보일 때 실행)
  useEffect(() => {
    const giveCoin = async () => {
      // coinEarned가 0보다 크고, 모달이 보일 때만 코인 지급 모달 띄움
      if (coinEarned > 0 && isPremiumUser) {
        // 실제 코인 지급은 이미 PomodoroCycleCompleteScreen에서 처리되었으므로, 여기서는 모달만 띄움
        setShowCoinModal(true);
      }
    };
    giveCoin();
  }, [isPremiumUser, coinEarned]); // coinEarned가 변경될 때도 실행되도록 의존성 추가

  // 컴포넌트 마운트 시 음성 알림
  useEffect(() => {
    const speakMessage = async () => {
      try {
        await Speech.speak('25분 집중 완료! 오분이가 칭찬합니다', { language: 'ko-KR' });
      } catch (e) {
        console.warn("Speech synthesis failed", e);
      }
    };
    speakMessage();
  }, []);

  // "집중도 분석 보러가기" 버튼
  const handleGoToAnalysis = () => {
    Alert.alert('이동', '집중도 분석 페이지로 이동합니다.');
    // navigation.navigate('AnalysisGraph');
  };

  // "홈 화면으로" 버튼
  const handleGoToHome = () => {
    navigation.popToTop();
    navigation.navigate('Main', { screen: 'HomeTab' });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title="포모도로 기능" showBackButton={true} />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.accentApricot} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.goalText}>{selectedGoal.title}</Text>
        
        <Image
          source={require('../../../오분이최종/gif/신남.gif')}
          style={styles.obooniCharacter}
        />
        
        <Text style={styles.finishText}>25분 집중 완료!</Text>
        <Text style={styles.finishMessage}>오분이가 칭찬합니다~</Text>
        
        <Button title="집중도 분석 보러가기" onPress={handleGoToAnalysis} style={styles.actionButton} disabled={isLoading} />
      </ScrollView>

      {/* 코인 증정 모달 (20번 이미지) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCoinModal}
        onRequestClose={() => setShowCoinModal(false)}
      >
        <View style={styles.coinModalOverlay}>
          <View style={styles.coinModalContent}>
            <Image
              source={require('../../../오분이최종/gif/신남.gif')}
              style={styles.modalObooni}
            />
            <View style={styles.coinContainer}>
              <Text style={styles.coinText}>$</Text>
            </View>
            <Text style={styles.modalTitle}>포모도로 완료</Text>
            <Text style={styles.modalMessage}>
              오분이가 코인을 드리겠습니다{"\n"}고생하셨습니다.
            </Text>
            <Button title="홈화면으로" onPress={() => setShowCoinModal(false)} style={styles.modalButton} />
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    zIndex: 10,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  goalText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  obooniCharacter: {
    width: 120,
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  finishText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  finishMessage: {
    fontSize: FontSizes.large,
    color: Colors.secondaryBrown,
    marginBottom: 50,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: Colors.accentApricot,
    width: '80%',
  },
  coinModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  coinModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalObooni: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  coinContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  coinText: {
    fontSize: 40,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: Colors.accentApricot,
    width: '80%',
  },
});

export default PomodoroFinishScreen;
