// Moved from AdminDashboard.tsx for correct Inertia page resolution
import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: '🏠' },
  { name: 'Menu List', path: '/admin/menu', icon: '🍽️' },
  { name: 'Customer List', path: '/admin/customers', icon: '👥' },
  { name: 'Review List', path: '/admin/reviews', icon: '📝' },
];

function AdminLogoutButton() {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    fetch('/admin/logout', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
      },
      credentials: 'same-origin',
    }).then(() => {
      window.location.href = '/admin/login';
    });
  };
  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 32px',
        color: '#fff',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        fontSize: 16,
        marginTop: 24,
      }}
    >
      <span style={{ marginRight: 12 }}>🚪</span> Logout
    </button>
  );
}


const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState('Dashboard');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f6f2' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#4e2e1e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {/* <img src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?..." alt="Logo" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 16, marginBottom: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} /> */}
          <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1 }}>
          {sidebarLinks.map(link => (
            <Link
              key={link.name}
              href={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 32px',
                color: (link.name === 'Dashboard') ? '#f8c471' : '#fff',
                background: (link.name === 'Dashboard') ? '#3b2012' : 'transparent',
                textDecoration: 'none',
                fontWeight: (link.name === 'Dashboard') ? 600 : 400,
                fontSize: 16,
                borderLeft: (link.name === 'Dashboard') ? '4px solid #f8c471' : '4px solid transparent',
                transition: 'background 0.2s',
                cursor: 'pointer',
                marginBottom: 4,
              }}
              onClick={() => setActive(link.name)}
            >
              <span style={{ marginRight: 16, fontSize: 20 }}>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>
        {/* Logout button above copyright footer */}
        <form
          onSubmit={e => {
            e.preventDefault();
            fetch('/admin/logout', { method: 'POST', credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' } })
              .then(() => window.location.href = '/admin/login');
          }}
          style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}
        >
          <button
            type="submit"
            className="w-11/12 mb-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition"
            style={{ margin: '0 auto', display: 'block' }}
          >
            Log out
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: 12, marginTop: 8, color: '#e0cfc2' }}>
          &copy; {new Date().getFullYear()} Al-Fateh Steakhouse
        </div>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 40px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#4e2e1e' }}>Welcome to the Admin Dashboard</h1>
        {/* Add dashboard stats or widgets here */}
      </main>
    </div>
  );
};

export default AdminDashboard;
