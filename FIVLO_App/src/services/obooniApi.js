// src/services/obooniApi.js

import apiClient from './apiClient';

// 오분이 상점 아이템 목록 조회 (GET /api/v1/oboone/shop)
export const getShopItems = async () => {
  const response = await apiClient.get('/oboone/shop');
  return response.data.items || []; // <-- 응답 구조에 맞춰 수정: response.data.items
};

// 오분이 아이템 구매 (POST /api/v1/oboone/purchase)
export const purchaseItem = async (itemId) => {
  const response = await apiClient.post('/oboone/purchase', { itemId });
  return response.data.data; // <-- 응답 구조에 맞춰 수정: response.data.data
};

// 오분이 보유 아이템 조회 (GET /api/v1/oboone/closet)
export const getOwnedItems = async () => {
  const response = await apiClient.get('/oboone/closet');
  return response.data.data.inventory.items || []; // <-- 응답 구조에 맞춰 수정: response.data.data.inventory.items
};

// 오분이 아이템 착용 (PATCH /api/v1/oboone/equip/{userItemId})
export const equipItem = async (userItemId) => {
  const response = await apiClient.patch(`/oboone/equip/${userItemId}`);
  return response.data.data; // <-- 응답 구조에 맞춰 수정: response.data.data
};

// 오분이 아이템 착용 해제 (PATCH /api/v1/oboone/unequip/{userItemId})
export const unequipItem = async (userItemId) => {
  const response = await apiClient.patch(`/oboone/unequip/${userItemId}`);
  return response.data.data; // <-- 응답 구조에 맞춰 수정: response.data.data
};

// 8-6. 현재 오분이 모습 조회 (GET /api/avatar) - Postman 가이드에는 /api/avatar
export const getObooniAvatar = async () => {
  const response = await apiClient.get('/avatar'); // Postman 가이드에 따르면 /api/avatar
  return response.data.avatar; // <-- 응답 구조에 맞춰 수정: response.data.avatar
};
