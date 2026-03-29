import { useState, useEffect, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { getSettings, getCategories, getAllProducts, getLanguages } from '../services/api';
import { UI_STRINGS } from '../i18n/translations';
import ProductCard from '../components/public/ProductCard';
import ProductCardV2 from '../components/public/ProductCardV2';
import ProductModal from '../components/public/ProductModal';
import Sidebar from '../components/public/Sidebar';

function Skeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-48 bg-white/50 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
}

export default function MenuPage() {
  const [lang, setLang] = useState('tr');
  const [activeSlug, setActiveSlug] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const { data: settings } = useApi(getSettings);
  const { data: languages } = useApi(getLanguages);
  const { data: categories, loading: catsLoading } = useApi(() => getCategories(lang), [lang]);
  const { data: products, loading: prodsLoading } = useApi(() => getAllProducts(lang), [lang]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let list = products;
    if (activeSlug !== 'home' && activeSlug !== 'all') {
      const cat = categories?.find(c => c.slug === activeSlug);
      if (cat) list = list.filter(p => p.category_id === cat.id);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    return list;
  }, [products, categories, activeSlug, searchTerm]);
  
  const selectedProduct = useMemo(() => {
    return products?.find(p => p.id === selectedProductId);
  }, [products, selectedProductId]);

  const activeFont = settings?.google_font || 'Outfit';
  const headerHeight = settings?.header_height || 100;

  return (
    <div className="relative min-h-screen bg-cream text-[#2d3436]" style={{ fontFamily: `'${activeFont}', sans-serif` }}>
      {/* Font Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${activeFont.replace(' ', '+')}:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* Dynamic Theme Styles */}
      <style>{`
        :root {
          --primary-color: ${settings?.primary_color || '#2d5016'};
          --secondary-color: ${settings?.secondary_color || '#d4a574'};
        }
        .text-forest { color: var(--primary-color) !important; }
        .bg-forest { background-color: var(--primary-color) !important; }
        .border-forest { border-color: var(--primary-color) !important; }
      `}</style>

      {/* ── HEADER ───────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-[60] bg-white shadow-sm px-4" style={{ height: `${headerHeight}px` }}>
        <div className="max-w-xl mx-auto h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 py-2 h-full flex-1 min-w-0">
             <div className="h-full flex items-center shrink-0">
                {settings?.site_logo && (
                  <img 
                    src={settings.site_logo} 
                    className="h-24 w-auto object-contain -ml-2" 
                    alt="Logo" 
                  />
                )}
             </div>
             <div className="flex flex-col justify-center overflow-hidden">
               <h1 className="text-[12px] font-black text-[#1a1a1a] tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis uppercase">
                 {settings?.site_title}
               </h1>
               <p className="text-[8px] uppercase font-bold text-forest tracking-wider opacity-60 leading-none truncate">
                 {settings?.site_subtitle}
               </p>
             </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {/* Burger Icon */}
            <button onClick={() => setSidebarOpen(true)} className="w-10 h-8 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-lg transition">
              <span className="w-6 h-0.5 bg-[#2d3436] rounded-full" />
              <span className="w-6 h-0.5 bg-[#2d3436] rounded-full" />
              <span className="w-6 h-0.5 bg-[#2d3436] rounded-full" />
            </button>

            {/* Lang Switcher (Colorful) */}
            <div className="flex items-center gap-1.5 px-1 py-0.5 bg-gray-50 rounded-md shadow-inner">
                {languages?.map(l => (
                  <button 
                    key={l.code} 
                    onClick={() => setLang(l.code)} 
                    className={`transition-all hover:scale-115 active:scale-95 ${lang === l.code ? 'ring-1 ring-forest/40 rounded-sm scale-110' : 'opacity-100'}`}
                  >
                    <img 
                      src={`https://flagcdn.com/w40/${l.code === 'en' ? 'gb' : l.code === 'ar' ? 'sa' : l.code}.png`} 
                      className="w-4.5 h-auto shadow-sm block"
                      alt={l.code}
                    />
                  </button>
                ))}
            </div>
          </div>



        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────── */}
      <main className="max-w-xl mx-auto px-4 pt-4 pb-20" style={{ marginTop: `${headerHeight}px` }}>
        
        {/* Search Bar */}
        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 transition">
            <span className="text-xl">🔍</span>
          </div>
          <input 
            type="text" 
            placeholder={UI_STRINGS[lang]?.search_placeholder || 'Arama yap...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white h-16 pl-14 pr-6 rounded-[2rem] shadow-md border-2 border-transparent focus:border-forest/20 focus:ring-4 focus:ring-forest/5 transition-all text-sm font-bold placeholder:text-gray-300" 
          />

        </div>

        {/* View Switcher: Search Mode OR Category Selection OR Product List */}
        {searchTerm ? (
          <div className="animate-fadeIn">
             <h2 className="text-xl font-black mb-6 px-2">{UI_STRINGS[lang]?.search_results || 'Arama Sonuçları'} ({filteredProducts.length})</h2>
             <div className="grid grid-cols-1 gap-6">
               {filteredProducts.map(p => <ProductCardV2 key={p.id} product={p} onClick={() => setSelectedProductId(p.id)} lang={lang} />)}
             </div>

          </div>
        ) : activeSlug === 'home' ? (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-black mb-8 px-2 tracking-tighter">{UI_STRINGS[lang]?.what_would_you_like || 'Ne Yemek İstersiniz?'}</h2>
            {catsLoading ? (
              <Skeleton count={6} />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {categories?.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveSlug(cat.slug)}
                    className="group relative h-52 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-transparent hover:-translate-y-2"
                  >
                    <div className="absolute inset-x-2 top-2 h-32 rounded-2xl overflow-hidden bg-gray-50">
                      {cat.image ? (
                        <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                      ) : <div className="w-full h-full flex items-center justify-center text-4xl opacity-10 font-bold italic">IMG</div>}
                    </div>
                    <div className="absolute bottom-4 inset-x-0 px-4 text-center">
                      <h3 className="font-extrabold text-sm uppercase tracking-tight text-gray-700">{cat.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-sm font-black tracking-[0.2em] text-forest/40">{UI_STRINGS[lang]?.menu || 'MENÜ'}</h2>
              <h2 className="text-2xl font-black tracking-tighter uppercase">{categories?.find(c => c.slug === activeSlug)?.name}</h2>
              <button onClick={() => setActiveSlug('home')} className="text-xs font-black bg-white text-gray-500 px-6 py-2.5 rounded-full uppercase shadow-sm border border-gray-100 transition active:scale-95">{UI_STRINGS[lang]?.back || '← Geri Dön'}</button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {prodsLoading ? (
                <div className="space-y-4">
                  {Array.from({length:4}).map((_,i)=><div key={i} className="h-32 bg-white/50 rounded-3xl animate-pulse"/>)}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">{UI_STRINGS[lang]?.no_products || 'Bu kategoride ürün bulunamadı.'}</div>
              ) : (
                filteredProducts.map(p => <ProductCardV2 key={p.id} product={p} onClick={() => setSelectedProductId(p.id)} lang={lang} />)
              )}

            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="relative z-10 bg-[#2C5F2D] text-white px-4 py-6 mb-0">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
          {/* Larger Logo */}
          <div className="w-32 h-32">
             {settings?.site_logo && <img src={settings.site_logo} className="w-full h-full object-contain filter brightness-0 invert opacity-95" alt="Logo" />}
          </div>
          
          {/* Google Review CTA - Editable from Admin */}
          <a 
            href={settings?.footer_cta_link || settings?.review_link} 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center justify-center gap-6 bg-white px-12 py-3 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 w-full max-w-sm mx-auto"
          >
            <div className="flex flex-col items-center shrink-0">
              <span className="text-xl font-black mb-0.5">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <div className="flex gap-0.5 text-[#FBBC05] text-[10px] animate-pulse">
                {"★★★★★".split('').map((s,i) => <span key={i}>{s}</span>)}
              </div>
            </div>

            <div className="h-8 w-px bg-gray-100 hidden sm:block" />

            <span className="text-[#2C5F2D] font-bold text-[10px] uppercase tracking-tight leading-tight text-center sm:text-left">
              {settings?.footer_cta_text || (lang === 'tr' ? 'Görüşleriniz Bizim İçin Önemli. Bizi Değerlendirin.' : 'Your Feedback Matters. Rate Us.')}
            </span>
          </a>

          {/* Copyright Area - Editable from Admin */}
          <div className="mt-4 pt-4 border-t border-white/10 w-full text-center">
             <p className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">
               {settings?.footer_copyright || `© ${new Date().getFullYear()} Yedideğirmenler. Tüm Hakları Saklıdır.`}
             </p>
          </div>
        </div>
      </footer>






      {/* ── Sidebar & Modal ───────────────────────── */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        settings={settings} 
        categories={categories} 
        activeSlug={activeSlug}
        onCategoryClick={setActiveSlug}
        lang={lang}
        isRefreshing={catsLoading}
      />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          lang={lang}
          isRefreshing={prodsLoading}
          onClose={() => setSelectedProductId(null)} 
        />
      )}

    </div>
  );
}

