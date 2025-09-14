import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

const COLOR_PALETTE = [
  '#000000', '#8B4513', '#D2B48C', '#F5DEB3', '#FFD700',
  '#FFA500', '#FF6347', '#FF69B4', '#FF1493', '#DC143C',
  '#32CD32', '#00FF00', '#00CED1', '#1E90FF', '#0000FF',
  '#8A2BE2', '#9400D3', '#FF00FF', '#FFB6C1', '#DDA0DD',
  '#A9A9A9', '#696969', '#2F4F4F', '#708090'
];

const CategoryEditModal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { mode, category } = route.params;
  const isEdit = mode === 'edit';
  
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8B4513');

  useEffect(() => {
    if (isEdit && category) {
      setCategoryName(category.name);
      setSelectedColor(category.color);
    }
  }, [isEdit, category]);

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert('알림', '카테고리 이름을 입력해주세요.');
      return;
    }

    const categoryData = {
      name: categoryName.trim(),
      color: selectedColor,
    };

    if (isEdit) {
      Alert.alert('수정 완료', '카테고리가 수정되었습니다.');
    } else {
      Alert.alert('추가 완료', '새 카테고리가 추가되었습니다.');
    }
    
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      '카테고리 삭제',
      '이 카테고리를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            Alert.alert('삭제 완료', '카테고리가 삭제되었습니다.');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderColorPalette = () => {
    return (
      <View style={styles.colorGrid}>
        {COLOR_PALETTE.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorItem,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColorItem
            ]}
            onPress={() => setSelectedColor(color)}
          >
            {selectedColor === color && (
              <FontAwesome5 name="check" size={16} color={Colors.textLight} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <Header 
        title="카테고리 입력" 
        showBackButton={true}
        rightComponent={
          isEdit ? (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      
      <View style={styles.content}>
        {/* 카테고리 이름 입력 */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.nameInput}
            placeholder="내용을 입력해주세요."
            placeholderTextColor={Colors.secondaryBrown}
            value={categoryName}
            onChangeText={setCategoryName}
            autoFocus={!isEdit}
          />
        </View>

        {/* 색상 설정 */}
        <View style={styles.colorSection}>
          <Text style={styles.sectionTitle}>색상 설정</Text>
          {renderColorPalette()}
        </View>
      </View>
      
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
    paddingTop: 20,
  },
  deleteButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontSize: FontSizes.medium,
    color: '#FF6B6B',
    fontWeight: FontWeights.bold,
  },
  inputSection: {
    marginBottom: 30,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  colorSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorItem: {
    borderColor: Colors.textDark,
    borderWidth: 3,
  },
  buttonContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: Colors.primaryBeige,
  },
});

export default CategoryEditModal;