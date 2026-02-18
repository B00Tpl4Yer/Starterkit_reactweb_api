import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { Upload, X } from 'lucide-react';

const ProductForm = ({ initialData, onSubmit, isLoading = false, submitLabel = 'Simpan' }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    stock: initialData?.stock || '',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || initialData?.image || null);
  const [errors, setErrors] = useState({});

  const categories = ['Buah Segar', 'Dessert', 'Minuman', 'Parcel', 'Snack', 'Cemilan'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'File harus berupa gambar' }));
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2048 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Ukuran file maksimal 2MB' }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Clear error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk wajib diisi';
    }

    if (!formData.price) {
      newErrors.price = 'Harga wajib diisi';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Harga tidak boleh negatif';
    }

    if (formData.stock === '' || formData.stock === undefined) {
      newErrors.stock = 'Stok wajib diisi';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('category', formData.category.trim());
      submitData.append('price', parseFloat(formData.price));
      submitData.append('stock', parseInt(formData.stock));
      submitData.append('is_active', formData.is_active ? '1' : '0');
      
      // Add image if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nama Produk */}
      <Input
        label="Nama Produk *"
        name="name"
        type="text"
        placeholder="Contoh: Keripik Singkong Original"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        required
      />

      {/* Deskripsi */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi (Opsional)
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Deskripsi produk..."
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Kategori */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Kategori (Opsional)
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Upload Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto Produk (Opsional)
        </label>
        
        {imagePreview ? (
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label 
              htmlFor="image" 
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Klik untuk upload gambar
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF (Max. 2MB)
              </span>
            </label>
          </div>
        )}
        
        {errors.image && (
          <p className="mt-1 text-sm text-red-500">{errors.image}</p>
        )}
      </div>

      {/* Harga dan Stok */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Harga (Rp) *"
          name="price"
          type="number"
          placeholder="15000"
          value={formData.price}
          onChange={handleInputChange}
          error={errors.price}
          required
          min="0"
        />

        <Input
          label="Stok *"
          name="stock"
          type="number"
          placeholder="100"
          value={formData.stock}
          onChange={handleInputChange}
          error={errors.stock}
          required
          min="0"
        />
      </div>

      {/* Status Aktif */}
      <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          checked={formData.is_active}
          onChange={handleInputChange}
          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
          Produk Aktif (Tampil di katalog)
        </label>
      </div>

      {/* Submit Button */}
      <Button
        fullWidth
        variant="primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Memproses...' : submitLabel}
      </Button>
    </form>
  );
};

export default ProductForm;
