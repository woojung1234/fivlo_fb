import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

const GrowthAlbumScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { taskData } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [memo, setMemo] = useState('');

  const handleImagePicker = async () => {
    Alert.alert(
      '사진 선택',
      '사진을 어떻게 추가하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        { text: '갤러리에서 선택', onPress: pickFromGallery },
        { text: '카메라로 촬영', onPress: takePhoto },
      ]
    );
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSave = () => {
    if (!selectedImage) {
      Alert.alert('알림', '사진을 추가해주세요.');
      return;
    }

    // 성장앨범에 저장
    const albumEntry = {
      id: Date.now().toString(),
      taskId: taskData?.id,
      taskTitle: taskData?.title,
      categoryId: taskData?.categoryId,
      imageUri: selectedImage.uri,
      memo: memo.trim(),
      createdAt: new Date().toISOString(),
    };

    // TODO: API 호출로 서버에 저장
    console.log('성장앨범 저장:', albumEntry);

    Alert.alert('저장 완료', '성장앨범에 기록되었습니다!', [
      { text: '확인', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <Header title="성장앨범" showBackButton={true} />
      
      <View style={styles.content}>
        <View style={styles.congratulationsContainer}>
          <Text style={styles.congratulationsText}>
            축하합니다! 오늘 목표를 완료했어요.{'\n'}지금 이 순간을 사진으로 남겨볼래요?
          </Text>
        </View>

        <View style={styles.imageSection}>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={handleImagePicker}
              >
                <FontAwesome5 name="edit" size={16} color={Colors.textLight} />
                <Text style={styles.changeImageText}>변경</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
                <FontAwesome5 name="camera" size={40} color={Colors.textDark} />
                <Text style={styles.imagePickerText}>사진을 업로드하거나 클릭해서 촬영하세요</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.memoSection}>
          <Text style={styles.memoLabel}>오늘의 순간을 기록해보세요!</Text>
          <TextInput
            style={styles.memoInput}
            placeholder="메모를 입력해주세요..."
            placeholderTextColor={Colors.secondaryBrown}
            value={memo}
            onChangeText={setMemo}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="저장하기"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={!selectedImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  congratulationsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  congratulationsText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 28,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imagePickerContainer: {
    width: 200,
    height: 200,
    borderRadius: 15,
    backgroundColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryBeige,
    borderStyle: 'dashed',
  },
  imagePickerButton: {
    alignItems: 'center',
    padding: 20,
  },
  imagePickerText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  selectedImageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeImageText: {
    fontSize: FontSizes.small,
    color: Colors.textLight,
    marginLeft: 5,
    fontWeight: FontWeights.bold,
  },
  memoSection: {
    marginBottom: 30,
  },
  memoLabel: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  memoInput: {
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 100,
    backgroundColor: Colors.textLight,
  },
  buttonContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: Colors.textDark,
  },
});

export default GrowthAlbumScreen;