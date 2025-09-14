import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';

const TaskDeleteConfirmModal = ({
  task,
  onClose,
  onConfirm,
}) => {
  const [deleteFutureTasks, setDeleteFutureTasks] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    return `${month}월 ${day}일 (${weekDay})`;
  };

  const handleConfirm = () => {
    if (task.repeatDaily) {
      Alert.alert(
        '반복 일정 삭제',
        deleteFutureTasks 
          ? '미래의 모든 반복 일정이 삭제됩니다.'
          : '해당 날짜의 일정만 삭제됩니다.',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '확인', 
            onPress: () => {
              onConfirm(deleteFutureTasks);
              onClose();
            }
          }
        ]
      );
    } else {
      onConfirm();
      onClose();
    }
  };

  if (!task) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {formatDate(task.createdAt)} {task.title}
          </Text>
        </View>

        {/* 내용 */}
        <View style={styles.content}>
          <Text style={styles.questionText}>
            해당 TASK를 영구적으로 삭제하시겠습니까?
          </Text>
          
          {task.repeatDaily && (
            <View style={styles.repeatOptions}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setDeleteFutureTasks(false)}
              >
                <View style={[
                  styles.radioButton,
                  !deleteFutureTasks && styles.selectedRadioButton
                ]}>
                  {!deleteFutureTasks && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.optionText}>해당 날짜만 삭제</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setDeleteFutureTasks(true)}
              >
                <View style={[
                  styles.radioButton,
                  deleteFutureTasks && styles.selectedRadioButton
                ]}>
                  {deleteFutureTasks && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.optionText}>미래의 모든 반복 일정 삭제</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.warningText}>
            삭제된 TASK는 복구할 수 없습니다.
          </Text>
        </View>

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <FontAwesome5 name="arrow-left" size={20} color={Colors.textDark} />
          </TouchableOpacity>
          
          <Button
            title="삭제하기"
            onPress={handleConfirm}
            style={styles.deleteButton}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textLight,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  questionText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  repeatOptions: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedRadioButton: {
    borderColor: Colors.primaryBeige,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryBeige,
  },
  optionText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  warningText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.textLight,
  },
  cancelButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
});

export default TaskDeleteConfirmModal;