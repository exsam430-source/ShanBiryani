import api from './api.js';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register Customer
  registerCustomer: async (data) => {
    const response = await api.post('/auth/register/customer', data);
    return response.data;
  },

  // Register Staff
  registerStaff: async (data) => {
    const response = await api.post('/auth/register/staff', data);
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  // Get All Users (Admin)
  getAllUsers: async (params) => {
    const response = await api.get('/auth/users', { params });
    return response.data;
  },

  // Get All Staff (Admin)
  getAllStaff: async (params) => {
    const response = await api.get('/auth/staff', { params });
    return response.data;
  },

  // Get Pending Staff (Admin)
  getPendingStaff: async () => {
    const response = await api.get('/auth/pending-staff');
    return response.data;
  },

  // Verify Staff (Admin)
  verifyStaff: async (id) => {
    const response = await api.patch(`/auth/verify-staff/${id}`);
    return response.data;
  },

  // Reject Staff (Admin)
  rejectStaff: async (id) => {
    const response = await api.delete(`/auth/reject-staff/${id}`);
    return response.data;
  },

  // Get All Customers (Admin)
  getAllCustomers: async (params) => {
    const response = await api.get('/auth/customers', { params });
    return response.data;
  },

  // Get User By ID (Admin)
  getUserById: async (id) => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  },

  // Update User (Admin)
  updateUser: async (id, data) => {
    const response = await api.put(`/auth/users/${id}`, data);
    return response.data;
  },

  // Delete User (Admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },

  // Toggle User Status (Admin)
  toggleUserStatus: async (id) => {
    const response = await api.patch(`/auth/users/${id}/toggle-status`);
    return response.data;
  },

  // Reset User Password (Admin)
  resetUserPassword: async (id, newPassword) => {
    const response = await api.patch(`/auth/users/${id}/reset-password`, { newPassword });
    return response.data;
  },

  // Get User Stats (Admin)
  getUserStats: async () => {
    const response = await api.get('/auth/stats');
    return response.data;
  }
};