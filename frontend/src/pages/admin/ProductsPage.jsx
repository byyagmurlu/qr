// src/pages/admin/ProductsPage.jsx
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminProducts, getAdminCategories, getAllergens, createProduct, updateProduct, deleteProduct, uploadImage, setAllergenOnProduct, removeAllergenFromProduct } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import TranslationModal from '../../components/admin/TranslationModal';

const EMPTY_FORM = { category_id: '', name: '', description: '', price: '', discount_price: '', preparation_time: '', serving_size: '', calories: '', protein: '', fat: '', carbs: '', sort_order: 0, is_available: 1, is_featured: 0 };

function ProductForm({ initial, categories, allergens, onSave, onCancel, onImageUpload, onTranslate, loading }) {

  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_FORM;
    const f = { ...initial };
    ['description','preparation_time','serving_size','calories','protein','fat','carbs','discount_price','image_path','out_of_stock_text', 'price', 'sort_order'].forEach(k => { if (f[k] === null || f[k] === undefined) f[k] = ''; });
    if (f.category_id === null || f.category_id === undefined) f.category_id = '';
    return f;
  });
  const [selAllergens, setSelAllergens] = useState(initial?.allergens?.map(a => a.id) || []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAllergen = (id) => setSelAllergens(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !onImageUpload || !initial?.id) return;

    // Client-side resizing to 800x800
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 800;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Center crop/scale
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size / 2) - (img.width / 2) * scale;
        const y = (size / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
          const newEvent = { target: { files: [resizedFile] } };
          onImageUpload(newEvent, initial.id);
        }, 'image/jpeg', 0.85);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form, selAllergens); }} className="glass rounded-2xl p-6 space-y-5">
      <h3 className="font-bold text-forest text-lg">{initial?.id ? '✏️ Ürün Güncelle' : '➕ Yeni Ürün'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Upload Area */}
        <div className="md:row-span-2">
          <label className="label flex justify-between">
            <span>Ürün Görseli</span>
            <span className="text-[10px] text-brown opacity-60">Önerilen: 800x800px</span>
          </label>
          <div className="relative group aspect-square rounded-2xl bg-forest/5 border-2 border-dashed border-forest/20 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-forest/40">
            {initial?.image_path ? (
              <img src={`/uploads/${initial.image_path}`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📸</div>
                <div className="text-[10px] text-brown/50 font-medium">Resim seçmek için tıklayın</div>
              </div>
            )}
            {initial?.id && (
              <label className="absolute inset-0 bg-forest/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-2xl">📷</span>
                <span className="text-xs font-bold mt-1">Değiştir</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
            {!initial?.id && <div className="absolute inset-0 bg-cream/50 backdrop-blur-[2px] flex items-center justify-center p-4 text-center">
              <span className="text-[10px] text-forest font-bold uppercase tracking-wider">Görseli ürünü oluşturduktan sonra ekleyebilirsiniz.</span>
            </div>}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="label flex justify-between items-center">
            <span>Ürün Adı *</span>
            {initial?.id && (
              <button type="button" onClick={() => onTranslate('name')} className="text-xs text-forest/60 hover:text-forest transition flex items-center gap-1 font-bold">
                <span>🌐</span> Çeviriler
              </button>
            )}
          </label>
          <input required className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="label">Kategori *</label>
          <select required className="input" value={form.category_id} onChange={(e) => set('category_id', parseInt(e.target.value) || '')}>
            <option value="">Seç...</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Fiyat (₺) *</label>
          <input required type="number" step="0.01" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div>
          <label className="label">İndirimli Fiyat (₺)</label>
          <input type="number" step="0.01" className="input" value={form.discount_price} onChange={(e) => set('discount_price', e.target.value)} />
        </div>
        <div>
          <label className="label flex justify-between items-center">
            <span>Porsiyon</span>
            {initial?.id && (
              <button type="button" onClick={() => onTranslate('serving_size')} className="text-[10px] text-forest/60 hover:text-forest transition flex items-center gap-1 font-bold">
                <span>🌐</span>
              </button>
            )}
          </label>
          <input className="input" value={form.serving_size} onChange={(e) => set('serving_size', e.target.value)} placeholder="300 gr" />
        </div>
        <div>
          <label className="label">Hazırlama (dk)</label>
          <input type="number" className="input" value={form.preparation_time || 0} onChange={(e) => set('preparation_time', parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label">Kalori (kcal)</label>
          <input type="number" className="input" value={form.calories || 0} onChange={(e) => set('calories', parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label">Protein (g)</label>
          <input type="number" step="0.1" className="input" value={form.protein || 0} onChange={(e) => set('protein', parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label">Yağ (g)</label>
          <input type="number" step="0.1" className="input" value={form.fat || 0} onChange={(e) => set('fat', parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label">Karbonhidrat (g)</label>
          <input type="number" step="0.1" className="input" value={form.carbs || 0} onChange={(e) => set('carbs', parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label">Sıra</label>
          <input type="number" className="input" value={form.sort_order || 0} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
        <div className="md:col-span-3">
          <label className="label flex justify-between items-center">
            <span>Açıklama</span>
            {initial?.id && (
              <button type="button" onClick={() => onTranslate('description')} className="text-xs text-forest/60 hover:text-forest transition flex items-center gap-1 font-bold">
                <span>🌐</span> Çeviriler
              </button>
            )}
          </label>
          <textarea className="input resize-none" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="md:col-span-3 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 w-full max-w-[220px] p-4 rounded-2xl bg-white/50 border border-forest/10 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Durum</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={!!form.is_available} onChange={(e) => set('is_available', e.target.checked ? 1 : 0)} />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest"></div>
              </label>
            </div>
            <span className={`text-lg font-bold mt-1 ${form.is_available ? 'text-forest' : 'text-red-500'}`}>
              {form.is_available ? 'Mevcut' : 'Tükendi'}
            </span>
            {!form.is_available && (
              <input className="input mt-2 text-xs py-1.5 h-auto px-3" placeholder="Görünecek yazı (Örn: Kalmadı)" value={form.out_of_stock_text || ''} onChange={(e) => set('out_of_stock_text', e.target.value)} />
            )}
          </div>

          <div className="flex flex-col gap-1 w-full max-w-[220px] p-4 rounded-2xl bg-white/50 border border-forest/10 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Öne Çıkar</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={!!form.is_featured} onChange={(e) => set('is_featured', e.target.checked ? 1 : 0)} />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
            <span className={`text-lg font-bold mt-1 ${form.is_featured ? 'text-amber-500' : 'text-gray-400'}`}>
              {form.is_featured ? 'Öne Çıkan' : 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Allergen Selector */}
      {allergens?.length > 0 && (
        <div>
          <label className="label">Alerjenler</label>
          <div className="flex flex-wrap gap-2">
            {allergens.map(a => (
              <button key={a.id} type="button" onClick={() => toggleAllergen(a.id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition border ${selAllergens.includes(a.id) ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white/50 border-gray-200 text-gray-500 hover:border-red-200'}`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}</button>
        <button type="button" onClick={onCancel} className="btn-secondary">İptal</button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [catFilter, setCatFilter] = useState('');
  const { data: productsData, loading, refetch } = useApi(() => getAdminProducts({ page, limit: 15, ...(catFilter && { category_id: catFilter }) }), [page, catFilter]);
  const { data: categories } = useApi(getAdminCategories);
  const { data: allergens } = useApi(getAllergens);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploadId, setImageUploadId] = useState(null);
  const [translating, setTranslating] = useState(null); // { id, type: 'product', fields: [{key:'name', label:'Ürün Adı'}, {key:'description', label:'Açıklama'}] }

  const products = productsData?.data;
  const pagination = productsData?.pagination;

  const handleSave = async (form, allergenIds) => {
    setSaving(true);
    try {
      if (form.id) {
        await updateProduct(form.id, { ...form, allergen_ids: allergenIds });
      } else {
        await createProduct({ ...form, allergen_ids: allergenIds });
      }
      setEditing(null);
      setShowForm(false);
      refetch();
    } catch (err) {
      alert(err?.response?.data?.error || 'Hata oluştu.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" ürününü silmek istiyor musunuz?`)) return;
    try { await deleteProduct(id); refetch(); }
    catch { alert('Silinemedi.'); }
  };

  const handleImageUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try { await uploadImage(id, fd); refetch(); }
    catch { alert('Görsel yüklenemedi.'); }
    setImageUploadId(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-forest">🍽️ Ürünler</h1>
          <p className="text-sm text-brown">{pagination?.total || 0} ürün</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">➕ Yeni Ürün</button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select className="input max-w-xs" value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}>
          <option value="">Tüm Kategoriler</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {(showForm && !editing) && (
        <div className="mb-6">
          <ProductForm loading={saving} categories={categories} allergens={allergens} onSave={handleSave} onCancel={() => setShowForm(false)} onImageUpload={handleImageUpload} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-16 glass rounded-2xl animate-pulse"/>)}</div>
      ) : (
        <div className="space-y-3">
          {products?.map((prod) => (
            <div key={prod.id}>
              <div className="glass rounded-2xl px-5 py-4 flex items-center gap-4 hover:shadow-lg transition">
                {/* Image thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-forest/10 shrink-0">
                  {prod.image_path
                    ? <img src={`/uploads/${prod.image_path}`} className="w-full h-full object-cover" />
                    : <div className="flex items-center justify-center h-full text-xl">🍽️</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-forest flex items-center gap-2 flex-wrap">
                    {prod.name}
                    {prod.is_featured ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐ Öne Çıkan</span> : ''}
                    {!prod.is_available ? <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Tükendi</span> : ''}
                  </div>
                  <div className="text-xs text-brown">{prod.category_name} — {prod.price}₺{prod.discount_price ? ` (İndirimli: ${prod.discount_price}₺)` : ''}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setTranslating({ 
                    id: prod.id, 
                    name: prod.name, 
                    fields: [
                      {key:'name', label:'Ürün Adı'}, 
                      {key:'description', label:'Açıklama', type:'textarea'},
                      {key:'serving_size', label:'Porsiyon Bilgisi'}
                    ],
                    sourceValues: { name: prod.name, description: prod.description, serving_size: prod.serving_size }
                  })} className="btn-icon" title="Çeviriler">🌐</button>

                  <label className="btn-icon cursor-pointer" title="Görsel Yükle">
                    📷
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, prod.id)} />
                  </label>
                  <button onClick={() => { setEditing(prod); setShowForm(true); }} className="btn-icon">✏️</button>
                  <button onClick={() => handleDelete(prod.id, prod.name)} className="btn-icon text-red-400">🗑️</button>
                </div>
              </div>
              {editing?.id === prod.id && showForm && (
                <div className="mt-2">
                  <ProductForm 
                    initial={editing} 
                    loading={saving} 
                    categories={categories} 
                    allergens={allergens} 
                    onSave={handleSave} 
                    onCancel={() => { setEditing(null); setShowForm(false); }} 
                    onImageUpload={handleImageUpload} 
                    onTranslate={(field) => {
                      let fields = [];
                      if (field === 'name') fields = [{key:'name', label:'Ürün Adı'}];
                      else if (field === 'description') fields = [{key:'description', label:'Açıklama', type:'textarea'}];
                      else if (field === 'serving_size') fields = [{key:'serving_size', label:'Porsiyon Bilgisi'}];

                      setTranslating({
                        id: editing.id,
                        name: editing.name,
                        fields: fields,
                        sourceValues: { name: editing.name, description: editing.description, serving_size: editing.serving_size }
                      });
                    }}
                  />

                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold transition ${page === p ? 'bg-forest text-cream' : 'glass text-forest hover:shadow'}`}>{p}</button>
          ))}
        </div>
      )}
      {/* Translation Modal */}
      {translating && (
        <TranslationModal 
          entityType="product" 
          entityId={translating.id} 
          fields={translating.fields} 
          sourceValues={translating.sourceValues}
          onClose={() => setTranslating(null)} 
          onSaved={() => alert('Çeviriler kaydedildi.')} 
        />
      )}
    </AdminLayout>
  );
}
