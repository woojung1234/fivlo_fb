// src/styles/GlobalStyles.js
import { StyleSheet } from 'react-native';
import { Colors } from './color';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBeige, // 연한 베이지/크림 배경색
  },
  textBase: {
    fontSize: 16,
    color: Colors.textDark,
  },
});