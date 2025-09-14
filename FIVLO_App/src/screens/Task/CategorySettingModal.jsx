import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

const CategorySettingModal = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [categories, setCategories] = useState([
    { id: 'daily', name: '일상', color: '#8B4513' },
    { id: 'startup', name: '창업팀', color: '#FFD700' },
    { id: 'study', name: '8월 국제무역사', color: '#FFA500' },
  ]);

  const handleAddCategory = () => {
    navigation.navigate('CategoryEdit', { mode: 'add' });
  };

  const handleEditCategory = (category) => {
    navigation.navigate('CategoryEdit', { 
      mode: 'edit', 
      category: category 
    });
  };

  const handleDeleteCategory = (categoryId) => {
    if (categoryId === 'daily') {
      Alert.alert('알림', '기본 카테고리는 삭제할 수 없습니다.');
      return;
    }

    Alert.alert(
      '카테고리 삭제',
      '이 카테고리를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
          }
        }
      ]
    );
  };

  const handleSave = () => {
    // 카테고리 저장 로직
    Alert.alert('저장 완료', '카테고리 설정이 저장되었습니다.');
    navigation.goBack();
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <Header title="카테고리 설정" showBackButton={true} />
      
      <ScrollView style={styles.content}>
        <View style={styles.categoriesList}>
          {categories.map((category, index) => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[
                  styles.categoryColor,
                  { backgroundColor: category.color }
                ]} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditCategory(category)}
                >
                  <FontAwesome5 name="bars" size={16} color={Colors.textDark} />
                </TouchableOpacity>
                
                {category.id !== 'daily' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteCategory(category.id)}
                  >
                    <FontAwesome5 name="trash" size={16} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={handleAddCategory}
        >
          <FontAwesome5 name="plus" size={20} color={Colors.textDark} />
          <Text style={styles.addCategoryText}>새 카테고리 추가</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="저장"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoriesList: {
    paddingVertical: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  categoryName: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  categoryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    marginLeft: 5,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  addCategoryText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginLeft: 10,
  },
  buttonContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: Colors.primaryBeige,
  },
});

export default CategorySettingModal;