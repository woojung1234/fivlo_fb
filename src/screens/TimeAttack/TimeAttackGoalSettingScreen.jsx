// src/screens/TimeAttack/TimeAttackGoalSettingScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

const TimeAttackGoalSettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal } = route.params;
  const [totalMinutes, setTotalMinutes] = useState('00');

  const handleStartAttack = () => {
    const minutes = parseInt(totalMinutes, 10);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert('알림', '1분 이상의 유효한 시간을 입력해주세요.');
      return;
    }
    navigation.navigate('TimeAttackAISubdivision', { selectedGoal, totalMinutes: minutes });
  };

  const handleNumberPress = (num) => {
    setTotalMinutes(prev => {
      const currentVal = prev === '00' ? '' : prev;
      const newVal = currentVal + num.toString();
      if (newVal.length > 3) return prev; // 최대 999분
      return newVal.padStart(2, '0');
    });
  };

  const handleDelete = () => {
    setTotalMinutes(prev => {
      if (prev.length <= 1) return '00';
      const newVal = prev.slice(0, -1);
      return newVal.padStart(2, '0');
    });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="타임어택 기능" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.questionText}>몇 분 안에 끝마칠까요?</Text>

        <View style={styles.timerDisplayContainer}>
          <Text style={styles.timerText}>{totalMinutes}</Text>
          <Text style={styles.minuteText}>분</Text>
        </View>

        {/* Custom Keypad */}
        <View style={styles.keypadContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'empty', 0, 'del'].map((item, index) => {
            if (item === 'empty') return <View key={index} style={styles.keypadButton} />;
            return (
              <TouchableOpacity key={index} style={styles.keypadButton} onPress={() => item === 'del' ? handleDelete() : handleNumberPress(item)}>
                {item === 'del' ? (
                  <FontAwesome5 name="backspace" size={24} color={Colors.textDark} />
                ) : (
                  <Text style={styles.keypadButtonText}>{item}</Text>
                )}
              </TouchableOpacity>
            )
          })}
        </View>

      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          title="시작하기"
          onPress={handleStartAttack}
          disabled={parseInt(totalMinutes, 10) <= 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.primaryBeige,
    },
    scrollViewContentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    questionText: {
        fontSize: FontSizes.extraLarge,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
        marginTop: 40,
        marginBottom: 30,
        textAlign: 'center',
    },
    timerDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    timerText: {
        fontSize: 80,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
    },
    minuteText: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.medium,
        color: Colors.textDark,
        marginLeft: 10,
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '90%',
        marginTop: 40,
    },
    keypadButton: {
        width: '30%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 10,
    },
    keypadButtonText: {
        fontSize: FontSizes.extraLarge,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
    },
    buttonContainer: {
        padding: 20,
    },
});

export default TimeAttackGoalSettingScreen;