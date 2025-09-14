// src/screens/SettingsScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';

const SettingsScreen = ({ route }) => {
  const isPremiumUser = route.params?.isPremiumUser || false;
  const userName = "사용자 이름";
  const userCoins = 5;

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="설정" showBackButton={false} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 이름 섹션 */}
        <TouchableOpacity 
          style={styles.nameContainer}
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <View style={styles.profileIcon}>
            <FontAwesome5 name="user" size={20} color={Colors.textDark} />
          </View>
          <View style={styles.nameTextContainer}>
            <Text style={styles.nameLabel}>이름</Text>
            {isPremiumUser ? (
              <View style={styles.premiumInfo}>
                <Text style={styles.accountType}>프리미엄 계정</Text>
                <FontAwesome5 name="coins" size={14} color={Colors.accentApricot} style={styles.coinIcon} />
                <Text style={styles.coinText}>{userCoins} 코인</Text>
              </View>
            ) : (
              <Text style={styles.accountType}>일반계정</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* 설정 메뉴 섹션 */}
        <View style={styles.menuContainer}>
          {/* 알림 */}
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>알림</Text>
            <Switch
              trackColor={{ false: '#767577', true: Colors.accentApricot }}
              thumbColor={notificationsEnabled ? Colors.primaryBeige : '#f4f3f4'}
              onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
              value={notificationsEnabled}
            />
          </View>
          
          {/* 언어 */}
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>언어</Text>
            <View style={styles.languageContainer}>
              <FontAwesome5 name="globe" size={16} color={Colors.textDark} style={styles.globeIcon} />
              <Text style={styles.languageText}>한국어</Text>
              <FontAwesome5 name="chevron-down" size={12} color={Colors.textDark} />
            </View>
          </TouchableOpacity>

          {/* FIVLO 프리미엄 멤버십 */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('Premium')}
          >
            <Text style={styles.menuText}>FIVLO 프리미엄 멤버십</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.textDark} />
          </TouchableOpacity>

          {/* 정보 */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Info')}
          >
            <Text style={styles.menuText}>정보</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.textDark} />
          </TouchableOpacity>
          
          {/* 신고하기 */}
          <TouchableOpacity style={styles.menuItem_last}>
            <Text style={styles.menuText}>신고하기</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.textDark} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  // 이름 섹션
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBeige,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.textDark,
  },
  nameTextContainer: {
    flex: 1,
  },
  nameLabel: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  accountType: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  premiumInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    marginHorizontal: 5,
  },
  coinText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  // 메뉴 컨테이너
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
  // 언어 섹션
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  globeIcon: {
    marginRight: 8,
  },
  languageText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginRight: 8,
  },
});

export default SettingsScreen;