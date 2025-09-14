import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Button from '../../components/common/Button';

const TimeAttackCompleteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { goal, totalTime, completedTasks } = route.params;
  
  const [showCelebration, setShowCelebration] = useState(true);
  
  useEffect(() => {
    // 축하 애니메이션을 위한 타이머
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGoHome = () => {
    navigation.navigate('Home');
  };
  
  const handleViewAnalysis = () => {
    navigation.navigate('Analysis');
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
        <Text style={styles.headerTitle}>타임어택 완료</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 축하 메시지 */}
        <View style={styles.celebrationContainer}>
          <Image
            source={require('../../../assets/images/obooni_happy.png')}
            style={styles.obooniCharacter}
          />
          <Text style={styles.celebrationTitle}>축하해요!</Text>
          <Text style={styles.celebrationMessage}>
            모든 목표를 완료했어요!{'\n'}정말 잘했어요!
          </Text>
        </View>
        
        {/* 완료 정보 */}
        <View style={styles.completionInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>목표</Text>
            <Text style={styles.infoValue}>{goal}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>총 시간</Text>
            <Text style={styles.infoValue}>{formatTime(totalTime)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>완료한 작업</Text>
            <Text style={styles.infoValue}>{completedTasks.length}개</Text>
          </View>
        </View>
        
        {/* 완료한 작업 목록 */}
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
        
        {/* 액션 버튼 */}
        <View style={styles.actionButtons}>
          <Button
            title="홈으로"
            onPress={handleGoHome}
            style={styles.homeButton}
          />
          <Button
            title="분석 보기"
            onPress={handleViewAnalysis}
            style={styles.analysisButton}
          />
        </View>
      </View>
      
      {/* 축하 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCelebration}
        onRequestClose={() => setShowCelebration(false)}
      >
        <View style={styles.celebrationModalOverlay}>
          <View style={styles.celebrationModalContent}>
            <Image
              source={require('../../../assets/images/obooni_happy.png')}
              style={styles.modalObooni}
            />
            <Text style={styles.modalTitle}>완료!</Text>
            <Text style={styles.modalMessage}>
              모든 목표를 달성했어요!{'\n'}정말 대단해요!
            </Text>
          </View>
        </View>
      </Modal>
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
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  obooniCharacter: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  celebrationTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  celebrationMessage: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    lineHeight: 24,
  },
  completionInfo: {
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
    marginBottom: 20,
  },
  homeButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: Colors.primaryBeige,
  },
  analysisButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: Colors.secondaryBrown,
  },
  celebrationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationModalContent: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  modalObooni: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TimeAttackCompleteScreen;