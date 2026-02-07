import { FiUser, FiMail, FiShield } from 'react-icons/fi';

export default function ProfileHeader({ user }) {
  const initial = (user?.name || 'U').slice(0, 1).toUpperCase();
  const role = user?.role || 'user';

  return (
    <div className='rounded-3xl bg-white/80 shadow-xl p-6'>
      <div className='flex items-center gap-4'>
        <div className='h-14 w-14 rounded-3xl bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-lg flex items-center justify-center text-xl font-bold'>
          {initial}
        </div>

        <div className='min-w-0'>
          <h1 className='text-xl font-bold text-slate-900 truncate'>
            {user?.name || 'Profile'}
          </h1>

          <div className='mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-700'>
            <span className='inline-flex items-center gap-2 rounded-xl bg-white/70 shadow-sm px-3 py-1'>
              <FiMail />
              <span className='truncate'>{user?.email || '-'}</span>
            </span>

            <span className='inline-flex items-center gap-2 rounded-xl bg-white/70 shadow-sm px-3 py-1'>
              <FiShield />
              <span className='font-semibold'>{role}</span>
            </span>
          </div>
        </div>

        <div className='ml-auto hidden md:flex items-center gap-2 text-slate-600'>
          <FiUser />
          <span className='text-sm'>Account</span>
        </div>
      </div>
    </div>
  );
}