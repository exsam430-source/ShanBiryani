import api from './api.js';

export const menuService = {
  // Get All Menu Items
  getMenuItems: async (params) => {
    const response = await api.get('/menu', { params });
    return response.data;
  },

  // Get Single Item
  getMenuItem: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },

  // Get Featured Items
  getFeaturedItems: async () => {
    const response = await api.get('/menu/featured');
    return response.data;
  },

  // Search Items
  searchItems: async (query) => {
    const response = await api.get('/menu/search', { params: { q: query } });
    return response.data;
  },

  // Get Items By Category
  getItemsByCategory: async (categoryId) => {
    const response = await api.get(`/menu/category/${categoryId}`);
    return response.data;
  },

  // Get Low Stock Items (Admin)
  getLowStockItems: async () => {
    const response = await api.get('/menu/admin/low-stock');
    return response.data;
  },

  // Create Menu Item (Admin)
  createMenuItem: async (formData) => {
    const response = await api.post('/menu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update Menu Item (Admin)
  updateMenuItem: async (id, formData) => {
    const response = await api.put(`/menu/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete Menu Item (Admin)
  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },

  // Toggle Availability (Admin)
  toggleAvailability: async (id) => {
    const response = await api.patch(`/menu/${id}/toggle-availability`);
    return response.data;
  },

  // Toggle Featured (Admin)
  toggleFeatured: async (id) => {
    const response = await api.patch(`/menu/${id}/toggle-featured`);
    return response.data;
  },

  // Update Stock (Admin)
  updateStock: async (id, stock, action = 'set') => {
    const response = await api.patch(`/menu/${id}/stock`, { stock, action });
    return response.data;
  },

  // Bulk Update (Admin)
  bulkUpdate: async (ids, update) => {
    const response = await api.put('/menu/bulk-update', { ids, update });
    return response.data;
  },

  // Bulk Delete (Admin)
  bulkDelete: async (ids) => {
    const response = await api.delete('/menu/bulk-delete', { data: { ids } });
    return response.data;
  }
};