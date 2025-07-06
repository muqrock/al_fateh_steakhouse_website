import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface PageProps {
  customers: Customer[];
  [key: string]: any;
}

const AdminCustomers: React.FC = () => {
  const { customers = [] } = usePage<PageProps>().props;

  return (
    <AdminLayout currentPage="Customer List">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#4e2e1e' }}>Customer Management</h1>
        <p style={{ color: '#6b7280', fontSize: 16 }}>Manage registered customers and their information</p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: 12, 
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Name</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Email</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Role</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '16px 12px', color: '#374151' }}>{customer.name}</td>
                  <td style={{ padding: '16px 12px', color: '#374151' }}>{customer.email}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: 500,
                      background: customer.role === 'admin' ? '#fee2e2' : '#f0fdf4',
                      color: customer.role === 'admin' ? '#dc2626' : '#16a34a'
                    }}>
                      {customer.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', color: '#6b7280', fontSize: 14 }}>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
