import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Gagal memuat pesanan');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        label: 'Menunggu', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300', 
        icon: Clock,
        textColor: 'text-yellow-700'
      },
      processing: { 
        label: 'Diproses', 
        color: 'bg-blue-100 text-blue-700 border-blue-300', 
        icon: Package,
        textColor: 'text-blue-700'
      },
      completed: { 
        label: 'Selesai', 
        color: 'bg-green-100 text-green-700 border-green-300', 
        icon: CheckCircle,
        textColor: 'text-green-700'
      },
      cancelled: { 
        label: 'Dibatalkan', 
        color: 'bg-red-100 text-red-700 border-red-300', 
        icon: XCircle,
        textColor: 'text-red-700'
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const filterOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'processing', label: 'Diproses' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ];

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Pesanan Saya</h1>
          <p className="text-gray-500 text-sm sm:text-base">Lihat semua pesanan yang telah Anda buat</p>
        </div>

        {/* Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === option.value 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-500 mt-4">Memuat pesanan...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Anda belum memiliki pesanan. Yuk mulai belanja!' 
                : `Tidak ada pesanan dengan status "${filterOptions.find(o => o.value === filter)?.label}"`
              }
            </p>
            <Link 
              to="/products"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <motion.div 
            layout
            className="space-y-4"
          >
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link 
                    to={`/orders/${order.id}`}
                    className="block bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <Package size={24} className="text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                              Order #{order.id}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${statusConfig.color} text-xs sm:text-sm font-medium`}>
                          <StatusIcon size={16} />
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <ShoppingBag size={16} />
                          <span>{order.items?.length || 0} item</span>
                        </div>
                        
                        {order.items && order.items.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded"
                              >
                                {item.product?.name || 'Produk'} x{item.quantity}
                              </span>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                                +{order.items.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                          <p className="text-lg sm:text-xl font-bold text-orange-600">
                            {formatPrice(order.total_amount || 0)}
                          </p>
                        </div>
                        
                        <div className="flex items-center text-orange-500 group-hover:translate-x-2 transition-transform">
                          <span className="text-sm font-medium mr-1 hidden sm:inline">Lihat Detail</span>
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
