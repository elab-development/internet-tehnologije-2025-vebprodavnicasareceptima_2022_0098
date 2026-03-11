import { FiX } from 'react-icons/fi';

export default function Modal({
  open,
  title,
  children,
  onClose,
  widthClass = 'max-w-2xl',
}) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-slate-900/50 backdrop-blur-sm'
        onClick={onClose}
      />

      <div
        className={`relative w-full ${widthClass} rounded-3xl bg-white shadow-2xl`}
      >
        <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
          <h3 className='text-xl font-bold text-slate-900'>{title}</h3>

          <button
            onClick={onClose}
            className='rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 transition'
            aria-label='Close modal'
            type='button'
          >
            <FiX className='text-lg' />
          </button>
        </div>

        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}