// src/components/admin/AdminLayout.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin',            icon: '📊', label: 'Dashboard',   end: true  },
  { to: '/admin/categories', icon: '📂', label: 'Kategoriler'             },
  { to: '/admin/products',   icon: '🍽️', label: 'Ürünler'                },
  { to: '/admin/allergens',  icon: '⚠️', label: 'Alerjenler'             },
  { to: '/admin/settings',   icon: '⚙️', label: 'Ayarlar'               },
  { to: '/admin/bulk',       icon: '📦', label: 'Toplu İşlemler'         },
];

export default function AdminLayout({ children }) {
  const { admin, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => { signOut(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-dark text-cream flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-water rounded-xl flex items-center justify-center text-xl animate-bounce-gentle">🌿</div>
            <div>
              <p className="font-extrabold text-sm leading-none">Yedideğirmenler</p>
              <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow shadow-black/20'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/40 mb-3">{admin?.full_name || admin?.username}</div>
          <div className="flex gap-2">
            <NavLink to="/" target="_blank" className="flex-1 text-xs bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg text-center transition">
              👁️ Menüyü Gör
            </NavLink>
            <button onClick={handleSignOut} className="flex-1 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 py-2 px-3 rounded-lg transition">
              🚪 Çıkış
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 glass border-b border-forest/10 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-forest/10 text-forest">
            ☰
          </button>
          <div className="flex-1" />
          <span className="text-sm text-brown">Hoşgeldin, {admin?.username} 👋</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
