// src/pages/admin/ProfilePage.jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API = '/backend/api';

function getToken() {
  return localStorage.getItem('qr_token') || sessionStorage.getItem('qr_token') || '';
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export default function ProfilePage() {
  const { admin, setAdmin } = useAuth();
  const [tab, setTab] = useState('profile'); // 'profile' | 'password'

  // Profile form
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [profileMsg, setProfileMsg] = useState(null); // {type:'success'|'error', text}
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [oldPass, setOldPass]     = useState('');
  const [newPass, setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg]     = useState(null);
  const [passLoading, setPassLoading] = useState(false);
  const [showPwd, setShowPwd]     = useState(false);

  // Password strength
  const strength = (() => {
    if (!newPass) return 0;
    let s = 0;
    if (newPass.length >= 8)              s++;
    if (/[A-Z]/.test(newPass))            s++;
    if (/[0-9]/.test(newPass))            s++;
    if (/[^A-Za-z0-9]/.test(newPass))    s++;
    return s;
  })();
  const strengthLabel = ['', 'Zayıf', 'Orta', 'İyi', 'Güçlü'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'][strength];

  useEffect(() => {
    if (admin) {
      setFullName(admin.full_name || '');
      setEmail(admin.email || '');
    }
  }, [admin]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await fetch(`${API}/v1/admin/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ full_name: fullName, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg({ type: 'success', text: 'Profil başarıyla güncellendi.' });
        if (setAdmin) setAdmin(prev => ({ ...prev, full_name: fullName, email }));
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Bir hata oluştu.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Sunucuya bağlanılamadı.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMsg(null);
    try {
      const res = await fetch(`${API}/v1/admin/auth/change-password`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ old_password: oldPass, new_password: newPass, confirm_password: confirmPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setPassMsg({ type: 'success', text: 'Şifre başarıyla değiştirildi.' });
        setOldPass(''); setNewPass(''); setConfirmPass('');
      } else {
        setPassMsg({ type: 'error', text: data.message || 'Bir hata oluştu.' });
      }
    } catch {
      setPassMsg({ type: 'error', text: 'Sunucuya bağlanılamadı.' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest to-water flex items-center justify-center text-3xl shadow-lg">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-bold text-forest">Profil Ayarları</h1>
            <p className="text-brown/60 text-sm">{admin?.username} — {admin?.role}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-forest/10 rounded-xl">
          {[
            { key: 'profile',  label: '👤 Profil Bilgileri' },
            { key: 'password', label: '🔐 Şifre Değiştir' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-white text-forest shadow-sm'
                  : 'text-forest/60 hover:text-forest'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-forest/10 p-6 space-y-5">
            <h2 className="font-semibold text-forest text-lg">Kişisel Bilgiler</h2>

            {profileMsg && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {profileMsg.type === 'success' ? '✅ ' : '❌ '}{profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={admin?.username || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-forest/20 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                />
                <p className="text-xs text-brown/40 mt-1">Kullanıcı adı değiştirilemez.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ad Soyad giriniz"
                  className="w-full px-4 py-2.5 rounded-xl border border-forest/20 bg-cream text-forest text-sm focus:outline-none focus:border-water focus:ring-2 focus:ring-water/20 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-forest/20 bg-cream text-forest text-sm focus:outline-none focus:border-water focus:ring-2 focus:ring-water/20 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Rol</label>
                <input
                  type="text"
                  value={admin?.role === 'admin' ? '👑 Yönetici' : '✏️ Editör'}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-forest/20 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>

              {admin?.last_login && (
                <div className="px-4 py-3 bg-forest/5 rounded-xl text-xs text-brown/60">
                  🕐 Son giriş: {new Date(admin.last_login).toLocaleString('tr-TR')}
                </div>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-3 px-6 bg-forest text-white rounded-xl font-semibold text-sm hover:bg-forest/90 disabled:opacity-60 transition-all shadow hover:shadow-md"
              >
                {profileLoading ? '⏳ Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <div className="bg-white rounded-2xl shadow-sm border border-forest/10 p-6 space-y-5">
            <h2 className="font-semibold text-forest text-lg">Şifre Değiştir</h2>

            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 space-y-1">
              <p className="font-semibold">🔐 Güvenli şifre kuralları:</p>
              <ul className="list-disc list-inside space-y-0.5 opacity-80">
                <li>En az 8 karakter</li>
                <li>En az 1 büyük harf (A-Z)</li>
                <li>En az 1 rakam (0-9)</li>
                <li>Özel karakter önerilir (!@#$)</li>
              </ul>
            </div>

            {passMsg && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                passMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {passMsg.type === 'success' ? '✅ ' : '❌ '}{passMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Mevcut Şifre</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={oldPass}
                  onChange={e => setOldPass(e.target.value)}
                  placeholder="Mevcut şifreniz"
                  className="w-full px-4 py-2.5 rounded-xl border border-forest/20 bg-cream text-forest text-sm focus:outline-none focus:border-water focus:ring-2 focus:ring-water/20 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Yeni Şifre</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="Yeni şifreniz"
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-forest/20 bg-cream text-forest text-sm focus:outline-none focus:border-water focus:ring-2 focus:ring-water/20 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest text-lg"
                  >
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Güç göstergesi */}
                {newPass && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-brown/60">Güç: <span className="font-semibold">{strengthLabel}</span></p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Yeni Şifre (Tekrar)</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="Yeni şifrenizi tekrarlayın"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-cream text-forest text-sm focus:outline-none focus:ring-2 transition ${
                    confirmPass && confirmPass !== newPass
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-forest/20 focus:border-water focus:ring-water/20'
                  }`}
                  required
                />
                {confirmPass && confirmPass !== newPass && (
                  <p className="text-xs text-red-500 mt-1">⚠️ Şifreler eşleşmiyor</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passLoading || (confirmPass && confirmPass !== newPass)}
                className="w-full py-3 px-6 bg-forest text-white rounded-xl font-semibold text-sm hover:bg-forest/90 disabled:opacity-60 transition-all shadow hover:shadow-md"
              >
                {passLoading ? '⏳ Değiştiriliyor...' : '🔐 Şifreyi Değiştir'}
              </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
