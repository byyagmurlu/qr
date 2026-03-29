// src/components/public/ProductCardV2.jsx
import AllergenBadge from './AllergenBadge';
import { UI_STRINGS } from '../../i18n/translations';

export default function ProductCardV2({ product, onClick, lang = 'tr' }) {

  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-black/5 flex h-44 sm:h-48"
    >
      {/* Content Area (Left) */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
        <div>
          <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1 truncate group-hover:text-forest transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.discount_price ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-gray-900">{product.discount_price}₺</span>
                <span className="text-sm text-gray-400 line-through">{product.price}₺</span>
              </div>
            ) : (
              <span className="text-lg font-black text-gray-900">{product.price}₺</span>
            )}
          </div>
          
          <button className="bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap">
            {UI_STRINGS[lang]?.view_details || 'İncele'}
          </button>
        </div>
      </div>

      {/* Image Area (Right) */}
      <div className="w-1/3 sm:w-2/5 relative overflow-hidden bg-gray-50 shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full opacity-10">
            <span className="text-4xl">🍴</span>
          </div>
        )}

        {/* Badges Over Image */}
        {product.is_featured && (
          <div className="absolute top-2 right-2 bg-gold text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter">
            {UI_STRINGS[lang]?.choice || 'SEÇİM'}
          </div>
        )}
        
        {/* Unavailable Overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 p-2">
            <span className="text-white font-bold text-[10px] uppercase tracking-wider text-center">
              {product.out_of_stock_text || UI_STRINGS[lang]?.sold_out || 'TÜKENDİ'}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
