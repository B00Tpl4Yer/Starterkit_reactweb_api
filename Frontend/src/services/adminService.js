import axiosInstance from '../config/axios';

const adminService = {
  // GET /admin/users - Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /admin/orders - Get all orders (admin only)
  async getAllOrders() {
    try {
      const response = await axiosInstance.get('/admin/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE /admin/users/{id} - Delete user and all related data (admin only)
  async deleteUser(userId) {
    try {
      const response = await axiosInstance.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default adminService;
