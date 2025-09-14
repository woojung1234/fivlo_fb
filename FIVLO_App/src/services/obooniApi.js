// src/services/obooniApi.js

import apiClient from './apiClient';

// 오분이 상점 아이템 목록 조회
export const getShopItems = async () => {
  const response = await apiClient.get('/oboone/shop');
  return response.data.items || [];
};

// 오분이 아이템 생성 (관리자용)
export const createObooniItem = async (itemData) => {
  const response = await apiClient.post('/oboone/item', itemData);
  return response.data;
};

// 오분이 아이템 구매
export const purchaseItem = async (itemId) => {
  const response = await apiClient.post('/oboone/purchase', { itemId });
  return response.data;
};

// 오분이 보유 아이템 조회 (옷장)
export const getOwnedItems = async () => {
  const response = await apiClient.get('/oboone/closet');
  return response.data.items || [];
};

// 오분이 아이템 착용
export const equipItem = async (userItemId) => {
  const response = await apiClient.patch(`/oboone/equip/${userItemId}`);
  return response.data;
};

// 오분이 아이템 착용 해제
export const unequipItem = async (userItemId) => {
  const response = await apiClient.patch(`/oboone/unequip/${userItemId}`);
  return response.data;
};