import axiosInstance from '../config/axios';

const cartService = {
  // GET /cart - Get user's cart
  async getCart() {
    try {
      const response = await axiosInstance.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /cart/items - Add item to cart
  async addItem(productId, quantity = 1) {
    try {
      const response = await axiosInstance.post('/cart/items', {
        product_id: productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PUT /cart/items/{cartItem} - Update cart item quantity
  async updateItem(cartItemId, quantity) {
    try {
      const response = await axiosInstance.put(`/cart/items/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE /cart/items/{cartItem} - Remove item from cart
  async removeItem(cartItemId) {
    try {
      const response = await axiosInstance.delete(`/cart/items/${cartItemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE /cart/clear - Clear entire cart
  async clearCart() {
    try {
      const response = await axiosInstance.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default cartService;
