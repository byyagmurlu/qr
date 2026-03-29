// src/components/public/ProductModal.jsx
import { useEffect } from 'react';
import AllergenBadge from './AllergenBadge';
import { UI_STRINGS } from '../../i18n/translations';

export default function ProductModal({ product, onClose, lang = 'tr' }) {
  const t = UI_STRINGS[lang] || UI_STRINGS.tr;

  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-cream w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl max-h-[95vh] overflow-y-auto shadow-2xl z-10 animate-[slideUp_0.3s_ease]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition"
        >
          ✕
        </button>

        {/* Image Area */}
        <div className="relative w-full bg-forest/[0.03] flex items-center justify-center overflow-hidden rounded-t-3xl border-b border-forest/5">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full max-h-[300px] md:max-h-[450px] object-contain transition-transform duration-700 hover:scale-105" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 w-full gap-2">
              <span className="text-8xl opacity-20">🍽️</span>
            </div>
          )}
          {/* Subtle gradient overlay at the bottom for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
        </div>

        <div className="p-6 md:p-8">
          {/* Title & Price */}
          <div className="flex justify-between items-start mb-4 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-forest">{product.name}</h2>
              {product.category_name && (
                <span className="text-sm text-water font-medium">{product.category_name}</span>
              )}
            </div>
            <div className="text-right shrink-0">
              {product.discount_price ? (
                <>
                  <span className="line-through text-sm text-gray-400 block">{product.price}₺</span>
                  <span className="text-3xl font-extrabold text-red-500">{product.discount_price}₺</span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-forest">{product.price}₺</span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 mb-5 leading-relaxed">{product.description}</p>
          )}

          {/* Nutrition */}
          {product.nutrition && product.nutrition.calories > 0 && (
            <div className="bg-white rounded-2xl p-4 mb-5 grid grid-cols-4 gap-3 text-center">
              {[
                { label: t.calories, value: `${product.nutrition.calories}`, unit: 'kcal', emoji: '🔥' },
                { label: t.protein, value: `${product.nutrition.protein}`, unit: 'g', emoji: '💪' },
                { label: t.fat, value: `${product.nutrition.fat}`, unit: 'g', emoji: '🧈' },
                { label: t.carbs, value: `${product.nutrition.carbs}`, unit: 'g', emoji: '🌾' },
              ].map(n => (
                <div key={n.label} className="flex flex-col">
                  <span className="text-xl">{n.emoji}</span>
                  <span className="font-bold text-forest">{n.value}<span className="text-xs font-normal">{n.unit}</span></span>
                  <span className="text-xs text-gray-400">{n.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {product.preparation_time && (
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="text-xl mb-1">⏱️</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t.prep_time}</div>
                <div className="font-bold text-forest text-sm">{product.preparation_time} dk</div>
              </div>
            )}
            {product.serving_size && (
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="text-xl mb-1">🍽️</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t.portion}</div>
                <div className="font-bold text-forest text-sm">{product.serving_size}</div>
              </div>
            )}
          </div>

          {/* Allergens */}
          {product.allergens?.length > 0 && (
            <div className="mb-5">
              <div className="flex items-baseline gap-2 mb-2">
                <h4 className="text-sm font-bold text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {t.allergens}
                </h4>
                <span className="text-[10px] text-gray-400 font-medium italic">{t.contains}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((a) => <AllergenBadge key={a.id} allergen={a} showSeverity={false} />)}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-forest text-cream py-4 rounded-2xl font-bold text-lg hover:bg-forest/80 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

