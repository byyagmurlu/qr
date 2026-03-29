// src/pages/admin/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Eski localStorage anahtarlarını temizle
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(form.username, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.error || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-water/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-forest/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-forest to-water rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-2xl animate-bounce-gentle">
            🌿
          </div>
          <h1 className="text-2xl font-extrabold text-forest">Yönetici Girişi</h1>
          <p className="text-sm text-brown mt-1">Yedideğirmenler QR Menü Sistemi</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-forest mb-1.5">Kullanıcı Adı</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full bg-white/70 border border-forest/20 rounded-xl px-4 py-3 text-forest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest/40 transition"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-forest mb-1.5">Şifre</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/70 border border-forest/20 rounded-xl px-4 py-3 text-forest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest/40 transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-forest to-water text-cream py-3.5 rounded-xl font-bold text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin">🌀</span> Giriş yapılıyor...</>
              ) : '🔐 Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
