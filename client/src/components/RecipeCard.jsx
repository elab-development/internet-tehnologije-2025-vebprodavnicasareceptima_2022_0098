import { Link } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';

export default function RecipeCard({ recipe }) {
  if (!recipe) return null;

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className='group block rounded-3xl bg-white/80 shadow-lg hover:shadow-xl transition p-5'
    >
      <div className='flex items-center gap-4'>
        {/* Icon */}
        <div className='w-12 h-12 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition'>
          <FiBookOpen size={22} />
        </div>

        {/* Name */}
        <div className='min-w-0'>
          <h3 className='text-lg font-semibold text-slate-900 truncate group-hover:text-green-700 transition'>
            {recipe.name}
          </h3>

          {recipe.description && (
            <p className='text-sm text-slate-600 truncate'>
              {recipe.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}