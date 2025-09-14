import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Header from '../../components/common/Header';

const GrowthAlbumCalendarView = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [albumEntries, setAlbumEntries] = useState({});

  // 샘플 데이터
  useEffect(() => {
    const sampleEntries = {
      '2024-7-5': [
        {
          id: '1',
          taskTitle: '운동하기',
          categoryId: 'workout',
          imageUri: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=WORKOUT',
          memo: '오늘 1일차 끝!',
          createdAt: '2024-07-05T10:00:00Z',
        }
      ],
      '2024-7-9': [
        {
          id: '2',
          taskTitle: '독서하기',
          categoryId: 'reading',
          imageUri: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=READING',
          memo: '책 한 권 완독!',
          createdAt: '2024-07-09T15:00:00Z',
        }
      ],
      '2024-7-11': [
        {
          id: '3',
          taskTitle: '물 마시기',
          categoryId: 'daily',
          imageUri: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=WATER',
          memo: '하루 2L 달성!',
          createdAt: '2024-07-11T12:00:00Z',
        }
      ],
    };
    setAlbumEntries(sampleEntries);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // 이전 달의 빈 날짜들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDateKey = (date) => {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const getEntriesForDate = (date) => {
    const dateKey = getDateKey(date);
    return albumEntries[dateKey] || [];
  };

  const handleDatePress = (date) => {
    if (!date) return;
    const entries = getEntriesForDate(date);
    if (entries.length > 0) {
      setSelectedDate(date);
      setSelectedEntry(entries[0]); // 첫 번째 엔트리 선택
      setShowDetailModal(true);
    }
  };

  const handleEditEntry = () => {
    // TODO: 편집 기능 구현
    Alert.alert('편집', '편집 기능을 구현하세요.');
  };

  const handleDeleteEntry = () => {
    Alert.alert(
      '삭제 확인',
      '이 기록을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const dateKey = getDateKey(selectedDate);
            setAlbumEntries(prev => ({
              ...prev,
              [dateKey]: prev[dateKey].filter(entry => entry.id !== selectedEntry.id)
            }));
            setShowDetailModal(false);
          }
        }
      ]
    );
  };

  const renderCalendarDay = (date, index) => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }
    
    const entries = getEntriesForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          isToday && styles.todayDay,
          entries.length > 0 && styles.hasEntryDay
        ]}
        onPress={() => handleDatePress(date)}
      >
        <Text style={[
          styles.dayText,
          isToday && styles.todayText
        ]}>
          {date.getDate()}
        </Text>
        
        {/* 엔트리 썸네일 표시 */}
        {entries.length > 0 && (
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: entries[0].imageUri }}
              style={styles.thumbnail}
            />
            {entries.length > 1 && (
              <View style={styles.moreIndicator}>
                <Text style={styles.moreText}>+{entries.length - 1}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    return (
      <View style={styles.calendarContainer}>
        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>
        
        {/* 달력 그리드 */}
        <View style={styles.calendarGrid}>
          {days.map((date, index) => renderCalendarDay(date, index))}
        </View>
      </View>
    );
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <Header title="성장앨범" showBackButton={true} />
      
      <ScrollView style={styles.content}>
        {/* 뷰 토글 버튼 */}
        <View style={styles.viewToggle}>
          <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
            <Text style={[styles.toggleText, styles.activeToggleText]}>캘린더 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => navigation.navigate('GrowthAlbumCategoryView')}
          >
            <Text style={styles.toggleText}>카테고리별 보기</Text>
          </TouchableOpacity>
        </View>

        {renderCalendar()}
      </ScrollView>

      {/* 상세 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDetailModal}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate && `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDetailModal(false)}
              >
                <FontAwesome5 name="times" size={20} color={Colors.textDark} />
              </TouchableOpacity>
            </View>
            
            {selectedEntry && (
              <>
                <Image
                  source={{ uri: selectedEntry.imageUri }}
                  style={styles.modalImage}
                />
                
                <View style={styles.modalMemo}>
                  <Text style={styles.memoLabel}>MEMO</Text>
                  <Text style={styles.memoText}>{selectedEntry.memo}</Text>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={handleDeleteEntry}
                  >
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.editButton]}
                    onPress={handleEditEntry}
                  >
                    <Text style={styles.editButtonText}>수정</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <Text style={styles.confirmButtonText}>확인</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 4,
    marginVertical: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: Colors.primaryBeige,
  },
  toggleText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  activeToggleText: {
    fontWeight: FontWeights.bold,
  },
  calendarContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    paddingVertical: 10,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBeige,
    position: 'relative',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  todayDay: {
    backgroundColor: Colors.primaryBeige,
  },
  hasEntryDay: {
    backgroundColor: Colors.textLight,
  },
  dayText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
  },
  todayText: {
    fontWeight: FontWeights.bold,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  moreIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  moreText: {
    fontSize: 8,
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  closeButton: {
    padding: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalMemo: {
    marginBottom: 20,
  },
  memoLabel: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  memoText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  editButton: {
    backgroundColor: Colors.primaryBeige,
  },
  confirmButton: {
    backgroundColor: Colors.textDark,
  },
  deleteButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
  },
  editButtonText: {
    color: Colors.textDark,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
  },
  confirmButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
  },
});

export default GrowthAlbumCalendarView;