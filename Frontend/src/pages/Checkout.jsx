import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { cart, fetchCart } = useCart();
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        customer_phone: '',
        delivery_address: '',
        delivery_city: '',
        delivery_postal_code: '',
        delivery_type: 'delivery',
        payment_method: 'store',
        notes: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        checkCart();
    }, [isAuthenticated, navigate]);

    const checkCart = async () => {
        try {
            setLoading(true);
            await fetchCart();
            if (!cart?.items || cart.items.length === 0) {
                alert('Keranjang Anda kosong');
                navigate('/cart');
                return;
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            alert('Gagal memuat data keranjang');
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Nomor telepon wajib diisi';
        }
        if (!formData.delivery_address.trim()) {
            newErrors.delivery_address = 'Alamat pengiriman wajib diisi';
        }
        if (!formData.delivery_city.trim()) {
            newErrors.delivery_city = 'Kota wajib diisi';
        }
        if (!formData.delivery_postal_code.trim()) {
            newErrors.delivery_postal_code = 'Kode pos wajib diisi';
        }
        if (!formData.delivery_type) {
            newErrors.delivery_type = 'Pilih tipe pengiriman';
        }
        if (!formData.payment_method) {
            newErrors.payment_method = 'Pilih metode pembayaran';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }

        try {
            setSubmitting(true);
            const response = await orderService.createOrder(formData);
            await fetchCart();
            setStep(3);
        } catch (err) {
            const errorMessage = err.message || 'Gagal membuat pesanan';
            alert(errorMessage);
            console.error('Error creating order:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="pb-12 container mx-auto px-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-gray-500 mt-4">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="py-20 container mx-auto px-4 text-center">
                <div className="inline-flex bg-green-100 p-6 rounded-full text-green-600 mb-6">
                    <CheckCircle size={64} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Pesanan Berhasil!</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Terima kasih telah berbelanja di Cemilan Sultan. Pesanan Anda sedang diproses dan kami akan menghubungi Anda segera.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/">
                        <Button variant="primary">Kembali ke Beranda</Button>
                    </Link>
                    <Link to="/dashboard">
                        <Button variant="ghost">Lihat Pesanan Saya</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
    const shippingCost = formData.delivery_type === 'delivery' ? 10000 : 0;
    const total = subtotal + shippingCost;

    return (
        <div className="pb-12 container mx-auto px-4">
            <div className="flex items-center mb-8">
                <Link to="/cart" className="mr-2 sm:mr-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Checkout</h1>
            </div>
            
            <form onSubmit={handleSubmitOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informasi Pengiriman */}
                        <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-bold mb-6">Informasi Pengiriman</h2>
                            <div className="space-y-4">
                                <Input 
                                    label="Nomor Telepon *" 
                                    name="customer_phone"
                                    placeholder="0812..."
                                    value={formData.customer_phone}
                                    onChange={handleInputChange}
                                    error={errors.customer_phone}
                                />
                                <Input 
                                    label="Alamat Lengkap *" 
                                    name="delivery_address"
                                    placeholder="Jl. Sultan..."
                                    value={formData.delivery_address}
                                    onChange={handleInputChange}
                                    error={errors.delivery_address}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input 
                                        label="Kota *" 
                                        name="delivery_city"
                                        placeholder="Jakarta"
                                        value={formData.delivery_city}
                                        onChange={handleInputChange}
                                        error={errors.delivery_city}
                                    />
                                    <Input 
                                        label="Kode Pos *" 
                                        name="delivery_postal_code"
                                        placeholder="12345"
                                        value={formData.delivery_postal_code}
                                        onChange={handleInputChange}
                                        error={errors.delivery_postal_code}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                        rows="3"
                                        placeholder="Tambahan informasi untuk pengiriman..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tipe Pengiriman */}
                        <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-bold mb-6">Tipe Pengiriman *</h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all" style={{ borderColor: formData.delivery_type === 'delivery' ? '#FF6B00' : '#E5E7EB' }}>
                                    <input
                                        type="radio"
                                        name="delivery_type"
                                        value="delivery"
                                        checked={formData.delivery_type === 'delivery'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-orange-500"
                                    />
                                    <span className="ml-3 font-medium text-gray-800 text-sm sm:text-base">Pengiriman ke Alamat</span>
                                </label>
                                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all" style={{ borderColor: formData.delivery_type === 'pickup' ? '#FF6B00' : '#E5E7EB' }}>
                                    <input
                                        type="radio"
                                        name="delivery_type"
                                        value="pickup"
                                        checked={formData.delivery_type === 'pickup'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-orange-500"
                                    />
                                    <span className="ml-3 font-medium text-gray-800 text-sm sm:text-base">Ambil di Toko</span>
                                </label>
                                {errors.delivery_type && <p className="text-red-500 text-sm">{errors.delivery_type}</p>}
                            </div>
                        </div>

                        {/* Metode Pembayaran */}
                        <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-bold mb-6">Metode Pembayaran *</h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all" style={{ borderColor: formData.payment_method === 'store' ? '#FF6B00' : '#E5E7EB' }}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="store"
                                        checked={formData.payment_method === 'store'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-orange-500"
                                    />
                                    <span className="ml-3 font-medium text-gray-800 text-sm sm:text-base">Bayar di Toko</span>
                                </label>
                                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all" style={{ borderColor: formData.payment_method === 'cod' ? '#FF6B00' : '#E5E7EB' }}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cod"
                                        checked={formData.payment_method === 'cod'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-orange-500"
                                    />
                                    <span className="ml-3 font-medium text-gray-800 text-sm sm:text-base">Bayar saat Barang Sampai (COD)</span>
                                </label>
                                {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Ringkasan Pesanan</h3>
                            
                            {/* Delivery Type Info */}
                            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Tipe Pengiriman:</span> 
                                    <span className="text-orange-600 font-medium ml-2">
                                        {formData.delivery_type === 'delivery' ? '🚚 Pengiriman ke Alamat' : '🏪 Ambil di Toko'}
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-3 mb-6 border-b pb-4 max-h-64 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <span className="flex-grow">
                                            {item.product?.name} <span className="text-gray-500">(x{item.quantity})</span>
                                        </span>
                                        <span className="font-medium">
                                            Rp {(item.product?.price * item.quantity).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 mb-6 border-b pb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                {formData.delivery_type === 'delivery' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Ongkir</span>
                                        <span className="font-medium">Rp {shippingCost.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between mb-6 text-xl font-bold">
                                <span>Total</span>
                                <span className="text-orange-600">Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                            <Button 
                                fullWidth 
                                variant="primary" 
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Memproses...' : 'Buat Pesanan'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
