import api from './api.js';

export const dashboardService = {
  // Get Dashboard Overview
  getOverview: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Get Sales Analytics
  getAnalytics: async (days = 7) => {
    const response = await api.get('/dashboard/analytics', { params: { days } });
    return response.data;
  },

  // Get Recent Orders
  getRecentOrders: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-orders', { params: { limit } });
    return response.data;
  },

  // Get Recent Bills
  getRecentBills: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-bills', { params: { limit } });
    return response.data;
  },

  // Get Low Stock Items
  getLowStockItems: async () => {
    const response = await api.get('/dashboard/low-stock');
    return response.data;
  },

  // Get Category Sales
  getCategorySales: async (days = 30) => {
    const response = await api.get('/dashboard/category-sales', { params: { days } });
    return response.data;
  }
};