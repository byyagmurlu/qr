import React from 'react';
import { UI_STRINGS } from '../../i18n/translations';

export default function Sidebar({ isOpen, onClose, settings, categories, activeSlug, onCategoryClick, lang }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Content */}
      <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl animate-slide-left flex flex-col">
        {/* Header */}
        <div className="bg-[#2d3436] text-white p-5 flex items-center justify-between">
          <h2 className="font-black text-lg uppercase tracking-tighter">{UI_STRINGS[lang]?.menu || 'MENÜ'}</h2>
          <button onClick={onClose} className="text-2xl opacity-50 hover:opacity-100 transition">✕</button>
        </div>

        {/* Info & Puanla */}
        <div className="overflow-y-auto flex-1 scrollbar-none">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                {settings?.site_logo && <img src={settings.site_logo} className="w-full h-full object-contain" alt="Logo" />}
              </div>
              <div>
                <h3 className="font-extrabold text-forest uppercase leading-none">{settings?.site_title}</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">{settings?.site_subtitle}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold text-gray-500">
              {(settings?.sb_show_address && settings?.address) && <p className="flex items-center gap-3"><span>📍</span> {settings.address}</p>}
              {(settings?.sb_show_hours && settings?.business_hours) && <p className="flex items-center gap-3"><span>🕐</span> {settings.business_hours}</p>}
              {(settings?.sb_show_email && settings?.email) && <p className="flex items-center gap-3"><span>✉️</span> {settings.email}</p>}
              {(settings?.sb_show_phone && settings?.phone) && <p className="flex items-center gap-3"><span>📞</span> {settings.phone}</p>}
            </div>
          </div>

          <div className="p-6">
            <a href={settings?.review_link} target="_blank" rel="noreferrer" 
               className="w-full py-4 rounded-xl bg-forest/5 text-forest border border-forest/10 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest mb-8 hover:bg-forest hover:text-white transition group">
              <span>⭐ {UI_STRINGS[lang]?.rate_us || 'Bizi Puanlayın'}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>


            <div className="space-y-1">
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { onCategoryClick(cat.slug); onClose(); }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                    activeSlug === cat.slug ? 'bg-forest/10 text-forest shadow-sm' : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    {cat.image && <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />}
                  </div>
                  <span className="font-extrabold text-sm uppercase tracking-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-4">
          {settings?.social_whatsapp && <a href={`https://wa.me/${settings.social_whatsapp}`} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition shadow-sm font-bold text-xs">W</a>}
          {settings?.social_instagram && <a href={settings.social_instagram} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition shadow-sm font-bold text-xs">I</a>}
          {settings?.social_facebook && <a href={settings.social_facebook} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition shadow-sm font-bold text-xs">F</a>}
        </div>
      </div>
    </div>
  );
}
