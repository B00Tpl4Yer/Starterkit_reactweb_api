import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Star, Truck, ShieldCheck, Heart, Share2, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import productService from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getProduct(id);
            setProduct(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Produk tidak ditemukan');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 999)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }

        try {
            setAddingToCart(true);
            await addToCart(product.id, quantity);
            alert('Produk berhasil ditambahkan ke keranjang!');
            setQuantity(1);
        } catch (err) {
            alert(err.message || 'Gagal menambahkan ke keranjang');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
            return;
        }

        try {
            setIsDeleting(true);
            await productService.deleteProduct(product.id);
            alert('Produk berhasil dihapus!');
            navigate('/products');
        } catch (err) {
            alert(err.message || 'Gagal menghapus produk');
            console.error('Error deleting product:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-12 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-gray-500 mt-4">Memuat produk...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="pt-24 pb-12 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">{error || 'Produk tidak ditemukan'}</p>
                    <Link to="/products">
                        <Button variant="primary">Kembali ke Katalog</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 bg-[#FFFBF5] min-h-screen">
            <div className="container mx-auto px-4">
                <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Kembali ke Katalog
                </Link>

                <div className="bg-white rounded-[2rem] shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative rounded-3xl overflow-hidden bg-gray-50 h-[500px]"
                    >
                        <img 
                            src={product.image_url || product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                        {product.discount && (
                             <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                                -{product.discount}%
                            </div>
                        )}
                    </motion.div>

                    {/* Info Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col justify-center"
                    >
                        <div>
                             <div className="flex items-center justify-between mb-2">
                                {product.category && (
                                    <span className="text-orange-600 font-bold uppercase tracking-wider text-sm bg-orange-50 px-3 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                )}
                                <div className="flex space-x-3 text-gray-400 ml-auto">
                                    <button className="hover:text-red-500 transition-colors"><Heart size={24} /></button>
                                    <button className="hover:text-blue-500 transition-colors"><Share2 size={24} /></button>
                                </div>
                             </div>
                             
                             <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                             
                             <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center text-yellow-400">
                                    <Star className="fill-current w-5 h-5" />
                                    <span className="ml-1 font-bold text-gray-700">{product.rating || '5.0'}</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-500">
                                    Stok: <span className="font-bold text-orange-600">{product.stock}</span>
                                </span>
                             </div>

                             <div className="flex items-baseline space-x-4 mb-6">
                                <span className="text-4xl font-bold text-orange-600">
                                    Rp {((product.price || 0) - ( 0)).toLocaleString('id-ID')}
                                </span>
                             </div>
                             
                             <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {product.description}
                             </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-3">
                            {/* Admin Edit & Delete */}
                            {isAdmin() && (
                                <div className="flex space-x-3">
                                    <Link to={`/products/${product.id}/edit`} className="flex-1">
                                        <Button 
                                            fullWidth 
                                            variant="ghost"
                                            className="flex items-center justify-center space-x-2 border-2 border-orange-500 text-orange-600"
                                        >
                                            <Edit2 size={20} />
                                            <span>Edit</span>
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <Trash2 size={20} />
                                        <span>{isDeleting ? 'Menghapus...' : 'Hapus'}</span>
                                    </button>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="flex items-center border-2 border-gray-200 rounded-full px-4 w-full sm:w-32 justify-between">
                                <button 
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="text-xl font-bold text-gray-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    -
                                </button>
                                <span className="font-bold text-gray-800">{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                    className="text-xl font-bold text-gray-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>
                            
                            <Button 
                                fullWidth 
                                variant="primary"
                                onClick={handleAddToCart}
                                disabled={addingToCart || product.stock === 0}
                            >
                                {addingToCart ? 'Menambahkan...' : product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <Truck className="text-orange-500" size={24} />
                                <span className="text-sm font-medium">Pengiriman Cepat</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <ShieldCheck className="text-green-500" size={24} />
                                <span className="text-sm font-medium">Jaminan Segar</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
