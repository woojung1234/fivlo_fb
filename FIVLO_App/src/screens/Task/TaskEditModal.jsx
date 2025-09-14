import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';

const TaskEditModal = ({
  task,
  categories,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedTask, setEditedTask] = useState({
    title: '',
    categoryId: 'daily',
    repeatDaily: false,
    linkToAlbum: false,
  });

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        categoryId: task.categoryId || 'daily',
        repeatDaily: task.repeatDaily || false,
        linkToAlbum: task.linkToAlbum || false,
      });
    }
  }, [task]);

  const handleSave = () => {
    if (!editedTask.title.trim()) {
      Alert.alert('알림', '할 일 내용을 입력해주세요.');
      return;
    }

    onSave(editedTask);
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : categories[0].color;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categories[0].name;
  };

  if (!task) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task 수정</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* 내용 입력 */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.taskInput}
              placeholder="내용을 입력해주세요."
              placeholderTextColor={Colors.secondaryBrown}
              value={editedTask.title}
              onChangeText={(text) => setEditedTask(prev => ({ ...prev, title: text }))}
            />
          </View>

          {/* 카테고리 설정 */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>카테고리 설정</Text>
            <View style={styles.categoryButtons}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    editedTask.categoryId === category.id && styles.selectedCategoryButton
                  ]}
                  onPress={() => setEditedTask(prev => ({ ...prev, categoryId: category.id }))}
                >
                  <View style={[
                    styles.categoryColor,
                    { backgroundColor: category.color }
                  ]} />
                  <Text style={[
                    styles.categoryText,
                    editedTask.categoryId === category.id && styles.selectedCategoryText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addCategoryButton}>
                <FontAwesome5 name="plus" size={16} color={Colors.textDark} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 체크박스 옵션 */}
          <View style={styles.checkboxSection}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setEditedTask(prev => ({ ...prev, repeatDaily: !prev.repeatDaily }))}
            >
              <View style={[
                styles.checkbox,
                editedTask.repeatDaily && styles.checkedBox
              ]}>
                {editedTask.repeatDaily && (
                  <FontAwesome5 name="check" size={12} color={Colors.textLight} />
                )}
              </View>
              <Text style={styles.checkboxText}>매일 반복</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setEditedTask(prev => ({ ...prev, linkToAlbum: !prev.linkToAlbum }))}
            >
              <View style={[
                styles.checkbox,
                editedTask.linkToAlbum && styles.checkedBox
              ]}>
                {editedTask.linkToAlbum && (
                  <FontAwesome5 name="check" size={12} color={Colors.textLight} />
                )}
              </View>
              <Text style={styles.checkboxText}>설정값별 연동</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <Button
            title="삭제하기"
            onPress={onDelete}
            style={styles.deleteButton}
          />
          <Button
            title="Task 수정하기"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textLight,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  placeholder: {
    width: 30,
  },
  content: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primaryBeige,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
  },
  selectedCategoryText: {
    fontWeight: FontWeights.bold,
  },
  addCategoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSection: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.primaryBeige,
    borderColor: Colors.primaryBeige,
  },
  checkboxText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.textLight,
  },
  deleteButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: Colors.textLight,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: Colors.primaryBeige,
  },
});

export default TaskEditModal;