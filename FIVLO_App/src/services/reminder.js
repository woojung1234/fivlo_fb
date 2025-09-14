// src/services/reminder.js

import apiClient from './apiClient';

// 주소 검색
export const searchAddress = async (query) => {
  const response = await apiClient.get(`/geo/search-address?query=${encodeURIComponent(query)}`);
  return response.data;
};

// 알림 생성
export const createReminder = async (reminderData) => {
  const response = await apiClient.post('/reminders', reminderData);
  return response.data;
};

// 알림 목록 조회
export const getReminders = async () => {
  const response = await apiClient.get('/reminders');
  return response.data.reminders || [];
};

// 알림 수정
export const updateReminder = async (reminderId, updateData) => {
  const response = await apiClient.patch(`/reminders/${reminderId}`, updateData);
  return response.data;
};

// 알림 삭제
export const deleteReminder = async (reminderId) => {
  const response = await apiClient.delete(`/reminders/${reminderId}`);
  return response.data;
};

// 알림 완료 처리
export const completeReminder = async (reminderId) => {
  const response = await apiClient.patch(`/reminders/${reminderId}/complete`);
  return response.data;
};

// 일일 체크 및 보상
export const dailyCheckAndReward = async () => {
  const response = await apiClient.post('/reminders/daily-check-and-reward');
  return response.data;
};