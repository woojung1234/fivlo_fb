// src/screens/AccountSettingsScreen.jsx (새 파일)

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';

const AccountSettingsScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { logout } = useAuthStore();
    
    // 예시 데이터. 실제로는 유저 상태에서 가져와야 함
    const [name, setName] = useState("아현"); 
    const email = "skyhan1114@naver.com";
    const purpose = "루틴 형성"; 

    const handleSave = () => {
        Alert.alert("저장 완료", "프로필이 저장되었습니다.");
        navigation.goBack();
    };

    const handleLogout = () => {
        logout(); // Zustand 스토어의 로그아웃 함수 호출
        // 앱의 초기화면(로그인/온보딩)으로 이동
        navigation.navigate('Onboarding');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "회원 탈퇴",
            "정말로 회원 탈퇴를 하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.",
            [
                { text: "취소", style: "cancel" },
                { text: "탈퇴하기", onPress: () => console.log("회원 탈퇴 처리"), style: "destructive" },
            ]
        );
    };

    return (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
            <Header title="프로필 설정" showBackButton={true} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* 프로필 사진 섹션 */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <FontAwesome5 name="user" size={40} color={Colors.textDark} />
                    </View>
                    <Text style={styles.changePhotoText}>사진 변경</Text>
                </View>

                {/* 이름 입력 섹션 */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="이름을 입력하세요"
                    />
                </View>

                {/* 계정 정보 섹션 */}
                <View style={styles.accountInfoSection}>
                    <Text style={styles.label}>계정 정보</Text>
                    <Text style={styles.loginMethodText}>(카카오톡/페이스북/이메일) 로그인</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>

                {/* FIVLO 사용목적 섹션 */}
                <View style={styles.purposeSection}>
                    <Text style={styles.label}>FIVLO 사용목적</Text>
                    <Text style={styles.purposeText}>{purpose}</Text>
                </View>
                
                {/* 로그아웃/회원탈퇴 섹션 */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.actionText}>로그아웃</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteAccount}>
                        <Text style={styles.actionText_delete}>회원 탈퇴</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            {/* 저장 버튼 */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>저장</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  // 프로필 사진 섹션
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textDark,
  },
  changePhotoText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginTop: 10,
  },
  // 입력 섹션
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: Colors.primaryBeige,
  },
  // 계정 정보 섹션
  accountInfoSection: {
    marginBottom: 20,
  },
  loginMethodText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginBottom: 5,
  },
  emailText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  // 액션 섹션
  actionsSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  actionText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  actionText_delete: {
    fontSize: FontSizes.medium,
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
  // 사용목적 섹션
  purposeSection: {
    marginBottom: 20,
  },
  purposeText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  // 저장 버튼
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.primaryBeige,
  },
  saveButton: {
    backgroundColor: Colors.accentApricot,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
});

export default AccountSettingsScreen;