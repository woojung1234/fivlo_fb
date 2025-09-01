// src/screens/TimeAttack/TimeAttackInProgressScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Easing, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';

const TimeAttackInProgressScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const { selectedGoal, subdividedTasks } = route.params;

    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(subdividedTasks[0].duration * 60);
    const [isRunning, setIsRunning] = useState(true);

    const timerRef = useRef(null);
    const animatedProgress = useRef(new Animated.Value(0)).current;

    const currentTask = subdividedTasks[currentTaskIndex];
    const totalTaskDuration = currentTask.duration * 60;

    useEffect(() => {
        setTimeLeft(currentTask.duration * 60);
        animatedProgress.setValue(0);
    }, [currentTaskIndex]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            Animated.timing(animatedProgress, {
                toValue: 1,
                duration: timeLeft * 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        } else if (timeLeft === 0 && isRunning) {
            handleTaskComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, timeLeft, currentTaskIndex]);

    const handleTaskComplete = () => {
        setIsRunning(false);
        Speech.speak(`${currentTask.name}을(를) 종료했어요!`, { language: 'ko-KR' });
        Alert.alert('단계 완료', '3초 후 다음 단계로 자동 전환됩니다.', [], { cancelable: false });
        setTimeout(() => {
            Alert.dismissAll();
            handleNextTask();
        }, 3000);
    };

    const handleNextTask = () => {
        if (currentTaskIndex < subdividedTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setIsRunning(true);
        } else {
            navigation.replace('TimeAttackComplete', { selectedGoal });
        }
    };

    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    const progressInterpolation = animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
            <Header title="타임어택 기능" showBackButton={true} />
            <View style={styles.contentContainer}>
                <Text style={styles.currentTaskText}>{`${currentTaskIndex + 1}단계 - ${currentTask.name}`}</Text>
                
                <View style={styles.timerContainer}>
                    <Image source={require('../../../assets/images/obooni_clock.png')} style={styles.clockImage} />
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>

                <TouchableOpacity style={styles.nextButton} onPress={handleTaskComplete}>
                    <Text style={styles.nextButtonText}>다음으로</Text>
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
    contentContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    currentTaskText: {
        fontSize: FontSizes.extraLarge,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        textAlign: 'center',
        marginTop: 20,
    },
    timerContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clockImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        position: 'absolute'
    },
    timerText: {
        fontSize: 70,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
    },
    nextButton: {
        backgroundColor: Colors.accentApricot,
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nextButtonText: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textLight,
    },
});

export default TimeAttackInProgressScreen;