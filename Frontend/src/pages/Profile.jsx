import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    // Validasi password jika diisi
    if (formData.password && formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Password tidak cocok' });
      setLoading(false);
      return;
    }

    try {
      // Hanya kirim data yang diperlukan
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Tambahkan password hanya jika diisi
      if (formData.password) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      await updateUserProfile(updateData);
      setSuccess(true);
      
      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: error.message || 'Update profil gagal. Silakan coba lagi.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profil</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Profil berhasil diperbarui!
          </div>
        )}

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            required
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
            error={errors.email}
          />

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Ubah Password (Opsional)
            </h3>
            
            <Input
              label="Password Baru"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin mengubah"
              error={errors.password}
            />

            {formData.password && (
              <Input
                label="Konfirmasi Password Baru"
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Masukkan ulang password baru"
                error={errors.password_confirmation}
              />
            )}
          </div>

          <div className="flex space-x-4 mt-6">
            <Button 
              type="submit" 
              fullWidth 
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              fullWidth
              onClick={() => {
                setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  password: '',
                  password_confirmation: '',
                });
                setErrors({});
                setSuccess(false);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
