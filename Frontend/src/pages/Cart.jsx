import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cart, loading, fetchCart, updateCartItem, removeFromCart, clearCart: clearCartAction } = useCart();
    const [updatingItems, setUpdatingItems] = useState({});

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
            await updateCartItem(cartItemId, newQuantity);
        } catch (err) {
            alert(err.message || 'Gagal mengupdate jumlah');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

        try {
            await removeFromCart(cartItemId);
        } catch (err) {
            alert(err.message || 'Gagal menghapus item');
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) return;

        try {
            await clearCartAction();
        } catch (err) {
            alert(err.message || 'Gagal mengosongkan keranjang');
        }
    };

    const handleCheckout = () => {
        if (!cart?.items || cart.items.length === 0) {
            alert('Keranjang Anda kosong');
            return;
        }
        navigate('/checkout');
    };

    if (!isAuthenticated) {
        return (
            <div className="pt-24 pb-12 container mx-auto px-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Silakan login terlebih dahulu</h2>
                    <p className="text-gray-600 mb-6">Anda harus login untuk melihat keranjang belanja</p>
                    <Link to="/login">
                        <Button variant="primary">Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="pt-24 pb-12 container mx-auto px-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-gray-500 mt-4">Memuat keranjang...</p>
                </div>
            </div>
        );
    }

    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
    const shippingCost = 10000;
    const total = subtotal + shippingCost;

    return (
        <div className="pb-12 container mx-auto px-4 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Keranjang Belanja</h1>
                {cartItems.length > 0 && (
                    <Button variant="ghost" className="text-red-500 p-0 sm:p-2" onClick={handleClearCart}>
                        Kosongkan Keranjang
                    </Button>
                )}
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-grow space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm gap-4">
                            <div className="flex items-center w-full sm:w-auto flex-1">
                                <img 
                                    src={item.product?.image_url || item.product?.image}
                                    alt={item.product?.name} 
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0" 
                                />
                                <div className="ml-4 flex-grow">
                                    <Link to={`/products/${item.product_id}`}>
                                        <h3 className="font-bold text-gray-800 hover:text-orange-600 line-clamp-1">
                                            {item.product?.name}
                                        </h3>
                                    </Link>
                                    <p className="text-orange-600 font-semibold text-sm sm:text-base">
                                        Rp {((item.product?.price || 0) - ( 0)).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={updatingItems[item.id] || item.quantity <= 1}
                                        className="p-1 sm:p-2 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="px-3 sm:px-4 font-medium text-gray-800 text-sm">{item.quantity}</span>
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        disabled={updatingItems[item.id]}
                                        className="p-1 sm:p-2 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-400 block sm:hidden">Subtotal</p>
                                    <span className="font-bold text-gray-800 text-sm sm:text-base">
                                        Rp {(item.product?.price * item.quantity).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-600 p-2 ml-auto"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {cartItems.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <p className="text-gray-500 text-lg mb-4">Keranjang belanja Anda kosong.</p>
                            <Link to="/products">
                                <Button variant="primary">Mulai Belanja</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Summary */}
                {cartItems.length > 0 && (
                    <div className="w-full lg:w-80">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Ringkasan Pesanan</h3>
                            <div className="space-y-2 mb-6 border-b pb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    {/* <span className="text-gray-600">Ongkir</span>
                                    <span className="font-bold">Rp {shippingCost.toLocaleString('id-ID')}</span> */}
                                </div>
                            </div>
                            <div className="flex justify-between mb-6 text-lg font-bold">
                                <span>Total</span>
                                <span className="text-orange-600">Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                            <Button fullWidth variant="primary" onClick={handleCheckout}>
                                Lanjut ke Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
