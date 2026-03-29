import { useState, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminCategories, createCategory, updateCategory, deleteCategory, uploadCategoryImage } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import TranslationModal from '../../components/admin/TranslationModal';

const EMPTY_FORM = { name: '', description: '', icon_code: '', color_code: '#2d5016', sort_order: 0, is_active: 1, image: '' };

function CategoryForm({ initial, onSave, onCancel, onTranslate, loading }) {
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_FORM;
    const f = { ...initial };
    ['description', 'icon_code', 'image'].forEach(k => { if (f[k] === null) f[k] = ''; });
    return f;
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      set('image', URL.createObjectURL(f));
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form, file); }} className="glass rounded-2xl p-6 mb-6 space-y-4">
      <h3 className="font-bold text-forest text-lg">{initial?.id ? '✏️ Kategori Düzenle' : '➕ Yeni Kategori'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="label">Kategori Görseli</label>
          <div className="flex gap-4 items-center">
            <div className="w-24 h-24 rounded-2xl bg-forest/5 border-2 border-dashed border-forest/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-forest/40 transition"
                 onClick={() => fileInputRef.current.click()}>
              {form.image ? (
                <img src={form.image} className="w-full h-full object-cover" alt="Cat Preview" />
              ) : <span className="text-2xl opacity-20">📷</span>}
            </div>
            <div className="flex-1 text-xs text-brown">
              <p className="font-bold mb-1">Görsel seçmek için tıklayın</p>
              <p className="opacity-60">Önerilen: Kare, minimum 500x500px</p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        <div>
           <label className="label flex justify-between items-center">
             <span>Ad *</span>
             {initial?.id && (
               <button type="button" onClick={() => onTranslate('name')} className="text-[10px] text-forest/60 hover:text-forest transition flex items-center gap-1 font-bold">
                 <span>🌐</span> Çeviriler
               </button>
             )}
           </label>
           <input required className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Kahvaltı" />
        </div>
        <div>
           <label className="label">Sıra</label>
           <input type="number" className="input" value={form.sort_order || 0} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label">Renk</label>
          <div className="flex gap-2">
            <input type="color" className="h-11 w-14 rounded-lg border border-forest/20 cursor-pointer" value={form.color_code} onChange={(e) => set('color_code', e.target.value)} />
            <input className="input flex-1" value={form.color_code} onChange={(e) => set('color_code', e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-8">
           <input type="checkbox" id="cat-active" checked={!!form.is_active} onChange={(e) => set('is_active', e.target.checked ? 1 : 0)} className="w-4 h-4" />
           <label htmlFor="cat-active" className="text-sm text-forest font-medium">Aktif</label>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}</button>
        <button type="button" onClick={onCancel} className="btn-secondary">İptal</button>
      </div>
    </form>
  );
}

export default function CategoriesPage() {
  const { data: categories, loading, refetch } = useApi(getAdminCategories);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [translating, setTranslating] = useState(null);

  const handleSave = async (form, file) => {
    setSaving(true);
    try {
      let id = form.id;
      if (id) await updateCategory(id, form);
      else {
        const res = await createCategory(form);
        id = res.data.data.id;
      }
      
      if (file) {
        const fd = new FormData();
        fd.append('image', file);
        await uploadCategoryImage(id, fd);
      }

      setEditing(null);
      setShowForm(false);
      refetch();
    } catch (err) {
      alert(err?.response?.data?.error || 'Hata oluştu.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" kategorisini silmek istiyor musunuz?`)) return;
    try { await deleteCategory(id); refetch(); }
    catch { alert('Silinemedi. Kategoride ürün olabilir.'); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-forest uppercase tracking-tight">Kategori Yönetimi</h1>
          <p className="text-sm text-brown mt-0.5">{categories?.length || 0} aktif kategori mevcut</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          ➕ Yeni Kategori
        </button>
      </div>

      {(showForm && !editing) && (
        <CategoryForm loading={saving} onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({length:5}).map((_,i)=><div key={i} className="h-16 glass rounded-2xl animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories?.map((cat) => (
            <div key={cat.id} className="group flex flex-col">
              <div className="glass rounded-3xl p-4 flex items-center gap-5 hover:shadow-2xl transition-all border border-forest/5 hover:border-forest/20 relative">
                <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center overflow-hidden border border-forest/10 shrink-0">
                  {cat.image ? (
                    <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                  ) : <span className="text-2xl italic opacity-20">No Img</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-forest text-lg flex items-center gap-2">
                    {cat.name}
                    {!cat.is_active && <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full uppercase">Pasif</span>}
                  </div>
                  <div className="text-xs text-brown font-bold opacity-60 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color_code }} />
                    {cat.products_count || 0} Ürün • Sıra: {cat.sort_order}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setTranslating({ 
                    id: cat.id, 
                    name: cat.name, 
                    fields: [{key:'name', label:'Kategori Adı'}],
                    sourceValues: { name: cat.name }
                  })} className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition shadow-sm" title="Çeviriler">🌐</button>
                  <button onClick={() => { setEditing(cat); setShowForm(true); }} className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition shadow-sm">✏️</button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-sm">🗑️</button>
                </div>
              </div>
              {editing?.id === cat.id && showForm && (
                <div className="mt-3">
                  <CategoryForm 
                    initial={editing} 
                    loading={saving} 
                    onSave={handleSave} 
                    onCancel={() => { setEditing(null); setShowForm(false); }} 
                    onTranslate={(field) => setTranslating({
                      id: editing.id,
                      name: editing.name,
                      fields: [{key:'name', label:'Kategori Adı'}],
                      sourceValues: { name: editing.name }
                    })}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Translation Modal */}
      {translating && (
        <TranslationModal 
          entityType="category" 
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
