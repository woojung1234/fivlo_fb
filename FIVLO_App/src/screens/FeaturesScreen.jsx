// src/screens/FeaturesScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/common/Header';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';

const FeaturesScreen = () => {
  const navigation = useNavigation();

  const features = [
    { name: '포모도로', icon: require('../../assets/images/앱아이콘.png'), screen: 'Pomodoro' },
    { name: '망각방지', icon: require('../../assets/images/벨.png'), screen: 'Reminder' },
    { name: '성장앨범', icon: require('../../assets/images/앨범.png'), screen: 'GrowthAlbumCalendarView' },
    { name: '타임어택', icon: require('../../assets/images/타임어택.png'), screen: 'TimeAttack' },
    { name: '목표설정', icon: require('../../assets/images/테스크.png'), screen: 'RoutineSetting' },
    { name: '집중분석 그래프', icon: require('../../assets/images/그래프.png'), screen: 'AnalysisGraph' }, // AnalysisGraphScreen으로 연결
  ];

  const handleFeaturePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.headerContainer}>
        <Header title="기능" showBackButton={true} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.featureGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleFeaturePress(feature.screen)}
              >
                <Image 
                  source={feature.icon} 
                  style={styles.featureIcon}
                  resizeMode="contain"
                  fadeDuration={0}
                />
              </TouchableOpacity>
              <Text style={styles.featureText}>{feature.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 40,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  featureItem: {
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2.5%',
  },
  iconButton: {
    padding: 10,
    borderRadius: 15,
  },
  featureIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  featureText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default FeaturesScreen;
