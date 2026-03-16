import api from './api.js';

export const categoryService = {
  // Get All Categories
  getCategories: async (params) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  // Get Single Category
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create Category (Admin)
  createCategory: async (formData) => {
    const response = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update Category (Admin)
  updateCategory: async (id, formData) => {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete Category (Admin)
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Toggle Status (Admin)
  toggleStatus: async (id) => {
    const response = await api.patch(`/categories/${id}/toggle-status`);
    return response.data;
  },

  // Reorder Categories (Admin)
  reorderCategories: async (categories) => {
    const response = await api.put('/categories/reorder', { categories });
    return response.data;
  }
};