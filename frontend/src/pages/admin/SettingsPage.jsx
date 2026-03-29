// src/pages/admin/SettingsPage.jsx
import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminSettings, updateAdminSettings, uploadSettingImage } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const FIELDS = [
  { key: 'site_title',       label: 'Site Başlığı',        type: 'text',     req: true  },
  { key: 'site_subtitle',    label: 'Alt Başlık',           type: 'text'                },
  { key: 'site_description', label: 'Site Açıklaması',      type: 'textarea'            },
  { key: 'phone',            label: 'Telefon',              type: 'text'                },
  { key: 'email',            label: 'E-posta',              type: 'email'               },
  { key: 'address',          label: 'Adres',                type: 'text'                },
  { key: 'business_hours',   label: 'Çalışma Saatleri',    type: 'text',  placeholder: 'Her Gün: 08:00 - 22:00' },
];

const SEO_FIELDS = [
  { key: 'meta_keywords',    label: 'Meta Anahtar Kelimeler',  type: 'text'                },
  { key: 'meta_description', label: 'Meta Açıklama (SEO)',     type: 'textarea'            },
];

export default function SettingsPage() {
  const { data: settings, loading, refetch } = useApi(getAdminSettings);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      const f = { ...settings };
      ['site_logo', 'site_favicon', 'out_of_stock_text', 'meta_keywords', 'meta_description'].forEach(k => {
        if (f[k] === null) f[k] = '';
      });
      setForm(f);
    }
  }, [settings]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(''); setError('');
    try {
      await updateAdminSettings(form);
      setSuccess('✅ Ayarlar başarıyla güncellendi!');
      refetch();
    } catch (err) {
      setError(err?.response?.data?.error || 'Bir hata oluştu.');
    } finally { setSaving(false); }
  };

  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    setSuccess(''); setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = key === 'site_favicon' ? 64 : 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size / 2) - (img.width / 2) * scale;
        const y = (size / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        canvas.toBlob(async (blob) => {
          const resizedFile = new File([blob], file.name, { type: 'image/png' });
          const fd = new FormData();
          fd.append('image', resizedFile);
          
          try {
            const res = await uploadSettingImage(key, fd);
            set(key, res.data.data.url);
            setSuccess('✅ Görsel başarıyla güncellendi!');
            refetch();
          } catch (err) {
            setError('Görsel yüklenemedi.');
          } finally { setSaving(false); }
        }, 'image/png', 0.9);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-forest">⚙️ Site Ayarları</h1>
        <p className="text-sm text-brown mt-0.5">Genel site bilgilerini güncelleyin</p>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({length:6}).map((_,i)=><div key={i} className="h-14 glass rounded-xl animate-pulse"/>)}</div>
      ) : (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5 max-w-2xl">
          {/* Branding Section */}
          <div className="p-6 rounded-2xl bg-forest/5 border border-forest/10 space-y-4 mb-4">
            <h3 className="font-bold text-forest flex items-center gap-2">🎨 Logo ve Kimlik</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label flex justify-between">
                  <span>Site Logosu</span>
                  <span className="text-[10px] opacity-40">Önerilen: 512x512px (PNG)</span>
                </label>
                <label className="relative flex items-center gap-3 group cursor-pointer bg-white/50 p-2 rounded-xl border border-forest/10 hover:border-forest/30 transition-all">
                  <div className="w-12 h-12 bg-white rounded-lg border border-forest/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {form.site_logo ? <img src={form.site_logo} className="w-full h-full object-contain" /> : <span className="text-xs opacity-20">LOGO</span>}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-forest">Logo Değiştir</div>
                    <div className="text-[10px] text-brown opacity-60 truncate max-w-[120px]">{form.site_logo || 'Seçilmedi'}</div>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'site_logo')} />
                </label>
              </div>
              <div className="space-y-2">
                <label className="label flex justify-between">
                  <span>Site İkonu (Favicon)</span>
                  <span className="text-[10px] opacity-40">Önerilen: 64x64px</span>
                </label>
                <label className="relative flex items-center gap-3 group cursor-pointer bg-white/50 p-2 rounded-xl border border-forest/10 hover:border-forest/30 transition-all">
                  <div className="w-12 h-12 bg-white rounded-lg border border-forest/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {form.site_favicon ? <img src={form.site_favicon} className="w-full h-full object-contain" /> : <span className="text-xs opacity-20">ICON</span>}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-forest">İkon Değiştir</div>
                    <div className="text-[10px] text-brown opacity-60 truncate max-w-[120px]">{form.site_favicon || 'Seçilmedi'}</div>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'site_favicon')} />
                </label>
              </div>
            </div>
            <div>
              <label className="label">Stokta Yok Yazısı (Global)</label>
              <input className="input" value={form.out_of_stock_text || ''} onChange={(e) => set('out_of_stock_text', e.target.value)} placeholder="Tükendi" />
            </div>
          </div>

          <div className="space-y-5">
            {FIELDS.map(({ key, label, type, req, placeholder }) => (
              <div key={key}>
                <label className="label">{label}{req && ' *'}</label>
                {type === 'textarea' ? (
                  <textarea required={req} className="input resize-none" rows={3} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
                ) : (
                  <input required={req} type={type} className="input" value={form[key] || ''} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
                )}
              </div>
            ))}
          </div>

          {/* Advanced Design Panel */}
          <div className="p-6 rounded-2xl bg-forest/5 border border-forest/10 space-y-6 mb-4">
            <h3 className="font-bold text-forest flex items-center gap-2 text-lg">✨ Tasarım & Görünüm</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Layout Version */}
              <div className="space-y-4">
                <label className="label">Menü Tasarım Şablonu</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => set('menu_layout', 'v1')}
                    className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${form.menu_layout === 'v1' ? 'border-gold bg-gold/5 text-forest font-bold shadow-lg' : 'border-black/5 text-gray-400 opacity-60'}`}>
                    <div className="text-2xl mb-1">🎴</div>
                    V1 Klasik
                  </button>
                  <button type="button" onClick={() => set('menu_layout', 'v2')}
                    className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${form.menu_layout === 'v2' ? 'border-gold bg-gold/5 text-forest font-bold shadow-lg' : 'border-black/5 text-gray-400 opacity-60'}`}>
                    <div className="text-2xl mb-1">📱</div>
                    V2 Modern
                  </button>
                </div>
              </div>

              {/* Theme Colors */}
              <div className="space-y-4">
                <label className="label">Kurumsal Renkler</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-forest/50">Ana Renk</span>
                    <div className="flex items-center gap-2 bg-white/50 p-1 rounded-xl border border-black/5">
                      <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-none" value={form.primary_color || '#2d5016'} onChange={(e) => set('primary_color', e.target.value)} />
                      <input type="text" className="bg-transparent border-none text-[10px] font-mono w-full focus:ring-0" value={form.primary_color || ''} onChange={(e) => set('primary_color', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-forest/50">Yardımcı Renk</span>
                    <div className="flex items-center gap-2 bg-white/50 p-1 rounded-xl border border-black/5">
                      <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-none" value={form.secondary_color || '#d4a574'} onChange={(e) => set('secondary_color', e.target.value)} />
                      <input type="text" className="bg-transparent border-none text-[10px] font-mono w-full focus:ring-0" value={form.secondary_color || ''} onChange={(e) => set('secondary_color', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-forest/10">
              {/* Header Customization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-forest/40">🔝 Header (Üst Kısım)</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="label flex justify-between">Şeffaflık <span>{(form.header_opacity || 0.8) * 100}%</span></label>
                      <input type="range" min="0.1" max="1" step="0.1" className="w-full accent-forest" value={form.header_opacity || 0.8} onChange={(e) => set('header_opacity', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="label flex justify-between">Yükseklik <span>{form.header_height || 120}px</span></label>
                      <input type="range" min="80" max="300" step="10" className="w-full accent-forest" value={form.header_height || 120} onChange={(e) => set('header_height', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Footer & Typography */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-forest/40">🦶 Footer (Alt Kısım)</h4>
                    <div className="space-y-2">
                      <label className="label">Footer Metni</label>
                      <textarea className="input text-xs resize-none" rows={2} value={form.footer_text || ''} onChange={(e) => set('footer_text', e.target.value)} placeholder="Alt bilgi metni..." />
                    </div>
                    <div className="p-3 rounded-xl bg-white/50 border border-black/5 space-y-3">
                      <div className="text-[10px] font-black uppercase text-forest/40 tracking-wider">Footer Buton & Alt Bilgi</div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500">Buton Metni</label>
                        <input className="input h-9 text-xs" value={form.footer_cta_text || ''} onChange={(e) => set('footer_cta_text', e.target.value)} placeholder="Dilek & Şikayet Yaz" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500">Buton Linki</label>
                        <input className="input h-9 text-xs" value={form.footer_cta_link || ''} onChange={(e) => set('footer_cta_link', e.target.value)} placeholder="https://..." />
                      </div>
                      <div className="space-y-2 pt-2 border-t border-black/5">
                        <label className="text-[10px] font-bold text-gray-500">Copyright (Telif Hakkı) Metni</label>
                        <input className="input h-9 text-xs" value={form.footer_copyright || ''} onChange={(e) => set('footer_copyright', e.target.value)} placeholder="© 2024 Şirket Adı" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="label">Font Ailesi</label>
                      <select className="input text-sm" value={form.google_font || 'Outfit'} onChange={(e) => set('google_font', e.target.value)}>
                        <option value="Outfit">Outfit (Doğal & Modern)</option>
                        <option value="Inter">Inter (Temiz & Kurumsal)</option>
                        <option value="Poppins">Poppins (Etkileyici & Yuvarlak)</option>
                        <option value="Roboto">Roboto (Klasik & Okunabilir)</option>
                      </select>
                    </div>
                  </div>
              </div>

              {/* Social Links & Review Link */}
              <div className="space-y-4 pt-4 border-t border-forest/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-forest/40">📱 Sosyal Madya & Bağlantılar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 bg-white/50 p-2 rounded-xl border border-black/5">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#25D366]/10 text-[#25D366] rounded-lg">W</span>
                    <input className="bg-transparent border-none text-xs w-full focus:ring-0" value={form.social_whatsapp || ''} onChange={(e) => set('social_whatsapp', e.target.value)} placeholder="WhatsApp" />
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 p-2 rounded-xl border border-black/5">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#E1306C]/10 text-[#E1306C] rounded-lg">I</span>
                    <input className="bg-transparent border-none text-xs w-full focus:ring-0" value={form.social_instagram || ''} onChange={(e) => set('social_instagram', e.target.value)} placeholder="Instagram" />
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 p-2 rounded-xl border border-black/5">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#4267B2]/10 text-[#4267B2] rounded-lg font-black">f</span>
                    <input className="bg-transparent border-none text-xs w-full focus:ring-0" value={form.social_facebook || ''} onChange={(e) => set('social_facebook', e.target.value)} placeholder="Facebook" />
                  </div>
                  <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded-xl border border-blue-100">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg text-[10px] font-black italic">MAP</span>
                    <input className="bg-transparent border-none text-xs w-full focus:ring-0" value={form.social_maps || ''} onChange={(e) => set('social_maps', e.target.value)} placeholder="Google Maps URL" />
                  </div>
                  <div className="flex items-center gap-2 bg-[#FEE2E2] p-2 rounded-xl border border-red-200 col-span-1 md:col-span-2">
                    <span className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-lg text-lg">⭐</span>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase font-black text-red-700 opacity-60">Google Yorum & Puanlama Linki</div>
                      <input className="bg-transparent border-none text-xs w-full focus:ring-0 font-bold" value={form.review_link || ''} onChange={(e) => set('review_link', e.target.value)} placeholder="https://g.page/r/YOUR_ID/review" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-4 pt-4 border-t border-forest/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-forest/40">🍔 Yan Menü (Sidebar) Ayarları</h4>
                <div className="grid grid-cols-2 gap-3">
                   {[
                     {k: 'sb_show_address', l: '📍 Adres Göster'},
                     {k: 'sb_show_hours',   l: '🕐 Saatleri Göster'},
                     {k: 'sb_show_email',   l: '✉️ E-posta Göster'},
                     {k: 'sb_show_phone',   l: '📞 Telefon Göster'},
                   ].map(({k, l}) => (
                     <label key={k} className="flex items-center gap-2 p-3 rounded-xl bg-white/50 border border-black/5 cursor-pointer hover:bg-forest/5 transition">
                       <input type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked ? 1 : 0)} className="w-4 h-4 rounded text-forest" />
                       <span className="text-[11px] font-bold text-forest">{l}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-4">
            <h3 className="font-bold text-amber-700 flex items-center gap-2">🔍 SEO ve Arama Motoru</h3>
            {SEO_FIELDS.map(({ key, label, type, req, placeholder }) => (
              <div key={key}>
                <label className="label text-amber-800/70">{label}</label>
                {type === 'textarea' ? (
                  <textarea className="input bg-white/50 resize-none border-amber-200/30 focus:border-amber-400" rows={2} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
                ) : (
                  <input type={type} className="input bg-white/50 border-amber-200/30 focus:border-amber-400" value={form[key] || ''} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
                )}
              </div>
            ))}
          </div>

          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm animate-bounce-gentle">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div className="sticky bottom-0 pt-4 bg-cream/90 backdrop-blur-sm pb-2">
            <button type="submit" disabled={saving} className="btn-primary w-full text-base py-3.5 shadow-xl shadow-forest/20 active:scale-95 transition-all">
              {saving ? '⏳ Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
