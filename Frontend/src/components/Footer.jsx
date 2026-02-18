import { Citrus, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-orange-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-500 p-2 rounded-full text-white">
                <Citrus size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                CemilanSultan
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Menghadirkan kesegaran buah premium dan olahan dessert terbaik langsung ke depan pintu Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Menu</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-orange-500 transition-colors">Beranda</Link></li>
              <li><Link to="/products" className="text-gray-500 hover:text-orange-500 transition-colors">Produk Kami</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-orange-500 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-orange-500 transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-500">
                <MapPin size={18} className="text-orange-500" />
                <span>Jl.Drs.H.M.Yoesoef Masjid,Bukit Harapan,Kec.Soreang Kota Parepare</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500">
                <Phone size={18} className="text-orange-500" />
                <span>+62 823-4445-4155</span>
              </li>
              {/* <li className="flex items-center space-x-3 text-gray-500">
                <Mail size={18} className="text-orange-500" />
                <span>hello@cemilansultan.com</span>
              </li> */}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/share/17CLe9JWco/?mibextid=wwXIfr" className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Toko Cemilan Sultan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
