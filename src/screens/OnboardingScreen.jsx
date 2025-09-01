// src/screens/OnboardingScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Button from '../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OnboardingScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [showPurposeSelection, setShowPurposeSelection] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPurposeSelection(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePurposeSelect = (purpose) => {
    console.log('Selected purpose:', purpose);
    // 백엔드 enum 값과 정확히 일치하는 한글 문자열로 수정!
    navigation.navigate('AuthChoice', { userType: purpose });
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Image
          source={require('../../assets/images/fivlo_logo.png')}
          style={styles.logo}
        />
        
        <Image
          source={require('../../assets/images/obooni_clock.png')}
          style={styles.clockImage}
        />

        {showPurposeSelection && (
          <View style={styles.purposeContainer}>
            <Text style={styles.purposeQuestion}>어떤 목적으로 FIVLO를 사용하시나요?</Text>
            <Button
              title="집중력 개선"
              onPress={() => handlePurposeSelect('집중력개선')}
              style={styles.purposeButton}
            />
            <Button
              title="루틴 형성"
              onPress={() => handlePurposeSelect('루틴형성')}
              style={styles.purposeButton}
              primary={false}
            />
            <Button
              title="목표 관리"
              onPress={() => handlePurposeSelect('목표관리')}
              style={styles.purposeButton}
              primary={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  clockImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  purposeContainer: {
    width: '100%',
    alignItems: 'center',
  },
  purposeQuestion: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  purposeButton: {
    width: '100%',
    marginBottom: 15,
  },
});

export default OnboardingScreen;
