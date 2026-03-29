// src/pages/admin/DashboardPage.jsx
import { useApi } from '../../hooks/useApi';
import { getAdminCategories, getAdminProducts, getAdminAllergens, getAdminSettings } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, to, color }) {
  return (
    <Link to={to} className={`${color} glass rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group`}>
      <div className="text-4xl group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <div className="text-2xl font-extrabold text-forest">{value ?? '...'}</div>
        <div className="text-sm text-brown">{label}</div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: categories } = useApi(getAdminCategories);
  const { data: productsData } = useApi(() => getAdminProducts({ limit: 1 }));
  const { data: allergens } = useApi(getAdminAllergens);
  const { data: settings } = useApi(getAdminSettings);

  const stats = [
    { icon: '📂', label: 'Toplam Kategori',  value: categories?.length, to: '/admin/categories', color: 'border-l-4 border-forest' },
    { icon: '🍽️', label: 'Toplam Ürün',      value: productsData?.pagination?.total, to: '/admin/products', color: 'border-l-4 border-water' },
    { icon: '⚠️', label: 'Toplam Alerjen',   value: allergens?.length, to: '/admin/allergens', color: 'border-l-4 border-amber-500' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-forest mb-1">Dashboard</h1>
        <p className="text-brown text-sm">Sisteme genel bakış</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Site Info */}
      {settings && (
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-forest text-lg mb-4">🌿 Site Bilgileri</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Site Başlığı', settings.site_title],
              ['Alt Başlık', settings.site_subtitle],
              ['Telefon', settings.phone],
              ['Çalışma Saatleri', settings.business_hours],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-brown font-semibold mb-0.5">{k}</dt>
                <dd className="text-forest font-medium">{v || '—'}</dd>
              </div>
            ))}
          </dl>
          <Link to="/admin/settings" className="inline-block mt-4 text-sm text-water font-semibold hover:underline">
            ⚙️ Ayarları Düzenle →
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Kategori Ekle', to: '/admin/categories', icon: '➕', sub: 'Yeni kategori oluştur' },
          { label: 'Ürün Ekle',     to: '/admin/products',   icon: '🍽️', sub: 'Yeni ürün tanımla' },
          { label: 'Alerjenler',    to: '/admin/allergens',  icon: '⚠️', sub: 'Alerjen yönetimi' },
          { label: 'Ayarlar',       to: '/admin/settings',   icon: '⚙️', sub: 'Site ayarları' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="glass rounded-2xl p-4 hover:-translate-y-1 hover:shadow-lg transition-all text-center group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
            <div className="font-bold text-forest text-sm">{item.label}</div>
            <div className="text-xs text-brown mt-0.5">{item.sub}</div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
