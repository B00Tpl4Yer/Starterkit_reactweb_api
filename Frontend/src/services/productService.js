import axiosInstance from '../config/axios';

const productService = {
  // GET /products - Get all active products
  async getProducts(params = {}) {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /products/{product} - Get product by ID
  async getProduct(id) {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /products/{product}/check-stock - Check stock availability
  async checkStock(id, quantity) {
    try {
      const response = await axiosInstance.post(`/products/${id}/check-stock`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /products - Create new product (Protected)
  async createProduct(productData) {
    try {
      const response = await axiosInstance.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PUT /products/{product} - Update product (Protected)
  async updateProduct(id, productData) {
    try {
      // Laravel doesn't handle PUT with multipart/form-data well
      // So we use POST with _method=PUT
      if (productData instanceof FormData) {
        productData.append('_method', 'PUT');
        const response = await axiosInstance.post(`/products/${id}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        const response = await axiosInstance.put(`/products/${id}`, productData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE /products/{product} - Delete product (Protected)
  async deleteProduct(id) {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default productService;
