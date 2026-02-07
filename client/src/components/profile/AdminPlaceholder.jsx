import { FiTool, FiAlertTriangle } from 'react-icons/fi';

export default function AdminPlaceholder() {
  return (
    <div className='rounded-3xl bg-white/80 shadow-xl p-6'>
      <div className='flex items-start gap-3'>
        <div className='h-10 w-10 rounded-2xl bg-orange-50 shadow flex items-center justify-center text-orange-700'>
          <FiTool />
        </div>
        <div className='min-w-0'>
          <h2 className='text-lg font-bold text-slate-900'>Admin dashboard</h2>
          <p className='text-sm text-slate-700 mt-1'>
            This section is under construction. Soon you will have analytics,
            order management, and product/recipe administration here.
          </p>

          <div className='mt-4 rounded-2xl bg-green-50/60 shadow p-3 flex items-center gap-2 text-green-800'>
            <FiAlertTriangle />
            <span className='text-sm'>
              For now, use the API + Swagger for admin actions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}