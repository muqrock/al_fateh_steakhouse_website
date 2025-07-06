import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: '🏠' },
  { name: 'Menu List', path: '/admin/menu', icon: '🍽️' },
  { name: 'Customer List', path: '/admin/customers', icon: '👥' },
  { name: 'Review List', path: '/admin/reviews', icon: '📝' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/admin/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
      }
    }).then(() => {
      window.location.href = '/admin/login';
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f8f6f2',
      position: 'relative'
    }}>
      {/* Fixed Sidebar */}
      <aside style={{
        width: 280,
        background: '#4e2e1e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        {/* Logo/Brand */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 40,
          paddingBottom: 20,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            fontWeight: 700, 
            fontSize: 22, 
            letterSpacing: 1,
            color: '#f8c471',
            marginBottom: 8
          }}>
            Al-Fateh Steak House
          </div>
          <div style={{
            fontSize: 14,
            color: '#e0cfc2',
            fontWeight: 500
          }}>
            Admin Panel
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, paddingBottom: 20 }}>
          {sidebarLinks.map(link => (
            <Link
              key={link.name}
              href={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 32px',
                color: (link.name === currentPage) ? '#f8c471' : '#fff',
                background: (link.name === currentPage) ? 'rgba(248, 196, 113, 0.15)' : 'transparent',
                textDecoration: 'none',
                fontWeight: (link.name === currentPage) ? 600 : 400,
                fontSize: 16,
                borderLeft: (link.name === currentPage) ? '4px solid #f8c471' : '4px solid transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                marginBottom: 4,
              }}
              onMouseEnter={(e) => {
                if (link.name !== currentPage) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (link.name !== currentPage) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ marginRight: 16, fontSize: 20 }}>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '0 20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <form onSubmit={handleLogout} style={{ width: '100%' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px 20px',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dc2626';
              }}
            >
              <span>🚪</span>
              Logout
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: 12, 
          marginTop: 16, 
          padding: '0 20px',
          color: '#9ca3af' 
        }}>
          &copy; {new Date().getFullYear()} Al-Fateh Steak House
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: 280, // Account for fixed sidebar width
        padding: '40px',
        minHeight: '100vh',
        overflowX: 'auto'
      }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
