import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { ArrowLeft, Package, User, Phone, MapPin, CreditCard, Truck, CheckCircle, Clock, FileText } from 'lucide-react';
import orderService from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, isAdmin } = useAuth();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderService.getOrder(orderId);
            setOrder(response.data);
        } catch (err) {
            setError(err.message || 'Gagal memuat detail pesanan');
            console.error('Error fetching order detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOrder = async () => {
        if (!window.confirm('Apakah Anda yakin ingin menyelesaikan pesanan ini?')) {
            return;
        }

        try {
            setProcessing(true);
            const response = await orderService.approveOrder(orderId);
            alert(response.message || 'Pesanan berhasil diselesaikan');
            setOrder(response.data);
        } catch (err) {
            alert(err.message || 'Gagal menyelesaikan pesanan');
            console.error('Error approving order:', err);
        } finally {
            setProcessing(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock },
            processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Package },
            completed: { label: 'Selesai', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
            cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 border-red-300', icon: Package },
        };
        return configs[status] || configs.pending;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-12">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Tidak Ditemukan</h2>
                <p className="text-gray-600 mb-6">{error || 'Pesanan yang Anda cari tidak ditemukan'}</p>
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                    Kembali ke Dashboard
                </Button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Detail Pesanan</h1>
                        <p className="text-gray-600 mt-1">Order ID: #{order.id}</p>
                    </div>
                </div>

                <Link to={`/invoice/${order.id}`}>
                    <Button variant="secondary" className="flex items-center space-x-2">
                        <FileText size={18} />
                        <span>Lihat Invoice</span>
                    </Button>
                </Link>
            </div>

            {/* Status Card */}
            <div className={`rounded-2xl border-2 p-6 ${statusConfig.color}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <StatusIcon size={32} />
                        <div>
                            <p className="text-sm font-medium opacity-80">Status Pesanan</p>
                            <p className="text-2xl font-bold">{statusConfig.label}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-80">Tanggal Pesanan</p>
                        <p className="font-semibold">{new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info & Delivery */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <User size={22} className="text-orange-500" />
                            <span>Informasi Customer</span>
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Phone size={20} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Nomor Telepon</p>
                                    <p className="font-semibold text-gray-800">{order.customer_phone}</p>
                                </div>
                            </div>
                            {order.delivery_type === 'delivery' && order.delivery_address && (
                                <div className="flex items-start space-x-3">
                                    <MapPin size={20} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                                        <p className="font-semibold text-gray-800">{order.delivery_address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <Package size={22} className="text-orange-500" />
                            <span>Produk Pesanan</span>
                        </h2>
                        <div className="space-y-3">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">Jumlah: {item.quantity}x</p>
                                        <p className="text-sm font-medium text-orange-600 mt-1">
                                            Rp {((item.price || 0) - ( 0)).toLocaleString('id-ID')}  / pcs
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">
                                            Rp {(item.price * item.quantity)?.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {order.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <h3 className="font-semibold text-blue-900 mb-2">Catatan Pesanan</h3>
                            <p className="text-blue-800">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Summary & Actions */}
                <div className="space-y-6">
                    {/* Payment & Delivery Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Transaksi</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Truck size={20} className="text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Tipe Pengiriman</p>
                                    <p className="font-semibold text-gray-800 capitalize">
                                        {order.delivery_type === 'delivery' ? 'Diantar' : 'Ambil Sendiri'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <CreditCard size={20} className="text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Metode Pembayaran</p>
                                    <p className="font-semibold text-gray-800">
                                        {order.payment_method === 'store' ? 'Bayar di Toko' : 'Cash on Delivery'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-orange-50 rounded-2xl border-2 border-orange-200 p-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal Produk</span>
                            <span className="font-semibold text-gray-800">
                                Rp {((order.total_amount || 0) - (order.shipping_cost || 0)).toLocaleString('id-ID')}
                            </span>
                        </div>
                        {order.delivery_type === 'delivery' && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Ongkir</span>
                                <span className="font-semibold text-gray-800">
                                    Rp {(order.shipping_cost || 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                        )}
                        <div className="border-t border-orange-200 my-4"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Total</span>
                            <span className="text-2xl font-bold text-orange-600">
                                 Rp {((order.total_amount || 0) - ( 0)).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                    {isAdmin() && (
                        <div>
                            {/* Actions */}
                            {order.status === 'pending' && (
                                <Button
                                    variant="primary"
                                    className="w-full flex items-center justify-center space-x-2"
                                    onClick={handleApproveOrder}
                                    disabled={processing}
                                >
                                    <CheckCircle size={20} />
                                    <span>{processing ? 'Memproses...' : 'Selesaikan Pesanan'}</span>
                                </Button>
                            )}
                        </div>
                    )}


                    <Link to={`/invoice/${order.id}`}>
                        <Button variant="secondary" className="w-full flex items-center justify-center space-x-2">
                            <FileText size={20} />
                            <span>Download Invoice</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetail;
