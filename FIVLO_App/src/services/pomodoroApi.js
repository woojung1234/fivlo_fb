// src/services/pomodoroApi.js

import apiClient from './apiClient';

// 뽀모도로 목표 목록 조회
export const getPomodoroGoals = async () => {
  const response = await apiClient.get('/pomodoro/goals');
  return response.data.goals || [];
};

// 뽀모도로 목표 생성
export const createPomodoroGoal = async (goalData) => {
  const response = await apiClient.post('/pomodoro/goals', goalData);
  return response.data;
};

// 뽀모도로 목표 수정
export const updatePomodoroGoal = async (goalId, goalData) => {
  const response = await apiClient.patch(`/pomodoro/goals/${goalId}`, goalData);
  return response.data;
};

// 뽀모도로 목표 삭제
export const deletePomodoroGoal = async (goalId) => {
  const response = await apiClient.delete(`/pomodoro/goals/${goalId}`);
  return response.data;
};

// 뽀모도로 세션 시작
export const startPomodoroSession = async (sessionData) => {
  const response = await apiClient.post('/pomodoro/sessions/start', sessionData);
  return response.data;
};

// 뽀모도로 세션 종료
export const endPomodoroSession = async (sessionData) => {
  const response = await apiClient.post('/pomodoro/sessions/end', sessionData);
  return response.data;
};

// 뽀모도로 완료 시 코인 지급
export const awardPomodoroCoins = async (coinData) => {
  const response = await apiClient.post('/pomodoro/coins', coinData);
  return response.data;
};