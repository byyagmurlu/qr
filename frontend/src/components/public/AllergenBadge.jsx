// src/components/public/AllergenBadge.jsx
const SEVERITY_COLORS = {
  trace:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  low:    'bg-yellow-200 text-yellow-800 border-yellow-300',
  medium: 'bg-orange-100 text-orange-700 border-orange-200',
  high:   'bg-red-100 text-red-700 border-red-200',
};

const ICONS = {
  gluten:    '🌾', milk: '🥛', eggs: '🥚', peanuts: '🥜',
  nuts:      '🌰', fish: '🐟', shellfish: '🦐', soy: '🫘',
  sesame:    '✨', sulfites: '🍷', celery: '🥬', mustard: '🟡',
};

export default function AllergenBadge({ allergen, showSeverity = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${SEVERITY_COLORS[allergen.severity] || SEVERITY_COLORS.trace}`}
      title={allergen.name}
    >
      <span>{allergen.icon_code || ICONS[allergen.code] || '⚠️'}</span>
      <span>{allergen.name}</span>
      {showSeverity && (
        <span className="opacity-60">
          ({allergen.severity === 'high' ? 'Yüksek' : allergen.severity === 'medium' ? 'Orta' : 'Az'})
        </span>
      )}
    </span>
  );
}
