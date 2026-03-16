// frontend/src/services/billService.js
import api from './api.js';

export const billService = {
  // Create bill
  createBill: async (data) => {
    const response = await api.post('/bills', data);
    return response.data;
  },

  // Get all bills
  getBills: async (params) => {
    const response = await api.get('/bills', { params });
    return response.data;
  },

  // Get single bill
  getBill: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  // Get bill by number
  getBillByNumber: async (billNumber) => {
    const response = await api.get(`/bills/number/${billNumber}`);
    return response.data;
  },

  // Get today's bills
  getTodayBills: async () => {
    const response = await api.get('/bills/today');
    return response.data;
  },

  // Update bill
  updateBill: async (id, data) => {
    const response = await api.put(`/bills/${id}`, data);
    return response.data;
  },

  // Delete bill
  deleteBill: async (id) => {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },

  // Mark as printed
  markAsPrinted: async (id) => {
    const response = await api.patch(`/bills/${id}/printed`);
    return response.data;
  },

  // Get sales report
  getSalesReport: async (params) => {
    const response = await api.get('/bills/report/sales', { params });
    return response.data;
  },

  // Export bills to CSV
  exportBills: async (params) => {
    const response = await api.get('/bills/export/csv', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};