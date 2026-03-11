import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiClipboard,
  FiLoader,
  FiAlertTriangle,
  FiPackage,
  FiEye,
} from 'react-icons/fi';

import { useOrderStore } from '../../stores/useOrderStore';
import { money, pickFirstError, statusBadgeClass } from '../../utils/helpers';

export default function AdminOrdersTab() {
  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.loading);
  const error = useOrderStore((s) => s.error);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  useEffect(() => {
    fetchOrders().catch(() => {});
  }, [fetchOrders]);

  const errorText = useMemo(() => pickFirstError(error), [error]);

  return (
    <div className='rounded-3xl bg-white/80 shadow-xl p-6 space-y-5'>
      <div>
        <h2 className='text-xl font-bold text-slate-900'>Orders</h2>
        <p className='text-slate-600 mt-1'>
          Pregled svih porudžbina u sistemu.
        </p>
      </div>

      {loading && (
        <div className='rounded-2xl bg-white shadow-md px-4 py-3 flex items-center gap-3 text-slate-700'>
          <FiLoader className='animate-spin' />
          Loading orders...
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
            Total orders: <span className='font-semibold'>{orders.length}</span>
          </div>

          <div className='overflow-x-auto rounded-2xl shadow-md'>
            <table className='min-w-full bg-white'>
              <thead className='bg-slate-100 text-slate-700'>
                <tr>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    ID
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    User
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Items
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Total
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Status
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
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-4 py-10 text-center text-slate-500'
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const itemsCount = Array.isArray(order.items)
                      ? order.items.length
                      : 0;

                    return (
                      <tr
                        key={order.id}
                        className='border-t border-slate-100 hover:bg-slate-50/80 transition'
                      >
                        <td className='px-4 py-3 text-sm font-semibold text-slate-800'>
                          #{order.id}
                        </td>

                        <td className='px-4 py-3'>
                          <div className='min-w-0'>
                            <p className='font-semibold text-slate-900 truncate'>
                              {order?.user?.name || 'Unknown user'}
                            </p>
                            <p className='text-sm text-slate-600 truncate'>
                              {order?.user?.email || '-'}
                            </p>
                          </div>
                        </td>

                        <td className='px-4 py-3 text-sm text-slate-700'>
                          <div className='inline-flex items-center gap-2'>
                            <span className='h-8 w-8 rounded-xl bg-green-50 shadow flex items-center justify-center text-green-700'>
                              <FiPackage />
                            </span>
                            <span className='font-semibold'>{itemsCount}</span>
                          </div>
                        </td>

                        <td className='px-4 py-3 text-sm font-semibold text-slate-900'>
                          {money(order.total_amount)}
                        </td>

                        <td className='px-4 py-3'>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full shadow-sm ${statusBadgeClass(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className='px-4 py-3 text-sm text-slate-600'>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString()
                            : '-'}
                        </td>

                        <td className='px-4 py-3'>
                          <Link
                            to={`/order/${order.id}`}
                            className='rounded-xl bg-white shadow-sm hover:shadow-md px-3 py-2 text-slate-700 transition inline-flex items-center gap-2'
                          >
                            <FiEye />
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}