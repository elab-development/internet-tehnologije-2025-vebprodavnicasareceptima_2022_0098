import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';

import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import { classNames } from '../utils/helpers';

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const items = useCartStore((s) => s.items);

  const cartCount = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it.quantity || 0), 0);
  }, [items]);

  const cartPreview = useMemo(() => items.slice(0, 4), [items]);

  const onLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/login');
  };

  const linkBase =
    'px-3 py-2 rounded-xl text-sm font-medium transition shadow-sm';
  const linkActive = 'bg-white text-green-700 shadow-md';
  const linkIdle = 'text-slate-700 hover:bg-white/70 hover:text-green-700';

  return (
    <header className='sticky top-0 z-50'>
      <div className='backdrop-blur bg-white/70 shadow-md'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='h-16 flex items-center justify-between'>
            {/* LEFT */}
            <div className='flex items-center gap-3'>
              <Link
                to='/'
                className='flex items-center gap-2 rounded-2xl px-3 py-2 bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-lg'
              >
                <span className='text-base font-semibold'>Recipes Shop</span>
              </Link>
            </div>

            {/* DESKTOP RIGHT */}
            <nav className='hidden md:flex items-center gap-2'>
              {!user ? (
                <>
                  <NavLink
                    to='/'
                    className={({ isActive }) =>
                      classNames(linkBase, isActive ? linkActive : linkIdle)
                    }
                  >
                    Recipes (Home)
                  </NavLink>

                  <NavLink
                    to='/login'
                    className={({ isActive }) =>
                      classNames(
                        linkBase,
                        isActive
                          ? 'bg-white text-orange-600 shadow-md'
                          : 'text-slate-700 hover:bg-white/70 hover:text-orange-600',
                      )
                    }
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to='/register'
                    className={({ isActive }) =>
                      classNames(
                        linkBase,
                        isActive
                          ? 'bg-white text-orange-600 shadow-md'
                          : 'text-slate-700 hover:bg-white/70 hover:text-orange-600',
                      )
                    }
                  >
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to='/'
                    className={({ isActive }) =>
                      classNames(linkBase, isActive ? linkActive : linkIdle)
                    }
                  >
                    Recipes
                  </NavLink>

                  <NavLink
                    to='/profile'
                    className={({ isActive }) =>
                      classNames(
                        linkBase,
                        isActive
                          ? 'bg-white text-orange-600 shadow-md'
                          : 'text-slate-700 hover:bg-white/70 hover:text-orange-600',
                      )
                    }
                  >
                    Profile
                  </NavLink>

                  {/* Cart */}
                  <div className='relative group'>
                    <NavLink
                      to='/cart'
                      className={({ isActive }) =>
                        classNames(
                          linkBase,
                          'bg-white/80 hover:bg-white shadow-md',
                          isActive ? 'text-green-700' : 'text-slate-800',
                        )
                      }
                    >
                      <span className='inline-flex items-center gap-2'>
                        <FiShoppingCart className='text-lg' />
                        <span className='hidden lg:inline'>Cart</span>
                        <span className='ml-1 inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-orange-500 text-white text-xs shadow'>
                          {cartCount}
                        </span>
                      </span>
                    </NavLink>

                    {/* Preview popover */}
                    <div className='hidden group-hover:block absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl p-3'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-semibold text-slate-800'>
                          Cart preview
                        </span>
                        <span className='text-xs text-slate-500'>
                          {cartCount} items
                        </span>
                      </div>

                      {items.length === 0 ? (
                        <div className='text-sm text-slate-600 py-3'>
                          Korpa je prazna.
                        </div>
                      ) : (
                        <div className='space-y-2'>
                          {cartPreview.map((it) => (
                            <div
                              key={it.product_id}
                              className='flex items-center justify-between rounded-xl bg-green-50/60 p-2'
                            >
                              <div className='min-w-0'>
                                <p className='text-sm font-medium text-slate-800 truncate'>
                                  {it.name}
                                </p>
                                <p className='text-xs text-slate-600'>
                                  Qty: {it.quantity}
                                </p>
                              </div>

                              {/* prikaz po komadu */}
                              <p className='text-sm font-semibold text-green-700'>
                                {Number(it.price || 0).toFixed(2)}
                              </p>
                            </div>
                          ))}

                          {items.length > 4 && (
                            <p className='text-xs text-slate-500'>
                              + još {items.length - 4} item-a
                            </p>
                          )}

                          <Link
                            to='/cart'
                            className='block text-center mt-2 rounded-xl bg-gradient-to-r from-green-600 to-orange-500 text-white py-2 text-sm font-semibold shadow'
                          >
                            Open cart
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className='px-3 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-md transition'
                  >
                    Logout
                  </button>

                  <div className='ml-2 hidden lg:flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 shadow-sm'>
                    <span className='w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shadow'>
                      {(user?.name || 'U').slice(0, 1).toUpperCase()}
                    </span>
                    <div className='leading-tight'>
                      <p className='text-sm font-semibold text-slate-800'>
                        {user?.name}
                      </p>
                      <p className='text-xs text-slate-500'>{user?.email}</p>
                    </div>
                  </div>
                </>
              )}
            </nav>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setOpen((v) => !v)}
              className='md:hidden rounded-2xl bg-white/80 shadow-md px-3 py-2 text-slate-800'
              aria-label='Menu'
            >
              {open ? (
                <FiX className='text-xl' />
              ) : (
                <FiMenu className='text-xl' />
              )}
            </button>
          </div>

          {/* MOBILE MENU */}
          {open && (
            <div className='md:hidden pb-4'>
              <div className='rounded-2xl bg-white/80 shadow-lg p-3 space-y-2'>
                {!user ? (
                  <>
                    <NavLink
                      to='/'
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          'block px-3 py-2 rounded-xl shadow-sm',
                          isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-white/70 text-slate-700',
                        )
                      }
                    >
                      Recipes (Home)
                    </NavLink>

                    <NavLink
                      to='/login'
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          'block px-3 py-2 rounded-xl shadow-sm',
                          isActive
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-white/70 text-slate-700',
                        )
                      }
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to='/register'
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          'block px-3 py-2 rounded-xl shadow-sm',
                          isActive
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-white/70 text-slate-700',
                        )
                      }
                    >
                      Register
                    </NavLink>
                  </>
                ) : (
                  <>
                    <div className='flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white p-3 shadow'>
                      <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold'>
                        {(user?.name || 'U').slice(0, 1).toUpperCase()}
                      </div>
                      <div className='min-w-0'>
                        <p className='font-semibold truncate'>{user?.name}</p>
                        <p className='text-xs opacity-90 truncate'>
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <NavLink
                      to='/'
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          'block px-3 py-2 rounded-xl shadow-sm',
                          isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-white/70 text-slate-700',
                        )
                      }
                    >
                      Recipes
                    </NavLink>

                    <NavLink
                      to='/profile'
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          'block px-3 py-2 rounded-xl shadow-sm',
                          isActive
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-white/70 text-slate-700',
                        )
                      }
                    >
                      Profile
                    </NavLink>

                    <NavLink
                      to='/cart'
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          'flex items-center justify-between px-3 py-2 rounded-xl shadow-sm',
                          isActive
                            ? 'bg-white text-green-700'
                            : 'bg-white/70 text-slate-700',
                        )
                      }
                    >
                      <span className='flex items-center gap-2'>
                        <FiShoppingCart />
                        <span>Cart</span>
                      </span>
                      <span className='min-w-[24px] h-6 px-2 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center shadow'>
                        {cartCount}
                      </span>
                    </NavLink>

                    <button
                      onClick={onLogout}
                      className='w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 shadow-md transition'
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}