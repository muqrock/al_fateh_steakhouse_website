import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

interface Reservation {
  id: number;
  name: string;
  email: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  created_at: string;
}

interface PageProps {
  reservations: Reservation[];
  [key: string]: any;
}

const AdminReservations: React.FC = () => {
  const { reservations = [] } = usePage<PageProps>().props;

  return (
    <AdminLayout currentPage="Reservation List">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#4e2e1e' }}>Reservation Management</h1>
        <p style={{ color: '#6b7280', fontSize: 16 }}>View all customer reservations</p>
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
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Date</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Time</th>
                <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 600, color: '#4e2e1e' }}>Guests</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600, color: '#4e2e1e' }}>Booked At</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? reservations.map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '16px 12px', color: '#374151' }}>{res.name}</td>
                  <td style={{ padding: '16px 12px', color: '#374151' }}>{res.email}</td>
                  <td style={{ padding: '16px 12px', color: '#374151' }}>{res.reservation_date}</td>
                  <td style={{ padding: '16px 12px', color: '#374151' }}>{res.reservation_time}</td>
                  <td style={{ padding: '16px 12px', textAlign: 'center', color: '#374151' }}>{res.guests}</td>
                  <td style={{ padding: '16px 12px', color: '#6b7280', fontSize: 14 }}>
                    {new Date(res.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                    No reservations found
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

export default AdminReservations;
