import IngredientRow from './IngredientRow';

export default function IngredientsList({
  ingredients = [],
  canAdd,
  onAddOne,
}) {
  if (!ingredients.length) {
    return (
      <div className='rounded-2xl bg-white/70 shadow-md p-4 text-slate-600'>
        No ingredients found.
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {ingredients.map((ing) => (
        <IngredientRow
          key={ing.id}
          ingredient={ing}
          canAdd={canAdd}
          onAdd={onAddOne}
        />
      ))}
    </div>
  );
}