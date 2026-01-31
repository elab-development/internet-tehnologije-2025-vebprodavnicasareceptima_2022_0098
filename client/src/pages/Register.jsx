import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useAuthStore } from '../stores/useAuthStore';
import { pickFirstError } from '../utils/helpers';

export default function Register() {
  const navigate = useNavigate();

  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorText = useMemo(() => pickFirstError(error), [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch {}
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 via-white to-orange-50'>
      <div className='max-w-6xl mx-auto px-4 py-10'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          {/* Left (desktop only) */}
          <div className='hidden md:block'>
            <div className='rounded-3xl bg-white/70 shadow-xl p-8'>
              <h1 className='text-3xl font-extrabold text-slate-900'>
                Create your account 🚀
              </h1>
              <p className='mt-2 text-slate-600'>
                Register to access profile features, cart and orders.
              </p>

              <div className='mt-6 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white p-5 shadow-lg'>
                <p className='text-sm opacity-90'>Quick start</p>
                <p className='mt-1 font-semibold'>
                  Enter your name, email and password (min 8 characters).
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className='rounded-3xl bg-white/80 shadow-xl p-6 md:p-8'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-slate-900'>Register</h2>
              <span className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold shadow-sm'>
                <FiUserPlus /> New
              </span>
            </div>

            {errorText && (
              <div className='mt-4 rounded-2xl bg-orange-50 text-orange-800 p-3 shadow-sm flex gap-2'>
                <FiAlertTriangle className='mt-0.5' />
                <div className='text-sm'>{errorText}</div>
              </div>
            )}

            <form onSubmit={onSubmit} className='mt-6 space-y-4'>
              <label className='block'>
                <span className='text-sm font-semibold text-slate-700'>
                  Name
                </span>
                <div className='mt-1 flex items-center gap-2 rounded-2xl bg-white shadow-sm px-3 py-2'>
                  <FiUser className='text-slate-500' />
                  <input
                    value={name}
                    onChange={(e) => {
                      clearError();
                      setName(e.target.value);
                    }}
                    type='text'
                    autoComplete='name'
                    placeholder='Jane Doe'
                    className='w-full bg-transparent outline-none text-slate-800'
                    required
                    maxLength={255}
                  />
                </div>
              </label>

              <label className='block'>
                <span className='text-sm font-semibold text-slate-700'>
                  Email
                </span>
                <div className='mt-1 flex items-center gap-2 rounded-2xl bg-white shadow-sm px-3 py-2'>
                  <FiMail className='text-slate-500' />
                  <input
                    value={email}
                    onChange={(e) => {
                      clearError();
                      setEmail(e.target.value);
                    }}
                    type='email'
                    autoComplete='email'
                    placeholder='jane@example.com'
                    className='w-full bg-transparent outline-none text-slate-800'
                    required
                  />
                </div>
              </label>

              <label className='block'>
                <span className='text-sm font-semibold text-slate-700'>
                  Password
                </span>
                <div className='mt-1 flex items-center gap-2 rounded-2xl bg-white shadow-sm px-3 py-2'>
                  <FiLock className='text-slate-500' />
                  <input
                    value={password}
                    onChange={(e) => {
                      clearError();
                      setPassword(e.target.value);
                    }}
                    type='password'
                    autoComplete='new-password'
                    placeholder='Minimum 8 characters'
                    className='w-full bg-transparent outline-none text-slate-800'
                    required
                    minLength={8}
                  />
                </div>
              </label>

              <button
                disabled={loading}
                className='w-full rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white font-semibold py-3 shadow-lg hover:opacity-95 transition disabled:opacity-60'
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className='text-sm text-slate-600 text-center'>
                Already have an account?{' '}
                <Link
                  to='/login'
                  className='font-semibold text-green-700 hover:text-orange-600'
                >
                  Login
                </Link>
              </p>
            </form>

            <p className='mt-6 text-xs text-slate-500 text-center'>
              Your password is never stored in plain text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}