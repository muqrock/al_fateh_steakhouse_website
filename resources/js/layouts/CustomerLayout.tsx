import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerNavbar from '@/components/CustomerNavbar';

interface CustomerLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  transparentNav?: boolean;
  fullHeight?: boolean;
  backgroundImage?: string;
  title?: string;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ 
  children, 
  currentPage, 
  transparentNav = false,
  fullHeight = false,
  backgroundImage,
  title 
}) => {
  const pageTitle = title || (currentPage ? `${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}` : 'Home');
  
  const containerStyle = fullHeight 
    ? { 
        minHeight: '100vh',
        backgroundImage: backgroundImage && backgroundImage !== 'none' ? `url('${backgroundImage}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }
    : { 
        minHeight: '100vh',
        backgroundImage: backgroundImage && backgroundImage !== 'none' ? `url('${backgroundImage}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };

  const contentStyle = fullHeight 
    ? { flex: 1, display: 'flex', flexDirection: 'column' as const }
    : { flex: 1 };

  const overlayClass = fullHeight && backgroundImage && backgroundImage !== 'none' 
    ? 'bg-black/60 min-h-screen text-white flex flex-col' 
    : fullHeight 
    ? 'text-white flex flex-col min-h-screen' 
    : '';

  return (
    <div style={containerStyle} className={overlayClass}>
      <Head title={`Al-Fateh Steak House | ${pageTitle}`} />
      <CustomerNavbar transparent={transparentNav} currentPage={currentPage} />
      <main style={contentStyle}>
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
