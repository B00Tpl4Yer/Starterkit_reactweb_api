import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './Button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) => {
    return pos === 1 ? "relative" : "fixed";
  });

  return (
    <section ref={targetRef} className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-[#FFFBF5]">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-100 rounded-l-[100px] -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-100 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-bold text-sm tracking-wide">
            🍊 FRESH PREMIUM QUALITY
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900">
            Taste the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Juicy Life
            </span>
          </h1>
          
          <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
            Nikmati kesegaran buah premium pilihan dan dessert lezat yang memanjakan lidah. 
            Sehat, segar, dan pastinya bikin ketagihan!
          </p>
          
          <div className="flex space-x-4">
            <Link to="/products">
              <Button variant="primary" icon={ArrowRight}>
                Belanja Sekarang
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary">
                Tentang Kami
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8">
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-bold text-gray-900">24k+</h4>
              <p className="text-gray-500 text-sm">Pelanggan Puas</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-bold text-gray-900">100+</h4>
              <p className="text-gray-500 text-sm">Menu Varian</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-bold text-gray-900">4.9</h4>
              <p className="text-gray-500 text-sm">Rating Toko</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-orange-200 to-red-200 rounded-full blur-3xl -z-10" />
          <img 
            src="https://i.pinimg.com/736x/75/01/11/750111d9c740cbe44e8f01b6eb1accb4.jpg" 
            alt="Fruit Salad Bowl"
            className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
          
          {/* Floating Badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3"
          >
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <ChevronDown className="rotate-180" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Kalori</p>
              <p className="font-bold text-gray-800">120 kkal</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
