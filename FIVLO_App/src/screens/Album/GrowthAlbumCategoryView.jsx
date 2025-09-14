import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Header from '../../components/common/Header';

const GrowthAlbumCategoryView = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [albumEntries, setAlbumEntries] = useState([]);
  const [groupedEntries, setGroupedEntries] = useState({});

  // 샘플 데이터
  useEffect(() => {
    const sampleEntries = [
      {
        id: '1',
        taskTitle: '운동하기',
        categoryId: 'workout',
        categoryName: 'WORKOUT',
        imageUri: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=1',
        memo: '오늘 1일차 끝!',
        createdAt: '2024-07-05T10:00:00Z',
      },
      {
        id: '2',
        taskTitle: '운동하기',
        categoryId: 'workout',
        categoryName: 'WORKOUT',
        imageUri: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=2',
        memo: '2일차 완료!',
        createdAt: '2024-07-06T10:00:00Z',
      },
      {
        id: '3',
        taskTitle: '운동하기',
        categoryId: 'workout',
        categoryName: 'WORKOUT',
        imageUri: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=3',
        memo: '3일차 달성!',
        createdAt: '2024-07-07T10:00:00Z',
      },
      {
        id: '4',
        taskTitle: '독서하기',
        categoryId: 'reading',
        categoryName: 'Reading',
        imageUri: 'https://via.placeholder.com/150x150/2196F3/FFFFFF?text=4',
        memo: '책 한 권 완독!',
        createdAt: '2024-07-09T15:00:00Z',
      },
      {
        id: '5',
        taskTitle: '독서하기',
        categoryId: 'reading',
        categoryName: 'Reading',
        imageUri: 'https://via.placeholder.com/150x150/2196F3/FFFFFF?text=5',
        memo: '두 번째 책 시작!',
        createdAt: '2024-07-10T15:00:00Z',
      },
      {
        id: '6',
        taskTitle: '독서하기',
        categoryId: 'reading',
        categoryName: 'Reading',
        imageUri: 'https://via.placeholder.com/150x150/2196F3/FFFFFF?text=6',
        memo: '독서 습관 형성!',
        createdAt: '2024-07-11T15:00:00Z',
      },
    ];

    setAlbumEntries(sampleEntries);

    // 카테고리별로 그룹화
    const grouped = sampleEntries.reduce((acc, entry) => {
      if (!acc[entry.categoryId]) {
        acc[entry.categoryId] = {
          categoryName: entry.categoryName,
          entries: []
        };
      }
      acc[entry.categoryId].entries.push(entry);
      return acc;
    }, {});

    setGroupedEntries(grouped);
  }, []);

  const renderCategorySection = (categoryId, categoryData) => {
    return (
      <View key={categoryId} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{categoryData.categoryName}</Text>
        <View style={styles.thumbnailGrid}>
          {categoryData.entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.thumbnailItem}
              onPress={() => {
                // TODO: 상세 보기 구현
                console.log('엔트리 선택:', entry);
              }}
            >
              <Image
                source={{ uri: entry.imageUri }}
                style={styles.thumbnail}
              />
            </TouchableOpacity>
          ))}
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
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => navigation.navigate('GrowthAlbumCalendarView')}
          >
            <Text style={styles.toggleText}>캘린더 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
            <Text style={[styles.toggleText, styles.activeToggleText]}>카테고리별 보기</Text>
          </TouchableOpacity>
        </View>

        {/* 카테고리별 섹션 */}
        {Object.entries(groupedEntries).map(([categoryId, categoryData]) =>
          renderCategorySection(categoryId, categoryData)
        )}

        {/* 빈 상태 */}
        {Object.keys(groupedEntries).length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="images" size={60} color={Colors.secondaryBrown} />
            <Text style={styles.emptyText}>아직 성장앨범에 기록이 없습니다.</Text>
            <Text style={styles.emptySubText}>Task를 완료하고 사진을 남겨보세요!</Text>
          </View>
        )}
      </ScrollView>
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
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  thumbnailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thumbnailItem: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
});

export default GrowthAlbumCategoryView;