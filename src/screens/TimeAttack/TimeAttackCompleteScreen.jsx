// src/screens/TimeAttack/TimeAttackCompleteScreen.jsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import CharacterImage from '../../components/common/CharacterImage';
import Button from '../../components/common/Button';

const TimeAttackCompleteScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { selectedGoal } = route.params;

    useEffect(() => {
        Speech.speak('외출 준비 완료! 오분이가 칭찬합니다', { language: 'ko-KR' });
    }, []);

    const handleGoToHome = () => {
        navigation.popToTop();
        navigation.navigate('Main', { screen: 'HomeTab' });
    };

    return (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
            <Header title="타임어택 기능" showBackButton={true} />
            <View style={styles.contentContainer}>
                <Text style={styles.completeText}>{selectedGoal} 완료!</Text>
                <Text style={styles.praiseText}>오분이가 칭찬합니다 ~</Text>
                <CharacterImage style={styles.obooniCharacter} />
                <Button title="홈화면으로" onPress={handleGoToHome} style={styles.homeButton} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.primaryBeige,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    completeText: {
        fontSize: FontSizes.extraLarge,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        marginBottom: 10,
        textAlign: 'center',
    },
    praiseText: {
        fontSize: FontSizes.large,
        color: Colors.secondaryBrown,
        marginBottom: 50,
        textAlign: 'center',
    },
    obooniCharacter: {
        width: 250,
        height: 250,
        marginBottom: 50,
    },
    homeButton: {
        width: '80%',
    },
});

export default TimeAttackCompleteScreen;