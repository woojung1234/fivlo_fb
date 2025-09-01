// src/screens/SettingsScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons'; // 아이콘 사용

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';

// isPremiumUser prop과 함께 사용자 정보(이름, 코인)를 받아오도록 수정 (예시)
const SettingsScreen = ({ route }) => {
  // 실제 앱에서는 로그인 시 저장된 유저 정보를 가져와야 합니다.
  // 여기서는 isPremiumUser prop으로 분기 처리합니다.
  const isPremiumUser = route.params?.isPremiumUser || false;
  const userName = "사용자 이름"; // 예시 데이터
  const userCoins = 5; // 예시 데이터

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title="설정" showBackButton={false} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 프로필 섹션 */}
        <TouchableOpacity 
          style={styles.profileContainer} 
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <View style={styles.profileIcon}>
            <FontAwesome5 name="user" size={20} color={Colors.secondaryBrown} />
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{userName}</Text>
            {isPremiumUser ? (
              <View style={styles.premiumInfo}>
                <Text style={styles.profileStatus_premium}>프리미엄 계정</Text>
                <FontAwesome5 name="coins" size={14} color={Colors.accentApricot} style={{ marginHorizontal: 5 }} />
                <Text style={styles.profileCoins}>{userCoins} 코인</Text>
              </View>
            ) : (
              <Text style={styles.profileStatus_general}>일반계정</Text>
            )}
          </View>
          <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
        </TouchableOpacity>

        {/* 설정 메뉴 섹션 */}
        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>알림</Text>
            <Switch
              trackColor={{ false: '#767577', true: Colors.accentApricot }}
              thumbColor={notificationsEnabled ? Colors.primaryBeige : '#f4f3f4'}
              onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
              value={notificationsEnabled}
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>언어</Text>
            <View style={styles.menuValueContainer}>
              <Text style={styles.menuValueText}>한국어</Text>
              <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
            </View>
          </TouchableOpacity>

          {!isPremiumUser && (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('Premium')}
            >
              <Text style={styles.menuText}>FIVLO 프리미엄 멤버십</Text>
              <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Info')}
          >
            <Text style={styles.menuText}>정보</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem_last}>
            <Text style={styles.menuText}>신고하기</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
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
    profileContainer: {
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
    },
    profileTextContainer: {
        flex: 1,
    },
    profileName: {
        fontSize: FontSizes.large,
        fontWeight: FontWeights.bold,
        color: Colors.textDark,
    },
    premiumInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    profileStatus_general: {
        fontSize: FontSizes.small,
        color: Colors.secondaryBrown,
        marginTop: 4,
    },
    profileStatus_premium: {
        fontSize: FontSizes.small,
        color: Colors.accentApricot,
        fontWeight: FontWeights.bold,
    },
    profileCoins: {
        fontSize: FontSizes.small,
        color: Colors.secondaryBrown,
        fontWeight: FontWeights.medium,
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
    menuValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuValueText: {
        fontSize: FontSizes.medium,
        color: Colors.secondaryBrown,
        marginRight: 10,
    },
});

export default SettingsScreen;