import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Button from '../../components/common/Button';

const TimeAttackStopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { goal, totalTime, completedTasks, currentTask } = route.params;
  
  const handleGoHome = () => {
    navigation.navigate('Home');
  };
  
  const handleViewAnalysis = () => {
    navigation.navigate('Analysis');
  };
  
  const handleRestart = () => {
    Alert.alert(
      '타임어택 재시작',
      '타임어택을 처음부터 다시 시작하시겠어요?',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '예',
          onPress: () => {
            navigation.navigate('TimeAttack');
          },
        },
      ]
    );
  };
  
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };
  
  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>타임어택 중단</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 중단 메시지 */}
        <View style={styles.stopContainer}>
          <Image
            source={require('../../../assets/images/obooni_sad.png')}
            style={styles.obooniCharacter}
          />
          <Text style={styles.stopTitle}>타임어택이 중단되었어요</Text>
          <Text style={styles.stopMessage}>
            괜찮아요! 다음에 다시 도전해보세요.{'\n'}지금까지의 노력도 소중해요!
          </Text>
        </View>
        
        {/* 진행 상황 정보 */}
        <View style={styles.progressInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>목표</Text>
            <Text style={styles.infoValue}>{goal}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>설정 시간</Text>
            <Text style={styles.infoValue}>{formatTime(totalTime)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>완료한 작업</Text>
            <Text style={styles.infoValue}>{completedTasks.length}개</Text>
          </View>
          
          {currentTask && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>중단된 작업</Text>
              <Text style={styles.infoValue}>{currentTask.name}</Text>
            </View>
          )}
        </View>
        
        {/* 완료한 작업 목록 */}
        {completedTasks.length > 0 && (
          <View style={styles.tasksContainer}>
            <Text style={styles.tasksTitle}>완료한 작업</Text>
            {completedTasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <View style={styles.taskCheckbox}>
                  <FontAwesome5 name="check" size={16} color={Colors.primaryBeige} />
                </View>
                <Text style={styles.taskName}>{task.name}</Text>
                <Text style={styles.taskTime}>{task.duration}분</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* 액션 버튼 */}
        <View style={styles.actionButtons}>
          <Button
            title="홈으로"
            onPress={handleGoHome}
            style={styles.homeButton}
          />
          <Button
            title="다시 시작"
            onPress={handleRestart}
            style={styles.restartButton}
          />
        </View>
        
        <Button
          title="분석 보기"
          onPress={handleViewAnalysis}
          style={styles.analysisButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textLight,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  stopContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  obooniCharacter: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  stopTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  stopMessage: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    lineHeight: 24,
  },
  progressInfo: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  infoLabel: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
  },
  infoValue: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  tasksContainer: {
    marginBottom: 30,
  },
  tasksTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryBeige,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskName: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  taskTime: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  homeButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: Colors.primaryBeige,
  },
  restartButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: Colors.secondaryBrown,
  },
  analysisButton: {
    backgroundColor: Colors.textLight,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
});

export default TimeAttackStopScreen;
