import api from './api.js';

export const settingsService = {
  // Get Public Settings
  getPublicSettings: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  },

  // Get All Settings (Admin)
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update Settings (Admin)
  updateSettings: async (data) => {
    const response = await api.put('/settings', data);
    return response.data;
  },

  // Update Logo (Admin)
  updateLogo: async (formData) => {
    const response = await api.put('/settings/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update Opening Hours (Admin)
  updateOpeningHours: async (openingHours) => {
    const response = await api.put('/settings/opening-hours', { openingHours });
    return response.data;
  },

  // Update Tax Settings (Admin)
  updateTaxSettings: async (data) => {
    const response = await api.put('/settings/tax', data);
    return response.data;
  },

  // Update Order Settings (Admin)
  updateOrderSettings: async (data) => {
    const response = await api.put('/settings/order', data);
    return response.data;
  },

  // Toggle Accepting Orders (Admin)
  toggleAcceptingOrders: async () => {
    const response = await api.patch('/settings/toggle-orders');
    return response.data;
  }
};