import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await productService.createProduct(formData);
      
      alert('Produk berhasil ditambahkan!');
      navigate('/products');
    } catch (err) {
      const errorMessage = err.message || 'Gagal menambahkan produk';
      setError(errorMessage);
      console.error('Error creating product:', err);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-12 container mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/products">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tambah Produk Baru</h1>
          <p className="text-gray-500 mt-1">Daftarkan produk baru ke katalog Cemilan Sultan</p>
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
          initialData={{}}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Tambah Produk"
        />
      </motion.div>
    </div>
  );
};

export default AddProduct;
