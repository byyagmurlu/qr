// src/components/admin/TranslationModal.jsx
import { useState, useEffect } from 'react';
import { getAdminLanguages, getTranslations, updateTranslations } from '../../services/api';

export default function TranslationModal({ entityType, entityId, fields, sourceValues, onClose, onSaved }) {

    const [languages, setLanguages] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [form, setForm] = useState({}); // { 'en.name': '...', 'en.description': '...' }
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [langs, trans] = await Promise.all([
                    getAdminLanguages(),
                    getTranslations(entityType, entityId)
                ]);
                const otherLangs = langs.filter(l => l.code !== 'tr');
                setLanguages(otherLangs);
                setTranslations(trans);
                
                const initialForm = {};
                otherLangs.forEach(lang => {
                    fields.forEach(field => {
                        const existing = trans.find(t => t.language_code === lang.code && t.field_name === field.key);
                        initialForm[`${lang.code}.${field.key}`] = existing ? existing.translation_text : '';
                    });
                });
                setForm(initialForm);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [entityType, entityId, fields]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = [];
            Object.entries(form).forEach(([key, value]) => {
                const [langCode, fieldName] = key.split('.');
                data.push({
                    language_code: langCode,
                    entity_type: entityType,
                    entity_id: entityId,
                    field_name: fieldName,
                    translation_text: value
                });
            });
            await updateTranslations({ translations: data });
            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            alert('Hata!');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-forest text-cream">
                    <div>
                        <h3 className="text-xl font-bold">🌐 Çeviri Yönetimi</h3>
                        <p className="text-xs opacity-70">Entity ID: {entityId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">✕</button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
                    {languages.map(lang => (
                        <div key={lang.code} className="space-y-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <h4 className="font-bold text-forest flex items-center gap-2">
                                <span className="text-xs uppercase bg-forest/10 px-2 py-0.5 rounded text-forest">{lang.code}</span>
                                {lang.name}
                            </h4>
                            {fields.map(field => (
                                <div key={field.key}>
                                    <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">{field.label}</label>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex-1">
                                            {field.type === 'textarea' ? (
                                                <textarea 
                                                    className="input text-sm resize-none" 
                                                    rows={2} 
                                                    value={form[`${lang.code}.${field.key}`] || ''}
                                                    onChange={(e) => setForm({...form, [`${lang.code}.${field.key}`]: e.target.value})}
                                                />
                                            ) : (
                                                <input 
                                                    className="input text-sm"
                                                    value={form[`${lang.code}.${field.key}`] || ''}
                                                    onChange={(e) => setForm({...form, [`${lang.code}.${field.key}`]: e.target.value})}
                                                />
                                            )}
                                        </div>
                                        <button 
                                            type="button"
                                            title="Yapay Zeka ile Çevir"
                                            disabled={saving}
                                            onClick={async () => {
                                                const sourceText = sourceValues[field.key];
                                                if (!sourceText) {
                                                    alert('Ana dilde (Türkçe) metin bulunamadı.');
                                                    return;
                                                }
                                                try {
                                                    setSaving(true);
                                                    const res = await aiTranslate({
                                                        text: sourceText,
                                                        target_lang: lang.code,
                                                        context: `${entityType} ${field.label}`
                                                    });
                                                    setForm(prev => ({ ...prev, [`${lang.code}.${field.key}`]: res.data.data.translated }));
                                                } catch (err) {
                                                    alert(err.response?.data?.error || 'AI Çeviri hatası.');
                                                } finally {
                                                    setSaving(false);
                                                }
                                            }}
                                            className="p-3 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition shrink-0"
                                        >
                                            {saving ? '⏳' : '✨'}
                                        </button>

                                    </div>

                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 text-base">
                            {saving ? '⏳ Kaydediliyor...' : '💾 Çevirileri Kaydet'}
                        </button>
                        <button type="button" onClick={onClose} className="btn-secondary py-3 text-base px-6">İptal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
