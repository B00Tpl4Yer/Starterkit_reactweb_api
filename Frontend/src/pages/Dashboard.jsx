import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Button from '../components/Button';
import { Settings, User, Package, Clock, CheckCircle } from 'lucide-react';
import orderService from '../services/orderService';
import productService from '../services/productService';

const Dashboard = () => {
  const { user } = useAuth();
  const { getCartItemCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await orderService.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: Package },
      completed: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: Package },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center space-x-1`}>
        <Icon size={14} />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang, {user?.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Senang melihat Anda kembali. Kelola aktivitas dan profil Anda di sini.
          </p>
        </div>
        <Link to="/profile" className="w-full md:w-auto">
          <Button variant="primary" className="flex items-center justify-center space-x-2 w-full md:w-auto">
            <Settings size={18} />
            <span>Edit Profile</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-blue-100 rounded-2xl p-6">
          <div className="text-blue-600 text-4xl mb-2">🛒</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Keranjang</h3>
          <p className="text-3xl font-bold text-blue-600">{getCartItemCount()}</p>
          <Link to="/cart" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
            Lihat Keranjang →
          </Link>
        </div>

        <div className="bg-green-100 rounded-2xl p-6">
          <div className="text-green-600 text-4xl mb-2">📦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Total Pesanan</h3>
          <p className="text-3xl font-bold text-green-600">{orders.length}</p>
          <p className="text-sm text-gray-600 mt-2">Pesanan Anda</p>
        </div>

        <div className="bg-purple-100 rounded-2xl p-6 relative overflow-hidden group">
          <div className="text-purple-600 text-4xl mb-2">👤</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Profil</h3>
          <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
          <Link to="/profile" className="text-purple-600 font-bold text-sm hover:underline flex items-center">
            Edit Profile →
          </Link>
          <div className="absolute -right-4 -bottom-4 text-purple-200/50 group-hover:scale-110 transition-transform">
            <User size={100} strokeWidth={1} />
          </div>
        </div>
      </div>
      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Pesanan Terbaru</h2>
        {loadingOrders ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Belum ada pesanan</p>
            <Link to="/products">
              <Button variant="primary">Mulai Belanja</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">#{order.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-orange-600">
                        Rp {((order.total_amount || 0) - ( 0)).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-4">
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="ghost" className="text-sm">Detail</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">#{order.id}</span>
                    <span className="text-xs text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">
                      Rp {order.total_amount?.toLocaleString('id-ID')}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <Link to={`/orders/${order.id}`} className="block">
                    <Button variant="ghost" className="w-full text-sm justify-center">Lihat Detail</Button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Informasi Akun</h2>
          <Link to="/profile" className="w-full sm:w-auto">
            <Button variant="ghost" className="text-orange-600 w-full sm:w-auto justify-center">Ubah Data</Button>
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:border-b sm:border-gray-50 pb-4 gap-2">
            <span className="text-gray-400 sm:w-40 text-sm sm:text-base">Nama Lengkap</span>
            <span className="font-semibold text-gray-700">{user?.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:border-b sm:border-gray-50 pb-4 gap-2">
            <span className="text-gray-400 sm:w-40 text-sm sm:text-base">Email Terdaftar</span>
            <span className="font-semibold text-gray-700 break-all">{user?.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:border-b sm:border-gray-50 pb-4 gap-2">
            <span className="text-gray-400 sm:w-40 text-sm sm:text-base">Tanggal Bergabung</span>
            <span className="font-semibold text-gray-700">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
