import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: '🏠' },
  { name: 'Menu List', path: '/admin/menu', icon: '🍽️' },
  { name: 'Customer List', path: '/admin/customers', icon: '👥' },
  { name: 'Review List', path: '/admin/reviews', icon: '📝' },
];

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
           {/* <img src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OiPobw0uxKEQ7kNvwFpCej5&_nc_oc=AdnySHY-p4vNJ_WilO7nLkiPgWvv8X1yqA2MWyvPRo3pO_bKHdAalHT6Yxl6kOHL9E8&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=HtED01grQpvthOczf0nTUg&oh=00_AfM4d7K-cw-qeMA6bI1pM1OKfNk9DtFmeUk8FirU59BUGw&oe=68683232" alt="Logo" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 16, marginBottom: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} /> */}
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
                color: active === link.name ? '#f8c471' : '#fff',
                background: active === link.name ? '#3b2012' : 'transparent',
                textDecoration: 'none',
                fontWeight: active === link.name ? 600 : 400,
                fontSize: 16,
                borderLeft: active === link.name ? '4px solid #f8c471' : '4px solid transparent',
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
        <div style={{ textAlign: 'center', fontSize: 12, marginTop: 40, color: '#e0cfc2' }}>
          &copy; {new Date().getFullYear()} Al-Fateh Steakhouse
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 40px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#4e2e1e', marginBottom: 16 }}>Welcome, Admin!</h1>
        <div style={{ fontSize: 18, color: '#6d4c32', marginBottom: 32 }}>
          Here you can manage the restaurant's menu, customers, and reviews.
        </div>
        <div style={{
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: 32,
            minWidth: 260,
            flex: 1,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
            <div style={{ fontWeight: 600, fontSize: 20 }}>Menu Management</div>
            <div style={{ color: '#6d4c32', marginTop: 8 }}>Add, edit, or remove menu items.</div>
          </div>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: 32,
            minWidth: 260,
            flex: 1,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <div style={{ fontWeight: 600, fontSize: 20 }}>Customer Management</div>
            <div style={{ color: '#6d4c32', marginTop: 8 }}>View and manage customer information.</div>
          </div>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: 32,
            minWidth: 260,
            flex: 1,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <div style={{ fontWeight: 600, fontSize: 20 }}>Review Management</div>
            <div style={{ color: '#6d4c32', marginTop: 8 }}>Read and moderate customer reviews.</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
