import axiosInstance from '../config/axios';

const orderService = {
  // GET /orders - Get all user orders
  async getOrders() {
    try {
      const response = await axiosInstance.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /orders - Create order (Checkout)
  async createOrder(orderData) {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /orders/{order} - Get order detail
  async getOrder(orderId) {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /orders/{order}/cancel - Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await axiosInstance.post(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /orders/{order}/approve - Approve order (mark as completed)
  async approveOrder(orderId) {
    try {
      const response = await axiosInstance.post(`/orders/${orderId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default orderService;
