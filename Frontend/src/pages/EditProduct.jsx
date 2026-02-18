import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat produk';
      setError(errorMessage);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await productService.updateProduct(id, formData);
      
      alert('Produk berhasil diperbarui!');
      navigate('/products');
    } catch (err) {
      const errorMessage = err.message || 'Gagal memperbarui produk';
      setError(errorMessage);
      console.error('Error updating product:', err);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-12 container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 mt-4">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pb-12 container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Produk tidak ditemukan'}</p>
          <Link to="/products">
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Kembali ke Katalog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 container mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/products">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Produk</h1>
          <p className="text-gray-500 mt-1">{product?.name}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Simpan Perubahan"
        />
      </motion.div>
    </div>
  );
};

export default EditProduct;
