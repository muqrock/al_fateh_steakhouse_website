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
        backgroundImage: backgroundImage ? `url("${backgroundImage}")` : 'url("/images/steak.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }
    : { 
        minHeight: '100vh',
        backgroundImage: backgroundImage ? `url("${backgroundImage}")` : 'url("/images/steak.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };

  const contentStyle = fullHeight 
    ? { flex: 1, display: 'flex', flexDirection: 'column' as const }
    : { flex: 1 };

  const overlayClass = fullHeight 
    ? 'text-white flex flex-col min-h-screen' 
    : '';

  return (
    <div style={containerStyle} className={overlayClass}>
      <Head title={`Al-Fateh Steak House | ${pageTitle}`} />
      
      {/* Dark overlay for better text readability - covers full scrollable area */}
      <div className="fixed inset-0 bg-black/40 z-0"></div>
      
      {/* Subtle Line Pattern Background for all customer pages - covers full scrollable area */}
      <div className="fixed inset-0 opacity-10 -z-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="lines" patternUnits="userSpaceOnUse" width="40" height="40">
              <path d="M0 40L40 0M-8 8l16-16M32 48l16-16" stroke="currentColor" strokeWidth="1" className="text-orange-600"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      </div>
      
      <CustomerNavbar transparent={transparentNav} currentPage={currentPage} />
      <main style={contentStyle} className={transparentNav ? "relative flex-1 z-10" : "flex-1 z-10"}>
        <div className={transparentNav ? "pt-24 flex-1 flex flex-col" : "flex-1 flex flex-col"}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;
