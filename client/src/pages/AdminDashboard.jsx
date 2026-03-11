import { useState } from 'react';
import { FiUsers, FiBox, FiBookOpen, FiClipboard } from 'react-icons/fi';

import AdminProductsTab from '../components/admin/AdminProductsTab';
import AdminRecipesTab from '../components/admin/AdminRecipesTab';
import AdminOrdersTab from '../components/admin/AdminOrdersTab';
import { classNames } from '../utils/helpers';

const tabs = [
  { key: 'products', label: 'Products', icon: FiBox },
  { key: 'recipes', label: 'Recipes', icon: FiBookOpen },
  { key: 'orders', label: 'Orders', icon: FiClipboard },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <AdminProductsTab />;
      case 'recipes':
        return <AdminRecipesTab />;
      case 'orders':
        return <AdminOrdersTab />;
      default:
        return <AdminUsersTab />;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='rounded-3xl bg-white/80 shadow-xl p-6'>
        <h1 className='text-2xl font-bold text-slate-900'>Admin Dashboard</h1>
        <p className='mt-2 text-slate-600'>
          Manage products, recipes and orders from one place.
        </p>
      </div>

      <div className='rounded-3xl bg-white/80 shadow-xl p-3'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={classNames(
                  'rounded-2xl px-4 py-4 shadow-sm transition flex items-center justify-center gap-2 font-semibold',
                  isActive
                    ? 'bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-green-50',
                )}
              >
                <Icon className='text-lg' />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {renderContent()}
    </div>
  );
}