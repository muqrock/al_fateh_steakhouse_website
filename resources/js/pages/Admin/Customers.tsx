import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { usePage, router } from '@inertiajs/react';

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  joined_date: string;
  total_spend: number;
  total_orders: number;
  total_reviews: number;
}

interface PageProps {
  customers: {
    data: Customer[];
    total: number;
    links: any[];
    [key: string]: any;
  };
  filters: {
    search?: string;
    date_from?: string;
    date_to?: string;
    min_spend?: string;
    max_spend?: string;
    sort_by?: string;
    sort_order?: string;
  };
  [key: string]: any;
}

const AdminCustomers: React.FC = () => {
  const { customers = { data: [], total: 0, links: [] }, filters = {} } = usePage<PageProps>().props;
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [minSpend, setMinSpend] = useState(filters.min_spend || '');
  const [maxSpend, setMaxSpend] = useState(filters.max_spend || '');
  const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
  const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

  // Handle filter submission
  const handleFilter = () => {
    router.get('/admin/customers', {
      search: searchTerm,
      date_from: dateFrom,
      date_to: dateTo,
      min_spend: minSpend,
      max_spend: maxSpend,
      sort_by: sortBy,
      sort_order: sortOrder,
    });
  };

  // Handle reset filters
  const handleReset = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setMinSpend('');
    setMaxSpend('');
    setSortBy('created_at');
    setSortOrder('desc');
    router.get('/admin/customers');
  };
  
  // Calculate summary statistics
  const totalCustomers = customers.total || 0;
  const totalSpend = customers.data.reduce((sum, customer) => sum + (Number(customer.total_spend) || 0), 0);
  const totalOrders = customers.data.reduce((sum, customer) => sum + (Number(customer.total_orders) || 0), 0);
  const averageSpend = totalCustomers > 0 ? totalSpend / totalCustomers : 0;

  return (
    <AdminLayout currentPage="Customer List">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#4e2e1e' }}>Customer Management</h1>
        <p style={{ color: '#6b7280', fontSize: 16 }}>Manage registered customers and their information</p>
      </div>

      {/* Summary Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Total Customers</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 700, color: '#4e2e1e' }}>{totalCustomers}</p>
        </div>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Total Revenue</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 700, color: '#059669' }}>RM {totalSpend.toFixed(2)}</p>
        </div>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Total Orders</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{totalOrders}</p>
        </div>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{ margin: 0, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Average Spend</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 700, color: '#d97706' }}>RM {averageSpend.toFixed(2)}</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={{ 
        background: 'white', 
        borderRadius: 12, 
        padding: 24,
        marginBottom: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#4e2e1e' }}>Search & Filter</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
          {/* Search Input */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Search Name or Email
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4e2e1e'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Date From */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Join Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {/* Date To */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Join Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {/* Min Spend */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Min Spend (RM)
            </label>
            <input
              type="number"
              value={minSpend}
              onChange={(e) => setMinSpend(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {/* Max Spend */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Max Spend (RM)
            </label>
            <input
              type="number"
              value={maxSpend}
              onChange={(e) => setMaxSpend(e.target.value)}
              placeholder="1000"
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="created_at">Join Date</option>
              <option value="name">Name</option>
              <option value="total_spend">Total Spend</option>
              <option value="total_orders">Total Orders</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            onClick={handleFilter}
            style={{
              background: '#4e2e1e',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#3a1f14'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4e2e1e'}
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#6b7280'}
          >
            Reset Filters
          </button>
        </div>
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
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Join Date</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Total Spend</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Orders</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Reviews</th>
              </tr>
            </thead>
            <tbody>
              {customers.data.length > 0 ? customers.data.map((customer: Customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '16px 12px', color: '#374151', fontWeight: 500 }}>
                    {customer.name}
                  </td>
                  <td style={{ padding: '16px 12px', color: '#374151' }}>
                    {customer.email}
                  </td>
                  <td style={{ padding: '16px 12px', color: '#6b7280', fontSize: 14 }}>
                    {customer.joined_date}
                  </td>
                  <td style={{ padding: '16px 12px', color: '#059669', fontWeight: 600 }}>
                    RM {(Number(customer.total_spend) || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '16px 12px', color: '#374151', textAlign: 'center' }}>
                    <span style={{
                      background: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {customer.total_orders}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', color: '#374151', textAlign: 'center' }}>
                    <span style={{
                      background: '#fef3c7',
                      color: '#d97706',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {customer.total_reviews}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {customers.links && customers.links.length > 3 && (
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            {customers.links.map((link: any, index: number) => {
              if (link.url === null) {
                return (
                  <span
                    key={index}
                    style={{
                      padding: '8px 12px',
                      color: '#9ca3af',
                      fontSize: 14,
                      cursor: 'not-allowed'
                    }}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => router.visit(link.url)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    backgroundColor: link.active ? '#4e2e1e' : 'white',
                    color: link.active ? 'white' : '#374151',
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!link.active) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!link.active) {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
