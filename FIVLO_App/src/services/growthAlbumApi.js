// src/services/growthAlbumApi.js

import apiClient from './apiClient';

// 성장앨범 업로드용 Presigned URL 요청
export const getPresignedUrl = async (fileData) => {
  const response = await apiClient.post('/growth-album/upload/presigned-url', fileData);
  return response.data;
};

// 성장앨범 사진 정보 저장 (Task와 연동)
export const uploadGrowthAlbumPhoto = async (taskId, albumData) => {
  // formData를 위해 헤더를 multipart/form-data로 설정
  const response = await apiClient.post(`/tasks/${taskId}/growth-album`, albumData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 성장앨범 캘린더 뷰 조회
export const getGrowthAlbumCalendar = async (year, month) => {
  const response = await apiClient.get(`/growth-album/calendar?year=${year}&month=${month}`);
  return response.data;
};

// 성장앨범 카테고리별 뷰 조회
export const getGrowthAlbumCategories = async () => {
  const response = await apiClient.get('/growth-album/categories');
  return response.data;
};

// 성장앨범 상세 조회
export const getGrowthAlbumDetail = async (albumId) => {
  const response = await apiClient.get(`/growth-album/${albumId}`);
  return response.data;
};