import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, 1);
      alert('Produk berhasil ditambahkan ke keranjang!');
    } catch (err) {
      alert(err.message || 'Gagal menambahkan ke keranjang');
    } finally {
      setAdding(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 relative"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={product.image_url || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
              -{product.discount}%
            </div>
          )}
        </Link>
        <div className="absolute bottom-4 right-4 z-10 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
           <Button 
             variant="primary" 
             className="p-3 rounded-full !px-3 shadow-lg" 
             onClick={handleAddToCart}
             disabled={adding || product.stock === 0}
           >
             <ShoppingCart size={20} />
           </Button>
        </div>
      </div>

      <div className="p-6">
        <Link to={`/products/${product.id}`}>
          {product.category && (
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full mb-2">
              {product.category}
            </span>
          )}
          
          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-500 text-sm font-medium">{product.rating || '5.0'}</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-orange-600">
              Rp{((product.price || 0) - ( 0)).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Stok: {product.stock}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
