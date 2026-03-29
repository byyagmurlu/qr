# 🎨 Antigravity Frontend Development Guide
## Yedideğirmenler QR Menü Sistemi

**For:** Antigravity Visual Design Tool  
**Purpose:** Frontend Implementation Guide  
**Stack:** React + TypeScript + TailwindCSS  

---

## 📋 Hızlı Başlangıç

### Proje Yapısı (Antigravity'de)

```
YedidegirmenlerQRMenu/
├── public/
│  ├── index.html
│  ├── favicon.ico
│  └── manifest.json
│
├── src/
│  ├── components/
│  │  ├── Public/
│  │  │  ├── MenuPage.jsx
│  │  │  ├── Header.jsx
│  │  │  ├── CategoryTabs.jsx
│  │  │  ├── ProductCard.jsx
│  │  │  ├── ProductModal.jsx
│  │  │  ├── AllergenBadge.jsx
│  │  │  ├── LanguageSwitcher.jsx
│  │  │  └── Footer.jsx
│  │  │
│  │  └── Admin/
│  │     ├── AdminDashboard.jsx
│  │     ├── AdminLayout.jsx
│  │     ├── LoginPage.jsx
│  │     ├── SiteSettings.jsx
│  │     ├── CategoriesManager.jsx
│  │     ├── ProductsManager.jsx
│  │     ├── LayoutManager.jsx
│  │     ├── TranslationsManager.jsx
│  │     └── AuditLogs.jsx
│  │
│  ├── pages/
│  │  ├── PublicMenu.jsx
│  │  ├── AdminPanel.jsx
│  │  └── NotFound.jsx
│  │
│  ├── services/
│  │  ├── api.js
│  │  ├── auth.js
│  │  └── storage.js
│  │
│  ├── hooks/
│  │  ├── useApi.js
│  │  ├── useAuth.js
│  │  └── useLanguage.js
│  │
│  ├── context/
│  │  ├── AuthContext.jsx
│  │  ├── LanguageContext.jsx
│  │  └── ThemeContext.jsx
│  │
│  ├── utils/
│  │  ├── validators.js
│  │  ├── formatters.js
│  │  ├── constants.js
│  │  └── security.js
│  │
│  ├── styles/
│  │  ├── globals.css
│  │  ├── tailwind.css
│  │  └── animations.css
│  │
│  ├── App.jsx
│  └── index.jsx
│
├── public/
│  └── locales/
│     ├── tr.json
│     ├── en.json
│     └── ar.json
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🏗️ Komponent Mimarisi

### 1. PUBLIC MENU PAGE

#### MenuPage.jsx (Ana Sayfa)

```jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Public/Header';
import CategoryTabs from '../components/Public/CategoryTabs';
import ProductCard from '../components/Public/ProductCard';
import Footer from '../components/Public/Footer';
import { useLanguage } from '../hooks/useLanguage';
import { useApi } from '../hooks/useApi';

export default function MenuPage() {
  const { language, t } = useLanguage();
  const { data: categories, loading: categoriesLoading } = useApi('/api/v1/categories');
  const { data: products, loading: productsLoading } = useApi(`/api/v1/categories/${activeCategory}/products?lang=${language}`);
  
  const [activeCategory, setActiveCategory] = useState('kahvalti');
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0ede4] to-[#e8e4d9]">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Kategoriler */}
        <CategoryTabs 
          categories={categories} 
          active={activeCategory}
          onChange={setActiveCategory}
          loading={categoriesLoading}
        />

        {/* Ürünler Grid */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
                language={language}
              />
            ))}
          </div>
        </section>

        {/* Ürün Detail Modal */}
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            language={language}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
```

#### Header.jsx

```jsx
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import { useApi } from '../hooks/useApi';

export default function Header() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data: settings } = useApi('/api/v1/settings');
  const { data: layoutSettings } = useApi(`/api/v1/layout/${isMobile ? 'mobile' : 'desktop'}/header`);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-gradient-to-r from-[#1a3a2a] via-[#0d4a6b] to-[#1a3a2a] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3b9dd9] opacity-20 blur-xl rounded-full"></div>
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-12 w-12 rounded-full relative z-10 border-2 border-[#3b9dd9]"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#f0ede4]">
                {settings?.site_title || 'Yedideğirmenler'}
              </h1>
              <p className="text-sm md:text-base text-[#3b9dd9]">
                {settings?.site_subtitle || 'Kafe & Restorant'}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>

      {/* Animated Border */}
      <div className="h-1 bg-gradient-to-r from-[#3b9dd9] via-[#d4a574] to-[#3b9dd9] animate-pulse"></div>
    </header>
  );
}
```

#### CategoryTabs.jsx

```jsx
import React from 'react';

export default function CategoryTabs({ categories, active, onChange, loading }) {
  if (loading) return <div className="flex gap-2 animate-pulse">Yükleniyor...</div>;

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
      {categories?.map(category => (
        <button
          key={category.id}
          onClick={() => onChange(category.slug)}
          className={`
            flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg
            transition-all duration-300 font-semibold text-sm md:text-base
            ${active === category.slug
              ? 'bg-[#1a3a2a] text-[#f0ede4] shadow-lg scale-105'
              : 'bg-white text-[#1a3a2a] hover:shadow-md'
            }
          `}
          style={active === category.slug ? { backgroundColor: category.color } : {}}
        >
          <i className={`fi ${category.icon}`}></i>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
```

#### ProductCard.jsx

```jsx
import React from 'react';
import AllergenBadge from './AllergenBadge';

export default function ProductCard({ product, onClick, language }) {
  return (
    <article
      onClick={onClick}
      className="
        bg-white rounded-xl shadow-md hover:shadow-2xl 
        transition-all duration-300 cursor-pointer overflow-hidden 
        hover:scale-105 group
      "
    >
      {/* Image Container */}
      <figure className="relative h-48 md:h-56 bg-gradient-to-b from-[#e8e4d9] to-[#d4cfc4] overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <i className="fi fi-rr-image text-4xl text-[#a0a0a0]"></i>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-[#cd5c5c] text-white px-3 py-1 rounded-full font-bold text-sm md:text-base">
          {product.discount_price ? (
            <div className="flex flex-col items-end">
              <span className="line-through text-xs opacity-75">{product.price}₺</span>
              <span>{product.discount_price}₺</span>
            </div>
          ) : (
            <span>{product.price}₺</span>
          )}
        </div>

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-[#1a3a2a] px-2 py-1 rounded text-xs font-bold">
            ⭐ Öne Çıkan
          </div>
        )}
      </figure>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-bold text-[#1a3a2a] mb-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-[#666] mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Allergens */}
        {product.allergens && product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {product.allergens.slice(0, 3).map(allergen => (
              <AllergenBadge 
                key={allergen.id}
                allergen={allergen}
              />
            ))}
            {product.allergens.length > 3 && (
              <span className="text-xs text-[#999]">+{product.allergens.length - 3}</span>
            )}
          </div>
        )}

        {/* Nutrition Info */}
        {product.nutrition && (
          <div className="text-xs text-[#666] bg-[#f0ede4] p-2 rounded mb-3">
            <p>🔥 {product.nutrition.calories} kcal | 
               🥚 {product.nutrition.protein}g Protein</p>
          </div>
        )}

        {/* Preparation Time */}
        {product.preparation_time && (
          <div className="text-xs text-[#0d4a6b] font-semibold mb-3">
            ⏱️ Hazırlama: {product.preparation_time} dk
          </div>
        )}

        {/* Availability */}
        <div className="flex items-center justify-between">
          <span className={`
            text-xs font-bold px-2 py-1 rounded
            ${product.is_available 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            }
          `}>
            {product.is_available ? '✓ Mevcuttur' : '✗ Stok Tükendi'}
          </span>
          <button className="text-[#0d4a6b] font-bold text-sm hover:underline">
            Detaylar →
          </button>
        </div>
      </div>
    </article>
  );
}
```

#### ProductModal.jsx

```jsx
import React from 'react';
import AllergenBadge from './AllergenBadge';

export default function ProductModal({ product, onClose, language }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#cd5c5c] text-white rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Product Image */}
        <div className="w-full h-64 md:h-80 bg-[#e8e4d9] overflow-hidden">
          {product.image_url && (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          
          {/* Title & Price */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#1a3a2a] mb-2">
                {product.name}
              </h2>
              <p className="text-[#666] mb-4">
                {product.description}
              </p>
            </div>
            <div className="text-right">
              {product.discount_price ? (
                <div>
                  <span className="line-through text-[#999] block">{product.price}₺</span>
                  <span className="text-3xl font-bold text-[#cd5c5c]">{product.discount_price}₺</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-[#1a3a2a]">{product.price}₺</span>
              )}
            </div>
          </div>

          {/* Detailed Content */}
          {product.detailed_content && (
            <div className="prose prose-sm mb-6">
              {/* Markdown/HTML render */}
              <div dangerouslySetInnerHTML={{ __html: product.detailed_content }} />
            </div>
          )}

          {/* Nutrition Info */}
          {product.nutrition && (
            <div className="bg-[#f0ede4] p-4 rounded-lg mb-6">
              <h4 className="font-bold text-[#1a3a2a] mb-3">📊 Beslensel Bilgiler (100g)</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div>
                  <span className="block font-bold text-[#1a3a2a]">{product.nutrition.calories}</span>
                  <span className="text-[#666]">kcal</span>
                </div>
                <div>
                  <span className="block font-bold text-[#1a3a2a]">{product.nutrition.protein}g</span>
                  <span className="text-[#666]">Protein</span>
                </div>
                <div>
                  <span className="block font-bold text-[#1a3a2a]">{product.nutrition.fat}g</span>
                  <span className="text-[#666]">Yağ</span>
                </div>
                <div>
                  <span className="block font-bold text-[#1a3a2a]">{product.nutrition.carbs}g</span>
                  <span className="text-[#666]">Karbohidrat</span>
                </div>
              </div>
            </div>
          )}

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-[#cd5c5c] mb-3">⚠️ Alerjenleri İçerir</h4>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map(allergen => (
                  <div key={allergen.id} className="flex items-center gap-2 bg-[#ffe6e6] px-3 py-2 rounded">
                    <i className={`fi ${allergen.icon}`}></i>
                    <span className="text-sm font-semibold">{allergen.name}</span>
                    <span className="text-xs bg-[#ff6b6b] text-white px-2 py-1 rounded">
                      {allergen.severity === 'high' ? 'Yüksek' : allergen.severity === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-[#f9f7f4] rounded-lg mb-6">
            {product.preparation_time && (
              <div className="text-center">
                <i className="fi fi-rr-clock text-2xl text-[#0d4a6b] mb-2"></i>
                <p className="text-sm text-[#666]">{product.preparation_time} dakika</p>
              </div>
            )}
            {product.serving_size && (
              <div className="text-center">
                <i className="fi fi-rr-bowl text-2xl text-[#0d4a6b] mb-2"></i>
                <p className="text-sm text-[#666]">{product.serving_size}</p>
              </div>
            )}
            <div className="text-center">
              <i className={`fi fi-rr-check text-2xl mb-2 ${product.is_available ? 'text-green-500' : 'text-red-500'}`}></i>
              <p className="text-sm text-[#666]">{product.is_available ? 'Mevcuttur' : 'Stok Tükendi'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-[#1a3a2a] text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
            >
              Kapat
            </button>
            {product.is_available && (
              <button className="flex-1 bg-[#3b9dd9] text-white py-3 rounded-lg font-bold hover:opacity-90 transition">
                🛒 Sipariş Ver
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### AllergenBadge.jsx

```jsx
import React from 'react';

export default function AllergenBadge({ allergen }) {
  const severityColors = {
    trace: 'bg-yellow-100 text-yellow-700',
    low: 'bg-yellow-100 text-yellow-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700'
  };

  return (
    <div className={`
      flex items-center gap-1 px-2 py-1 rounded text-xs font-bold
      ${severityColors[allergen.severity] || severityColors.trace}
    `}
    title={allergen.name}
    >
      <i className={`fi ${allergen.icon}`}></i>
      <span>{allergen.name}</span>
    </div>
  );
}
```

#### LanguageSwitcher.jsx

```jsx
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const languages = ['tr', 'en', 'ar'];
  const languageNames = {
    tr: '🇹🇷 Türkçe',
    en: '🇬🇧 English',
    ar: '🇸🇦 العربية'
  };

  return (
    <div className="flex gap-2">
      {languages.map(lang => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`
            px-3 py-1 rounded-lg transition-all text-sm font-semibold
            ${language === lang
              ? 'bg-[#3b9dd9] text-white'
              : 'bg-[#0d4a6b] text-[#3b9dd9] hover:bg-[#1a5a8b]'
            }
          `}
        >
          {languageNames[lang]}
        </button>
      ))}
    </div>
  );
}
```

#### Footer.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data: settings } = useApi('/api/v1/settings');
  const { data: layoutSettings } = useApi(`/api/v1/layout/${isMobile ? 'mobile' : 'desktop'}/footer`);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer className="bg-gradient-to-r from-[#1a3a2a] to-[#0d4a6b] text-[#f0ede4] py-8 md:py-12 mt-16">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#3b9dd9]">📞 İletişim</h4>
            <div className="space-y-2 text-sm">
              <p>
                <a href={`tel:${settings?.phone}`} className="hover:text-[#3b9dd9] transition">
                  {settings?.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${settings?.email}`} className="hover:text-[#3b9dd9] transition">
                  {settings?.email}
                </a>
              </p>
              <p>{settings?.address}</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#3b9dd9]">🕐 Çalışma Saatleri</h4>
            <p className="text-sm">{settings?.business_hours}</p>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#3b9dd9]">🌐 Sosyal Ağlar</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#3b9dd9] transition">
                <i className="fi fi-brands-facebook text-2xl"></i>
              </a>
              <a href="#" className="hover:text-[#3b9dd9] transition">
                <i className="fi fi-brands-instagram text-2xl"></i>
              </a>
              <a href="#" className="hover:text-[#3b9dd9] transition">
                <i className="fi fi-brands-twitter text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#3b9dd9] to-transparent mb-6"></div>

        {/* Copyright */}
        <div className="text-center text-sm text-[#999]">
          <p>&copy; 2024 Yedideğirmenler Tabiat Parkı. Tüm hakları saklıdır.</p>
          <p className="mt-2">Powered by QR Menu System</p>
        </div>
      </div>
    </footer>
  );
}
```

---

### 2. ADMIN PANEL COMPONENTS

#### AdminDashboard.jsx

```jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';

export default function AdminPanel() {
  const { auth } = useAuth();
  const { data: stats } = useApi('/api/v1/admin/dashboard/stats');
  
  if (!auth) {
    return <LoginPage />;
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stat Cards */}
        <StatCard 
          title="Toplam Ürün" 
          value={stats?.total_products} 
          icon="fi-rr-utensils"
          color="bg-blue-500"
        />
        <StatCard 
          title="Toplam Kategori" 
          value={stats?.total_categories} 
          icon="fi-rr-list"
          color="bg-green-500"
        />
        <StatCard 
          title="Bugün Ziyaretçi" 
          value={stats?.daily_visitors} 
          icon="fi-rr-eye"
          color="bg-purple-500"
        />
        <StatCard 
          title="Son İşlemler" 
          value={stats?.recent_activities} 
          icon="fi-rr-history"
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Son İşlemler</h3>
        {/* Activity List */}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className={`${color} text-white w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
        <i className={`fi ${icon} text-xl`}></i>
      </div>
      <h4 className="text-gray-600 text-sm font-semibold">{title}</h4>
      <p className="text-3xl font-bold text-gray-800">{value || 0}</p>
    </div>
  );
}
```

---

## 🎯 Stili ve Tema

### Tayland Teması (Color Palette)

```css
/* Primary Colors */
--primary-forest: #1a3a2a;      /* Orman Yeşili */
--primary-blue: #0d4a6b;         /* Karadeniz Mavisi */
--accent-light-blue: #3b9dd9;    /* Açık Mavi */
--cream: #f0ede4;                /* Krem */
--parchment: #e8e4d9;            /* Parşömen */

/* Secondary Colors */
--wood-brown: #8b7355;           /* Ahşap Kahverengisi */
--terracotta: #cd5c5c;           /* Terracotta */
--gold-accent: #d4a574;          /* Altın Aksan */

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
```

### TailwindCSS Config

```javascript
// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{jsx,js}'],
  theme: {
    extend: {
      colors: {
        'forest': '#1a3a2a',
        'karadeniz': '#0d4a6b',
        'sky-blue': '#3b9dd9',
        'cream': '#f0ede4',
        'parchment': '#e8e4d9',
        'wood': '#8b7355',
        'terracotta': '#cd5c5c',
        'gold': '#d4a574',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 🔌 API Integration

### useApi Hook

```javascript
// hooks/useApi.js

import { useState, useEffect } from 'react';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

### useLanguage Hook

```javascript
// hooks/useLanguage.js

import { useState, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'tr';
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    localStorage.setItem('language', language);
    // Load translations from API or JSON
  }, [language]);

  const t = (key) => {
    return translations[key] || key;
  };

  return { language, setLanguage, t, translations };
}
```

---

## 📱 Responsive Breakpoints

```javascript
// Mobile First Approach

// Extra Small (xs): 320px - 640px
// Small (sm): 640px - 768px
// Medium (md): 768px - 1024px
// Large (lg): 1024px - 1280px
// Extra Large (xl): 1280px+

// TailwindCSS Class Examples:
// text-base md:text-lg lg:text-2xl
// grid-cols-1 md:grid-cols-2 lg:grid-cols-3
// p-4 md:p-6 lg:p-8
```

---

## 🎨 Design System

### Button Variants

```jsx
// Primary Button
<button className="bg-forest text-cream px-6 py-3 rounded-lg font-bold hover:opacity-90 transition">
  Kaydet
</button>

// Secondary Button
<button className="bg-karadeniz text-cream px-6 py-3 rounded-lg font-bold hover:opacity-90 transition">
  İptal
</button>

// Success Button
<button className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition">
  Onayla
</button>

// Danger Button
<button className="bg-terracotta text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition">
  Sil
</button>
```

### Input Fields

```jsx
<input 
  type="text"
  placeholder="Metin Gir"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
/>
```

---

## 🔐 Security Considerations

```javascript
// CSRF Protection
const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content;

// XSS Prevention
import DOMPurify from 'dompurify';
const sanitizedHTML = DOMPurify.sanitize(userInput);

// Secure Token Storage
localStorage.setItem('token', response.token); // or sessionStorage

// API Request Security
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'X-CSRF-Token': getCsrfToken(),
};
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "tailwindcss": "^3.2.0",
    "dompurify": "^3.0.0",
    "i18next": "^22.4.0",
    "framer-motion": "^10.0.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

---

## 🚀 Deployment Checklist

- ☐ Environment variables configured (.env.production)
- ☐ API endpoints updated for production
- ☐ HTTPS enforced
- ☐ Security headers added
- ☐ CORS configured
- ☐ Rate limiting enabled
- ☐ Error logging set up
- ☐ Performance optimized (lazy loading, code splitting)
- ☐ SEO meta tags added
- ☐ Testing completed
- ☐ Monitoring/analytics set up

---

**Prepared for:** Antigravity Development Environment  
**Version:** 1.0.0  
**Status:** Ready for Implementation