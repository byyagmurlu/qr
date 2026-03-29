import React, { useState } from 'react';
import { bulkExportUrl, bulkImportProducts, bulkSampleUrl } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

export default function BulkPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`${bulkExportUrl}?token=${token}`, '_blank');
    alert('Stok listesi indiriliyor...');
  };

  const handleSample = () => {
    const token = localStorage.getItem('token');
    window.open(`${bulkSampleUrl}?token=${token}`, '_blank');
    alert('Örnek şablon indiriliyor...');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Lütfen bir CSV dosyası seçin.');
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await bulkImportProducts(formData);
      setResult(res.data.data);
      alert('İçe aktarma başarıyla tamamlandı!');
      setFile(null);
      if (document.getElementById('file-upload')) {
        document.getElementById('file-upload').value = '';
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Dosya yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAITranslate = async (force = false) => {
    if (force && !window.confirm('Mevcut tüm çeviriler silinecek ve yeniden yapılacak. Emin misiniz?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('v1/admin/ai/bulk-translate', { force: force ? 1 : 0 });
      alert(`İşlem tamam! ${res.data.data.products} ürün, ${res.data.data.categories} kategori ve ${res.data.data.debug?.settings || 0} site ayarı çevirisi eklendi.`);
    } catch (err) {
      alert(err.response?.data?.error || 'Yapay zeka çevirisi sırasında bir hata oluştu. Lütfen API anahtarını kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Toplu İşlemler</h1>
            <p className="text-gray-500 font-medium">Ürünleri içeriye/dışarıya aktarabilir veya akıllı çeviri yapabilirsiniz.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleAITranslate(false)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-2xl font-bold hover:scale-105 transition disabled:opacity-50 disabled:scale-100"
            >
              {loading ? '⏳ İşleniyor...' : '🌐 TÜMÜNÜ AI İLE ÇEVİR'}
            </button>
            
            <button 
              onClick={() => handleAITranslate(true)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold hover:bg-red-100 transition disabled:opacity-50"
            >
              {loading ? '⏳' : '🔄 SIFIRLA VE YENİDEN ÇEVİR'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Export Section */}
          <div className="glass-light p-8 rounded-[2rem] border border-forest/5 flex flex-col justify-between h-full hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 bg-water/20 rounded-2xl flex items-center justify-center text-2xl mb-4">📥</div>
              <h3 className="text-lg font-bold text-forest mb-2">Stok Listesini İndir</h3>
              <p className="text-gray-500 text-xs mb-6 leading-relaxed">
                Mevcut ürünlerinizi içeren CSV dosyasını indirin. İsimleri, fiyatları ve açıklamaları toplu düzenlemek için en iyi yöntemdir.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <button onClick={handleExport} className="w-full bg-forest text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition shadow-lg shadow-forest/20">📊 LİSTEYİ İNDİR (CSV)</button>
              <button onClick={handleSample} className="w-full bg-water/20 text-forest py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition flex items-center justify-center gap-2">📥 ŞABLON İNDİR</button>
            </div>
          </div>

          {/* Import Section */}
          <div className="glass-light p-8 rounded-[2rem] border border-forest/5 h-full hover:shadow-xl transition-all flex flex-col">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl mb-4">📤</div>
            <h3 className="text-lg font-bold text-forest mb-2">Listeyi Yükle</h3>
            <p className="text-gray-500 text-xs mb-6 leading-relaxed">Düzenlediğiniz dosyayı buraya yükleyerek tüm menüyü saniyeler içinde güncelleyin.</p>
            
            <form onSubmit={handleImport} className="space-y-4 mt-auto">
              <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              <label htmlFor="file-upload" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-forest/20 rounded-2xl cursor-pointer hover:bg-forest/5 transition-all text-center">
                <span className="text-[10px] font-bold text-forest/60 underline uppercase tracking-tighter">{file ? file.name : 'DOSYA SEÇİN'}</span>
              </label>
              <button type="submit" disabled={loading || !file} className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition shadow-lg ${loading || !file ? 'bg-gray-200 text-gray-400' : 'bg-orange-500 text-white hover:scale-[1.02]'}`}>
                {loading ? 'YÜKLENİYOR...' : 'SİSTEME GÖNDER'}
              </button>
            </form>
          </div>

          {/* AI Section */}
          <div className="glass bg-white/60 p-8 rounded-[2rem] border border-amber-200 flex flex-col justify-between group hover:shadow-2xl transition-all h-full scale-[1.02] relative z-10">
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">YENİ</div>
            <div>
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">✨</div>
              <h2 className="text-xl font-bold text-amber-900 mb-2">Yapay Zeka Çeviri</h2>
              <p className="text-sm text-brown leading-relaxed mb-6 opacity-80">
                Eksik olan tüm ürün ve kategorileri tek tıkla <b>İngilizce, Arapça ve Rusça</b> dillerine profesyonelce (Gemini AI) çevirin.
              </p>
            </div>
            <button
              onClick={handleAITranslate}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition shadow-xl ${loading ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-200'}`}
            >
              🔄 TÜMÜNÜ AI İLE ÇEVİR
            </button>
          </div>
        </div>

        {/* Results Info */}
        {result && (
          <div className="p-6 rounded-3xl bg-forest/5 border border-forest/10 grid grid-cols-3 gap-6 animate-slide-up">
            <div className="text-center"><p className="text-2xl font-black text-forest">{result.updated}</p><p className="text-[10px] uppercase font-bold text-gray-400">Güncellendi</p></div>
            <div className="text-center border-x border-forest/10"><p className="text-2xl font-black text-forest">{result.created}</p><p className="text-[10px] uppercase font-bold text-gray-400">Eklendi</p></div>
            <div className="text-center"><p className="text-2xl font-black text-red-500">{result.errors}</p><p className="text-[10px] uppercase font-bold text-gray-400">Hatalar</p></div>
          </div>
        )}

        {/* Guidance */}
        <div className="glass-light p-8 rounded-[2rem] border border-forest/5 grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-forest/40">💡 Başarı İçin İpuçları</h4>
            <ul className="text-xs text-gray-500 space-y-3 list-disc pl-4">
              <li>Sistem önce <b>ID</b> kolonu ile eşleştirme yapar. Eğer ID yoksa, <b>İsim/Kategori</b> ikilisine göre günceller.</li>
              <li>Yeni ürün eklemek için ID alanını boş bırakmanız yeterlidir.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-forest/40">🌍 Dil Desteği</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sistemimiz şu an <b>Türkçe (Ana), İngilizce, Arapça ve Rusça</b> dillerini desteklemektedir. Yapay zeka ile çeviri yapmadan önce config dosyasında API anahtarınızın tanımlı olduğundan emin olun.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
