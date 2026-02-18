import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import productService from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = ['All', 'Buah Segar', 'Dessert', 'Minuman', 'Parcel'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Gagal memuat produk');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Katalog Produk</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Temukan buah segar dan olahan terbaik kami</p>
          </div>
          
          {isAdmin() && (
            <Link to="/products/add">
              <Button variant="primary" className="flex items-center space-x-2 whitespace-nowrap w-full sm:w-auto justify-center sm:justify-start">
                <Plus size={20} />
                <span>Tambah Produk</span>
              </Button>
            </Link>
          )}
        </div>
          
        {/* Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === cat 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-500 mt-4">Memuat produk...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Tidak ada produk ditemukan untuk kategori ini.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
