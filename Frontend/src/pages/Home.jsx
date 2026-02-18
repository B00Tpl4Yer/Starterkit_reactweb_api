import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import Button from '../components/Button';
import { ArrowRight, Truck, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const features = [
    { icon: Truck, title: 'Pengiriman Cepat', desc: 'Langsung dikirim dari kebun/dapur ke tempatmu.' },
    { icon: ShieldCheck, title: 'Jaminan Kualitas', desc: 'Garansi ganti baru jika buah busuk/tidak segar.' },
    { icon: Clock, title: '24/7 Pelayanan', desc: 'Siap melayani pesanan kapanpun kamu mau.' },
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Mengambil produk terlaris dari API
        const response = await productService.getProducts({ popular: true });
        // Ambil 4 produk teratas
        setFeaturedProducts(response.data.slice(0, 4));
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Gagal memuat produk terlaris. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-6 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-colors"
              >
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-orange-600 font-bold tracking-wide uppercase">Pilihan Sultan</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Produk Terlaris</h2>
            </div>
            <Link to="/products">
              <Button variant="ghost" icon={ArrowRight} className="hidden md:inline-flex">
                Lihat Semua
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat produk sultan...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100">
              <p className="text-lg font-semibold mb-2">Oops! Ada kendala</p>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="mt-8 text-center md:hidden">
                <Link to="/products">
                  <Button variant="outline" fullWidth>Lihat Semua</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-red-600 p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Diskon Spesial 50% untuk Pengguna Baru!</h2>
                <p className="text-orange-100 text-lg mb-8 max-w-md">
                  Daftar sekarang dan dapatkan voucher potongan harga untuk pembelian pertamamu. Tanpa minimum order.
                </p>
                <Link to="/register">
                  <Button variant="secondary">
                    Ambil Diskon Sekarang
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block relative h-64">
               
                <img 
                   src="https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                   alt="Promo Fruit"
                   className="absolute right-0 bottom-0 w-auto h-full object-contain drop-shadow-2xl rotate-12"
                 />
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
