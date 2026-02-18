import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Clock, CheckCircle, XCircle, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pesanan');
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
        textColor: 'text-yellow-700',
      },
      processing: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: Package,
        textColor: 'text-blue-700',
      },
      completed: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: CheckCircle,
        textColor: 'text-green-700',
      },
      cancelled: {
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: XCircle,
        textColor: 'text-red-700',
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
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  const filterOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'processing', label: 'Diproses' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
  ];

  const getStatusCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ShoppingBag size={32} className="text-orange-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">List Semua Order</h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">Kelola dan pantau semua pesanan dari customer</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-gray-600 text-2xl font-bold">{orders.length}</div>
            <div className="text-gray-500 text-xs font-medium mt-1">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-yellow-600 text-2xl font-bold">{getStatusCount('pending')}</div>
            <div className="text-yellow-700 text-xs font-medium mt-1">Menunggu</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-blue-600 text-2xl font-bold">{getStatusCount('processing')}</div>
            <div className="text-blue-700 text-xs font-medium mt-1">Diproses</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-green-600 text-2xl font-bold">{getStatusCount('completed')}</div>
            <div className="text-green-700 text-xs font-medium mt-1">Selesai</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-red-600 text-2xl font-bold">{getStatusCount('cancelled')}</div>
            <div className="text-red-700 text-xs font-medium mt-1">Dibatalkan</div>
          </div>
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
              {option.label} ({getStatusCount(option.value)})
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
              onClick={fetchAllOrders}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Pesanan</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'Belum ada pesanan yang masuk'
                : `Tidak ada pesanan dengan status "${filterOptions.find((o) => o.value === filter)?.label}"`}
            </p>
          </div>
        ) : (
          <motion.div layout className="space-y-4">
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
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Order #{order.id}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">{formatDate(order.created_at)}</p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${statusConfig.color} text-xs sm:text-sm font-medium`}
                        >
                          <StatusIcon size={16} />
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                          <User size={16} />
                          <span className="font-medium">{order.user?.name || 'Unknown'}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{order.user?.email || '-'}</span>
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
                              <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                                {item.product_name || 'Produk'} x{item.quantity}
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

export default AllOrders;
