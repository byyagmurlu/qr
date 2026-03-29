// src/pages/admin/AllergensPage.jsx
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminAllergens, createAllergen, updateAllergen, deleteAllergen } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import TranslationModal from '../../components/admin/TranslationModal';

const EMPTY = { code: '', name: '', icon_code: '', description: '', sort_order: 0 };

function AllergenForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(() => {
    const f = initial || EMPTY;
    return { ...f, description: f.description || '', sort_order: f.sort_order || 0 };
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v || '' }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="glass rounded-2xl p-6 mb-4 space-y-4">
      <h3 className="font-bold text-forest">{initial?.id ? '✏️ Düzenle' : '➕ Yeni Alerjen'}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className="label">Kod *</label>
          <input required className="input" value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="gluten" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="label">Ad *</label>
          <input required className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Gluten" />
        </div>
        <div>
          <label className="label">İkon</label>
          <input className="input" value={form.icon_code} onChange={(e) => set('icon_code', e.target.value)} placeholder="fi-rr-wheat" />
        </div>
        <div>
          <label className="label">Sıra</label>
          <input type="number" className="input" value={form.sort_order || 0} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
        <div className="col-span-2 md:col-span-4">
          <label className="label">Açıklama</label>
          <input className="input" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? '⏳' : '💾 Kaydet'}</button>
        <button type="button" onClick={onCancel} className="btn-secondary">İptal</button>
      </div>
    </form>
  );
}

export default function AllergensPage() {
  const { data: allergens, loading, refetch } = useApi(getAdminAllergens);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(null);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (form.id) await updateAllergen(form.id, form);
      else await createAllergen(form);
      setEditing(null); setShowForm(false); refetch();
    } catch (err) { alert(err?.response?.data?.error || 'Hata.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" alerjenini silmek istiyor musunuz?`)) return;
    try { await deleteAllergen(id); refetch(); } catch { alert('Silinemedi.'); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-forest">⚠️ Alerjenler</h1>
          <p className="text-sm text-brown">{allergens?.length || 0} alerjen tanımlı</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">➕ Yeni Alerjen</button>
      </div>

      {showForm && !editing && <AllergenForm loading={saving} onSave={handleSave} onCancel={() => setShowForm(false)} />}

      <div className="space-y-2">
        {loading ? Array.from({length:6}).map((_,i)=><div key={i} className="h-14 glass rounded-xl animate-pulse"/>) :
          allergens?.map(a => (
            <div key={a.id}>
              <div className="glass rounded-xl px-5 py-3 flex items-center gap-4">
                <span className="text-2xl w-8 text-center">⚠️</span>
                <div className="flex-1">
                  <div className="font-bold text-forest">{a.name}</div>
                  <div className="text-xs text-brown">{a.code} {a.description && `— ${a.description}`}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTranslating({ 
                    id: a.id, 
                    name: a.name, 
                    fields: [{key:'name', label:'Alerjen Adı'}],
                    sourceValues: { name: a.name }
                  })} className="btn-icon" title="Çeviriler">🌐</button>
                  <button onClick={() => { setEditing(a); setShowForm(true); }} className="btn-icon">✏️</button>
                  <button onClick={() => handleDelete(a.id, a.name)} className="btn-icon text-red-400">🗑️</button>
                </div>
              </div>
              {editing?.id === a.id && showForm && (
                <div className="mt-2">
                  <AllergenForm initial={editing} loading={saving} onSave={handleSave} onCancel={() => { setEditing(null); setShowForm(false); }} />
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* Translation Modal */}
      {translating && (
        <TranslationModal 
          entityType="allergen" 
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
