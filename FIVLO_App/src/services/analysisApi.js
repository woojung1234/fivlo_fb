// src/services/analysisApi.js

import apiClient from './apiClient';

// 일간 분석 데이터 조회
export const getDailyAnalysis = async (date) => {
  const response = await apiClient.get(`/analysis/daily?date=${date}`);
  return response.data;
};

// 주간 분석 데이터 조회
export const getWeeklyAnalysis = async (startDate) => {
  const response = await apiClient.get(`/analysis/weekly?start_date=${startDate}`);
  return response.data;
};

// 월간 분석 데이터 조회
export const getMonthlyAnalysis = async (year, month) => {
  const response = await apiClient.get(`/analysis/monthly?year=${year}&month=${month}`);
  return response.data;
};

// 월간 AI 제안 조회
export const getMonthlyAISuggestions = async (year, month) => {
  const response = await apiClient.get(`/analysis/monthly/ai-suggestions?year=${year}&month=${month}`);
  return response.data;
};

// D-Day 목표 분석 생성
export const createDDayGoal = async (goalData) => {
  const response = await apiClient.post('/analysis/goals', goalData);
  return response.data;
};

// D-Day 목표 분석 조회
export const getDDayAnalysis = async (goalId) => {
  const response = await apiClient.get(`/analysis/goals/${goalId}`);
  return response.data;
};