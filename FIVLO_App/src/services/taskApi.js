// src/services/taskApi.js

import apiClient from './apiClient';

// --- 카테고리 API ---

// 카테고리 생성
export const createCategory = async (categoryData) => {
  const response = await apiClient.post('/categories', categoryData);
  return response.data;
};

// 카테고리 목록 조회
export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data.categories || [];
};

// 카테고리 수정
export const updateCategory = async (categoryId, categoryData) => {
  const response = await apiClient.patch(`/categories/${categoryId}`, categoryData);
  return response.data;
};

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
  const response = await apiClient.delete(`/categories/${categoryId}`);
  return response.data;
};

// --- Task API ---

// Task 생성
export const createTask = async (taskData) => {
  const response = await apiClient.post('/tasks', taskData);
  return response.data;
};

// Task 목록 조회 (날짜별)
export const getTasksByDate = async (date) => {
  const response = await apiClient.get(`/tasks?date=${date}`);
  return response.data.tasks || [];
};

// Task 수정
export const updateTask = async (taskId, taskData) => {
  const response = await apiClient.patch(`/tasks/${taskId}`, taskData);
  return response.data;
};

// Task 완료 처리
export const completeTask = async (taskId) => {
  const response = await apiClient.patch(`/tasks/${taskId}/complete`);
  return response.data;
};

// Task 삭제
export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};

// Task 완료 코인 지급
export const awardTaskCompletionCoins = async (coinData) => {
  const response = await apiClient.post('/tasks/coins', coinData);
  return response.data;
};

// --- AI 연동 Task API ---

// AI 목표 기반 Task 생성 (7-3)
export const commitAIGoalToTask = async (goalId, commitData) => {
  const response = await apiClient.post(`/ai/goals/${goalId}/commit`, commitData);
  return response.data;
};