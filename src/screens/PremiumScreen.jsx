// src/screens/PremiumScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

const PremiumScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handlePurchase = () => {
        // TODO: 실제 결제 라이브러리(e.g., react-native-iap) 연동 필요
        Alert.alert("결제", "결제 기능 연동이 필요합니다.");
    };

    return (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
            <Header title="FIVLO 프리미엄 기능" showBackButton={true} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* 피그마 시안에 맞는 캐릭터 이미지 (새로운 에셋 필요) */}
                <Image 
                    source={require('../../assets/images/obooni_premium.png')} // 💡 이 이미지는 새로 추가해야 합니다.
                    style={styles.premiumImage} 
                />
                
                <Text style={styles.premiumDescription}>
                    오분이와 함께 집중력을 높여요!
                </Text>

                <View style={styles.priceOptionsContainer}>
                    <TouchableOpacity style={styles.priceOption}>
                        <Text style={styles.priceOptionTitle}>1개월</Text>
                        <Text style={styles.priceOptionValue}>3,900원</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.priceOption, styles.priceOptionActive]}>
                        <Text style={[styles.priceOptionTitle, styles.priceOptionTitleActive]}>12개월</Text>
                        <Text style={[styles.priceOptionValue, styles.priceOptionValueActive]}>23,400원</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.featuresContainer}>
                    <Text style={styles.featuresTitle}>사용 가능 기능</Text>
                    <Text style={styles.featuresText}>
                        ✓ GPS 장소 기반 원격 방지 시스템{'\n'}
                        ✓ D-Day 목표 집중도 분석{'\n'}
                        ✓ 집중도 분석 데이터 리포트 AI 연동{'\n'}
                        ✓ 오분이 커스터마이징 및 코인 보상 시스템
                    </Text>
                </View>

            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="결제하고 모든 기능 사용하기" onPress={handlePurchase} />
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
        alignItems: 'center',
    },
    premiumImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 20,
    },
    premiumDescription: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        marginBottom: 30,
    },
    priceOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    priceOption: {
        width: '48%',
        borderWidth: 2,
        borderColor: Colors.secondaryBrown,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    priceOptionActive: {
        borderColor: Colors.accentApricot,
        backgroundColor: '#FFF4E8',
    },
    priceOptionTitle: {
        fontSize: FontSizes.medium,
        color: Colors.textDark,
        fontWeight: FontWeights.medium,
    },
    priceOptionTitleActive: {
        color: Colors.accentApricot,
        fontWeight: FontWeights.bold,
    },
    priceOptionValue: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        marginTop: 8,
    },
    priceOptionValueActive: {
        color: Colors.accentApricot,
    },
    featuresContainer: {
        width: '100%',
        backgroundColor: Colors.textLight,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    featuresTitle: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        marginBottom: 15,
    },
    featuresText: {
        fontSize: FontSizes.medium,
        color: Colors.secondaryBrown,
        lineHeight: 24,
        textAlign: 'center',
    },
    buttonContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EAE2D2'
    },
});

export default PremiumScreen;