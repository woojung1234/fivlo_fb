// src/screens/InfoScreen.jsx (새 파일)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';

const InfoScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const appVersion = "1.0.0"; // 예시 버전 정보

    return (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
            <Header title="정보" showBackButton={true} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>이용약관</Text>
                        <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>개인정보 처리방침</Text>
                        <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
                    </TouchableOpacity>
                    <View style={styles.menuItem_last}>
                        <Text style={styles.menuText}>버전</Text>
                        <Text style={styles.menuValueText}>{appVersion}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// SettingsScreen과 유사한 스타일 사용
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.primaryBeige,
    },
    scrollViewContent: {
        padding: 20,
    },
    menuContainer: {
        backgroundColor: Colors.textLight,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primaryBeige,
    },
    menuItem_last: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    menuText: {
        fontSize: FontSizes.medium,
        color: Colors.textDark,
    },
    menuValueText: {
        fontSize: FontSizes.medium,
        color: Colors.secondaryBrown,
    },
});

export default InfoScreen;