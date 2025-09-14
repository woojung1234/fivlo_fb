// src/services/timeAttackApi.js

import apiClient from './apiClient';

// 타임어택 목표 목록 조회
export const getTimeAttackGoals = async () => {
  const response = await apiClient.get('/time-attack/goals');
  return response.data.goals || [];
};

// 타임어택 목표 생성
export const createTimeAttackGoal = async (goalData) => {
  const response = await apiClient.post('/time-attack/goals', goalData);
  return response.data;
};

// 타임어택 목표 수정
export const updateTimeAttackGoal = async (goalId, goalData) => {
  const response = await apiClient.patch(`/time-attack/goals/${goalId}`, goalData);
  return response.data;
};

// 타임어택 목표 삭제
export const deleteTimeAttackGoal = async (goalId) => {
  const response = await apiClient.delete(`/time-attack/goals/${goalId}`);
  return response.data;
};

// 타임어택 단계 추천
export const getRecommendedSteps = async (goalId) => {
  const response = await apiClient.post('/time-attack/recommend-steps', { goalId });
  return response.data;
};

// 타임어택 세션 생성
export const createTimeAttackSession = async (sessionData) => {
  const response = await apiClient.post('/time-attack/sessions', sessionData);
  return response.data;
};

// 타임어택 세션 목록 조회
export const getTimeAttackSessions = async () => {
  const response = await apiClient.get('/time-attack/sessions');
  return response.data.sessions || [];
};

// 타임어택 단계 생성
export const createTimeAttackStep = async (stepData) => {
  const response = await apiClient.post('/time-attack/steps', stepData);
  return response.data;
};

// 타임어택 단계 수정
export const updateTimeAttackStep = async (stepId, stepData) => {
  const response = await apiClient.patch(`/time-attack/steps/${stepId}`, stepData);
  return response.data;
};

// 타임어택 단계 조회 (목표별)
export const getTimeAttackSteps = async (goalId) => {
  const response = await apiClient.get(`/time-attack/steps?goalId=${goalId}`);
  return response.data.steps || [];
};