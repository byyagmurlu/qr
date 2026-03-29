// src/services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/backend/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 600000, 
});


// Attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qr_token');
      localStorage.removeItem('qr_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ─── Public ─────────────────────────────────
export const getSettings   = () => api.get('v1/settings').then(r => r.data.data);
export const getLanguages  = () => api.get('v1/languages').then(r => r.data.data);
export const getCategories = (lang = 'tr') => api.get(`v1/categories?lang=${lang}`).then(r => r.data.data);
export const getAllProducts = (lang = 'tr') => api.get(`v1/products?lang=${lang}`).then(r => r.data.data);
export const getProducts   = (slug, lang = 'tr') => api.get(`v1/categories/${slug}/products?lang=${lang}`).then(r => r.data.data);
export const getProduct    = (slug, lang = 'tr') => api.get(`v1/products/${slug}?lang=${lang}`).then(r => r.data.data);
export const getAllergens   = (lang = 'tr') => api.get(`v1/allergens?lang=${lang}`).then(r => r.data.data);

// ─── Admin Auth ─────────────────────────────
export const login          = (creds) => api.post('v1/admin/auth/login', creds);
export const getMe          = () => api.get('v1/admin/auth/me').then(r => r.data.data);
export const changePassword = (data) => api.post('v1/admin/auth/change-password', data);

// ─── Admin Settings ─────────────────────────
export const getAdminSettings    = () => api.get('v1/admin/settings').then(r => r.data.data);
export const updateAdminSettings = (data) => api.put('v1/admin/settings', data);
export const uploadSettingImage  = (key, formData) => api.post(`v1/admin/settings/upload/${key}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// ─── Admin Categories ────────────────────────
export const getAdminCategories    = () => api.get('v1/admin/categories').then(r => r.data.data);
export const createCategory        = (data) => api.post('v1/admin/categories', data);
export const updateCategory        = (id, data) => api.put(`v1/admin/categories/${id}`, data);
export const deleteCategory        = (id) => api.delete(`v1/admin/categories/${id}`);
export const uploadCategoryImage   = (id, formData) => api.post(`v1/admin/categories/${id}/image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// ─── Admin Products ──────────────────────────
export const getAdminProducts = (params = {}) => api.get('v1/admin/products', { params }).then(r => r.data);
export const getAdminProduct  = (id) => api.get(`v1/admin/products/${id}`).then(r => r.data.data);
export const createProduct    = (data) => api.post('v1/admin/products', data);
export const updateProduct    = (id, data) => api.put(`v1/admin/products/${id}`, data);
export const deleteProduct    = (id) => api.delete(`v1/admin/products/${id}`);
export const uploadImage      = (id, formData) => api.post(`v1/admin/products/${id}/image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const setAllergenOnProduct    = (id, data) => api.post(`v1/admin/products/${id}/allergens`, data);
export const removeAllergenFromProduct = (id, aId) => api.delete(`v1/admin/products/${id}/allergens/${aId}`);

// ─── Admin Allergens ─────────────────────────
export const getAdminAllergens = () => api.get('v1/admin/allergens').then(r => r.data.data);
export const createAllergen    = (data) => api.post('v1/admin/allergens', data);
export const updateAllergen    = (id, data) => api.put(`v1/admin/allergens/${id}`, data);
export const deleteAllergen    = (id) => api.delete(`v1/admin/allergens/${id}`);

// ─── Admin Translations ──────────────────────
export const getTranslations      = (type, id) => api.get('v1/admin/translations', { params: { type, id } }).then(r => r.data.data);
export const updateTranslations   = (data) => api.post('v1/admin/translations', data);
export const getAdminLanguages    = () => api.get('v1/languages').then(r => r.data.data);

// ─── Admin Bulk ──────────────────────────────
export const bulkImportProducts = (formData) => api.post('v1/admin/bulk/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const bulkExportUrl = `${BASE_URL}/v1/admin/bulk/export`;
export const bulkSampleUrl = `${BASE_URL}/admin/bulk/sample`;

export const aiTranslate = (data) => api.post('v1/admin/ai/translate', data);

export default api;
