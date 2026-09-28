import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 120000, // 2 minutes for heavy video processing
});

export const detectImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/detect/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const detectVideo = async (file, sampleRateFps = 1.0) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sample_rate_fps', sampleRateFps);
  const response = await api.post('/detect/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getAnalysisHistory = async (params = {}) => {
  const response = await api.get('/history', { params });
  return response.data;
};

export const deleteHistoryItem = async (id) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};

export const clearAllHistory = async () => {
  const response = await api.delete('/history');
  return response.data;
};

export const getModelEvaluationMetrics = async () => {
  const response = await api.get('/model/metrics');
  return response.data;
};

export const getHealthStatus = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const exportReport = async (analysisData) => {
  const response = await api.post('/reports/export', analysisData);
  return response.data;
};

export default api;
