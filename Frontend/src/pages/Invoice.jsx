import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import Button from '../components/Button';
import { ArrowLeft, Download, Phone, MapPin, Package } from 'lucide-react';
import orderService from '../services/orderService';

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

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
      setError(err.message || 'Gagal memuat invoice');
      console.error('Error fetching order detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;

    try {
      setDownloading(true);
      
      // Get element dimensions - use fixed 800px width for consistent export
      const element = invoiceRef.current;
      const elementHeight = element.scrollHeight;
      const fixedWidth = 800; // Fixed width for desktop layout
      
      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: fixedWidth,
        height: elementHeight,
        windowWidth: fixedWidth,
        windowHeight: elementHeight,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${order.id}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setDownloading(false);
      }, 'image/png');

    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Gagal mengunduh invoice');
      setDownloading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return labels[status] || status;
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Invoice Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">{error || 'Invoice yang Anda cari tidak ditemukan'}</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 hover:text-gray-800 transition-colors px-4 py-2"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali ke Detail</span>
        </button>
        
        <Button
          variant="primary"
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="hidden sm:flex items-center space-x-2"
        >
          <Download size={20} />
          <span>{downloading ? 'Mengunduh...' : 'Download Invoice'}</span>
        </Button>
      </div>

      {/* Invoice Container */}
      <div className="overflow-x-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden inline-block min-w-full"
        >
          <div ref={invoiceRef} style={{ width: '800px', maxWidth: '100%', margin: '0 auto', padding: '3rem', backgroundColor: '#ffffff' }}>
            {/* Invoice Header */}
            <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#FF6B00', marginBottom: '0.5rem' }}>CEMILAN SULTAN</h1>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Cemilan Premium Pilihan Raja</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ backgroundColor: '#ffe4cc', color: '#c45500', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>INVOICE</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Invoice #: {order.id}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer & Order Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Informasi Customer</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', marginTop: '0.25rem' }}>📞</span>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Nomor Telepon</p>
                    <p style={{ fontWeight: '600', color: '#1f2937' }}>{order.customer_phone}</p>
                  </div>
                </div>
                {order.delivery_type === 'delivery' && order.delivery_address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#9ca3af', marginTop: '0.25rem' }}>📍</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Alamat Pengiriman</p>
                      <p style={{ fontWeight: '600', color: '#1f2937' }}>{order.delivery_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Detail Pesanan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status</p>
                  <p style={{ fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>{getStatusLabel(order.status)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tipe Pengiriman</p>
                  <p style={{ fontWeight: '600', color: '#1f2937' }}>
                    {order.delivery_type === 'delivery' ? 'Diantar' : 'Ambil Sendiri'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pembayaran</p>
                  <p style={{ fontWeight: '600', color: '#1f2937' }}>
                    {order.payment_method === 'store' ? 'Bayar di Toko' : 'Cash on Delivery'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div style={{ marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Produk</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151', width: '100px' }}>Jumlah</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Harga Satuan</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index} style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                      <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '500', fontSize: '0.875rem' }}>{item.product_name}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>{item.quantity}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#6b7280', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        Rp {item.price?.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#1f2937', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        Rp {(item.price * item.quantity)?.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div style={{ borderTop: '2px solid #d1d5db', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '16rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Subtotal:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                    Rp {order.total_amount?.toLocaleString('id-ID')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#fff7ed', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>TOTAL:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B00' }}>
                    Rp {order.total_amount?.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.25rem' }}>Catatan:</p>
              <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>{order.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Terima kasih telah berbelanja di Cemilan Sultan!</p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Invoice ini dibuat secara otomatis dan sah tanpa tanda tangan.</p>
          </div>
        </div>
      </motion.div>
    </div>

      {/* Download Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6">
        <Button
          variant="primary"
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="w-full flex items-center justify-center space-x-2 shadow-lg"
        >
          <Download size={20} />
          <span>{downloading ? 'Mengunduh...' : 'Download Invoice'}</span>
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
