import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { usePage, router } from '@inertiajs/react';

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  created_at: string;
  status?: string;
}

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  created_at: string;
  status?: string;
}

interface PageProps {
  reservations: Reservation[];
  [key: string]: any; // ✅ Needed for Inertia
}


const AdminReservations: React.FC = () => {
  const { reservations = [] } = usePage<PageProps>().props;

  const markAsDone = (id: number) => {
    router.put(`/admin/reservations/${id}`, { status: 'done' });
  };

  const deleteReservation = (id: number) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      router.delete(`/admin/reservations/${id}`);
    }
  };

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
                <th style={{ padding: '16px 12px', textAlign: 'left', color: '#000' }}>Name</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', color: '#000' }}>Email</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', color: '#000' }}>Phone</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', color: '#000' }}>Date</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', color: '#000' }}>Time</th>
                <th style={{ padding: '16px 12px', textAlign: 'center', color: '#000' }}>Guests</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', color: '#000' }}>Booked At</th>
                <th style={{ padding: '16px 12px', textAlign: 'center', color: '#000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? reservations.map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '16px 12px', color: '#000' }}>{res.name}</td>
                    <td style={{ padding: '16px 12px', color: '#000' }}>{res.email}</td>
                    <td style={{ padding: '16px 12px', color: '#000' }}>{res.phone}</td>
                    <td style={{ padding: '16px 12px', color: '#000' }}>{res.reservation_date}</td>
                    <td style={{ padding: '16px 12px', color: '#000' }}>{res.reservation_time}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center', color: '#000' }}>{res.guests}</td>
                    <td style={{ padding: '16px 12px', fontSize: 14, color: '#000' }}>
                    {new Date(res.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                    <button
                      onClick={() => markAsDone(res.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => deleteReservation(res.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
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
