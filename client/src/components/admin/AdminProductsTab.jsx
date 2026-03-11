import { useEffect, useMemo, useState } from 'react';
import {
  FiBox,
  FiEdit2,
  FiLoader,
  FiAlertTriangle,
  FiPlus,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';

import { useProductStore } from '../../stores/useProductStore';
import { money, pickFirstError } from '../../utils/helpers';

import ProductFormModal from './products/ProductFormModal';
import DeleteProductModal from './products/DeleteProductModal';

export default function AdminProductsTab() {
  const products = useProductStore((s) => s.products);
  const loading = useProductStore((s) => s.loading);
  const error = useProductStore((s) => s.error);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchProducts({ search: debouncedSearch }).catch(() => {});
  }, [debouncedSearch, fetchProducts]);

  const reload = () => {
    fetchProducts({ search: debouncedSearch }).catch(() => {});
  };

  const errorText = useMemo(() => pickFirstError(error), [error]);

  return (
    <>
      <div className='rounded-3xl bg-white/80 shadow-xl p-6 space-y-5'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h2 className='text-xl font-bold text-slate-900'>Products</h2>
            <p className='text-slate-600 mt-1'>
              Pregled svih artikala dostupnih u sistemu.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
            <div className='relative w-full sm:w-80'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search products...'
                className='w-full rounded-2xl bg-white shadow-sm border border-slate-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
              />
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className='rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-3 font-semibold shadow-md hover:shadow-lg transition inline-flex items-center justify-center gap-2'
            >
              <FiPlus />
              Create product
            </button>
          </div>
        </div>

        {loading && (
          <div className='rounded-2xl bg-white shadow-md px-4 py-3 flex items-center gap-3 text-slate-700'>
            <FiLoader className='animate-spin' />
            Loading products...
          </div>
        )}

        {!loading && errorText && (
          <div className='rounded-2xl bg-orange-50 shadow-md px-4 py-3 flex items-center gap-3 text-orange-700'>
            <FiAlertTriangle />
            {errorText}
          </div>
        )}

        {!loading && !errorText && (
          <>
            <div className='rounded-2xl bg-green-50/70 px-4 py-3 text-sm text-slate-700 shadow-sm'>
              Total products:{' '}
              <span className='font-semibold'>{products.length}</span>
            </div>

            <div className='overflow-x-auto rounded-2xl shadow-md'>
              <table className='min-w-full bg-white'>
                <thead className='bg-slate-100 text-slate-700'>
                  <tr>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      ID
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Name
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Description
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Price
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Created
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-4 py-10 text-center text-slate-500'
                      >
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className='border-t border-slate-100 hover:bg-slate-50/80 transition'
                      >
                        <td className='px-4 py-3 text-sm font-semibold text-slate-800'>
                          #{product.id}
                        </td>

                        <td className='px-4 py-3'>
                          <div className='flex items-center gap-3 min-w-0'>
                            <div className='h-10 w-10 rounded-2xl bg-green-50 shadow flex items-center justify-center text-green-700'>
                              <FiBox />
                            </div>
                            <div className='min-w-0'>
                              <p className='font-semibold text-slate-900 truncate'>
                                {product.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className='px-4 py-3 text-sm text-slate-600 max-w-[360px]'>
                          <div className='truncate'>
                            {product.description || 'No description'}
                          </div>
                        </td>

                        <td className='px-4 py-3 text-sm font-semibold text-slate-900'>
                          {money(product.price)}
                        </td>

                        <td className='px-4 py-3 text-sm text-slate-600'>
                          {product.created_at
                            ? new Date(product.created_at).toLocaleString()
                            : '-'}
                        </td>

                        <td className='px-4 py-3'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => setEditProduct(product)}
                              className='rounded-xl bg-white shadow-sm hover:shadow-md px-3 py-2 text-slate-700 transition inline-flex items-center gap-2'
                            >
                              <FiEdit2 />
                              Edit
                            </button>

                            <button
                              onClick={() => setDeleteProduct(product)}
                              className='rounded-xl bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 transition inline-flex items-center gap-2'
                            >
                              <FiTrash2 />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ProductFormModal
        open={createOpen}
        mode='create'
        onClose={() => setCreateOpen(false)}
        onSuccess={reload}
      />

      <ProductFormModal
        open={Boolean(editProduct)}
        mode='edit'
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onSuccess={reload}
      />

      <DeleteProductModal
        open={Boolean(deleteProduct)}
        product={deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onSuccess={reload}
      />
    </>
  );
}