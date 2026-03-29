// src/components/public/ProductCard.jsx
import AllergenBadge from './AllergenBadge';

export default function ProductCard({ product, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group glass rounded-[2.5rem] overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-3xl transition-all duration-500 animate-float border-2 border-white/50"
      style={{ animationDuration: `${6 + Math.random() * 4}s` }}
    >
      {/* Image Area */}
      <div className="relative h-56 transition-all duration-700 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-forest/5 gap-2">
            <span className="text-5xl opacity-20">🌿</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start z-10">
          {product.is_featured ? (
            <div className="bg-gold/90 backdrop-blur-md text-forest text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/30 uppercase tracking-tighter">
              ✨ GÜNÜN SEÇİMİ
            </div>
          ) : <div />}

          <div className="bg-forest/90 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center">
            {product.discount_price ? (
              <>
                <span className="text-[10px] line-through opacity-50 leading-none">{product.price}₺</span>
                <span className="text-sm font-black italic">{product.discount_price}₺</span>
              </>
            ) : (
              <span className="text-sm font-black italic">{product.price}₺</span>
            )}
          </div>
        </div>

        {/* Unavailable Overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-forest/80 backdrop-blur-md flex items-center justify-center z-20">
            <div className="text-center">
              <span className="text-gold font-black text-sm uppercase tracking-[0.2em] border-y-2 border-gold/30 py-2 px-4">
                {product.out_of_stock_text || 'TÜKENDİ'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="font-black text-forest text-lg leading-tight group-hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
          <div className="flex-1 border-b-2 border-dotted border-forest/10 min-w-[20px] mb-1"></div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-black text-forest">{product.discount_price || product.price}₺</span>
            {product.preparation_time && (
              <span className="text-[10px] bg-forest/5 text-forest/40 px-2 py-1 rounded-lg font-bold">
                {product.preparation_time} Dk
              </span>
            )}
          </div>
        </div>
        <p className="text-forest/60 text-sm line-clamp-2 mb-4 font-medium leading-relaxed">{product.description}</p>

        {/* Meta Info */}
        <div className="flex items-center justify-between mt-auto">
          {product.allergens?.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-w-[70%]">
              {product.allergens.slice(0, 2).map((a) => (
                <AllergenBadge key={a.id} allergen={a} showSeverity={false} />
              ))}
              {product.allergens.length > 2 && (
                <span className="text-[10px] bg-white/40 px-1.5 py-0.5 rounded-full text-forest font-bold">+{product.allergens.length - 2}</span>
              )}
            </div>
          ) : <div />}
          
          <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            →
          </div>
        </div>
      </div>
    </article>
  );
}
