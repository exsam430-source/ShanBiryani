import api from './api.js';

export const orderService = {
  // Create Order (Public/Customer)
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Track Order (Public)
  trackOrder: async (orderNumber) => {
    const response = await api.get(`/orders/track/${orderNumber}`);
    return response.data;
  },

  // Get My Orders (Customer)
  getMyOrders: async (params) => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  // Get All Orders (Admin/Staff)
  getOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get Single Order (Admin/Staff)
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Get Today's Orders (Admin/Staff)
  getTodayOrders: async () => {
    const response = await api.get('/orders/today');
    return response.data;
  },

  // Get Orders By Status (Admin/Staff)
  getOrdersByStatus: async (status) => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },

  // Get Customer Orders (Admin/Staff)
  getCustomerOrders: async (phone) => {
    const response = await api.get(`/orders/customer/${phone}`);
    return response.data;
  },

  // Update Order Status (Admin/Staff)
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Update Payment Status (Admin/Staff)
  updatePaymentStatus: async (id, paymentStatus, paymentMethod) => {
    const response = await api.patch(`/orders/${id}/payment`, { paymentStatus, paymentMethod });
    return response.data;
  },

  // Delete Order (Admin)
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};