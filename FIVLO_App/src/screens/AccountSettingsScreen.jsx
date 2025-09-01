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
    const [name, setName] = useState("사용자 이름"); 
    const email = "example@fivlo.com"; 

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
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <FontAwesome5 name="user" size={40} color={Colors.secondaryBrown} />
                    </View>
                </View>

                <Text style={styles.label}>이름</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>계정 정보</Text>
                <Text style={styles.emailText}>{email}</Text>
                
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.actionText}>로그아웃</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteAccount}>
                        <Text style={styles.actionText_delete}>회원 탈퇴</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="저장" onPress={handleSave} />
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
    },
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
        borderWidth: 2,
        borderColor: Colors.secondaryBrown,
    },
    label: {
        fontSize: FontSizes.medium,
        color: Colors.secondaryBrown,
        fontWeight: FontWeights.medium,
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        backgroundColor: Colors.textLight,
        borderRadius: 10,
        padding: 15,
        fontSize: FontSizes.medium,
        color: Colors.textDark,
    },
    emailText: {
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        padding: 15,
        fontSize: FontSizes.medium,
        color: '#A0A0A0',
        overflow: 'hidden'
    },
    actionsContainer: {
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
    buttonContainer: {
        padding: 20,
    }
});

export default AccountSettingsScreen;