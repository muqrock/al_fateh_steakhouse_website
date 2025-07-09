import React from 'react';
import { router, usePage } from '@inertiajs/react';

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface PageProps {
  auth: {
    user?: AuthUser;
  };
  [key: string]: any;
}

interface CustomerNavbarProps {
  transparent?: boolean;
  currentPage?: string;
}

const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ transparent = false, currentPage }) => {
  const { auth } = usePage<PageProps>().props;
  
  // Only show customer users (not admins) in the navbar
  const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

  const handleLogout = () => {
    router.post('/logout', {}, {
      onSuccess: () => router.visit('/')
    });
  };

  const handleAuthAction = (requiresAuth: boolean, destination: string) => {
    if (requiresAuth && !isCustomerLoggedIn) {
      router.visit('/login');
    } else {
      router.visit(destination);
    }
  };

  const navStyle = transparent 
    ? 'bg-black/30 absolute top-0 left-0 right-0 z-50' 
    : 'bg-white shadow-md border-b border-gray-200';
  
  const textStyle = transparent 
    ? 'text-white drop-shadow-lg' 
    : 'text-gray-800';
  
  const hoverStyle = transparent 
    ? 'hover:text-orange-300' 
    : 'hover:text-orange-600';

  const activeStyle = 'text-orange-600 font-bold';

  const getNavLinkClass = (page: string) => {
    const baseClass = `no-underline transition-colors duration-300 ${hoverStyle}`;
    if (currentPage === page) {
      return `${baseClass} ${activeStyle}`;
    } else {
      return `${baseClass} ${textStyle}`;
    }
  };

  return (
    <nav 
      className={`flex items-center p-6 text-xl justify-between ${navStyle}`}
    >
      {/* Logo and Brand */}
      <a href="/" className="flex items-center gap-3 mr-8">
        <img 
          src="https://scontent.fpen1-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=0DaNvhQuMAEQ7kNvwE5inQv&_nc_oc=Adkp92SjlzqcXOfKJKea38pRFoTqCOhha4jnxC9zarCmZnGDNW_WLLW3O7fFwAJjeWuhehqzMbVrtBJzhYRzN6Wg&_nc_zt=23&_nc_ht=scontent.fpen1-1.fna&_nc_gid=qcmnciMJEiclAsSYW6dU6g&oh=00_AfSJPEEdn6QxpRMdoUY_vgLBvKEhrEbrUpwy-k3_7qrZjQ&oe=68701B32" 
          alt="Al-Fateh Steak House Logo" 
          className="h-12 w-12 rounded-lg object-cover" 
          onError={(e) => {
            // Fallback to a simple icon if the Facebook image fails to load
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'/%3E%3C/svg%3E";
          }}
        />
        <span className={`text-2xl font-bold uppercase ${textStyle}`}>Al-Fateh Steak House</span>
      </a>
      
      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-lg">
        <a 
          href="/" 
          className={getNavLinkClass('home')}
        >
          Home
        </a>
        <a 
          href="/menu" 
          className={getNavLinkClass('menu')}
        >
          Menu
        </a>
        <a 
          href="/reservation" 
          className={getNavLinkClass('reservation')}
        >
          Reservation
        </a>
        <a
          href="/review"
          className={getNavLinkClass('review')}
        >
          Review
        </a>
        <a 
          href="/about" 
          className={getNavLinkClass('about')}
        >
          About
        </a>
        
        {/* Auth Section */}
        {isCustomerLoggedIn ? (
          <div className="flex items-center ml-6">
            <span className={`font-semibold ${textStyle}`}>
              Welcome, {auth.user!.name}
            </span>
            <button 
              onClick={handleLogout} 
              title="Logout" 
              className={`transition-colors duration-300 ml-4 ${textStyle} ${hoverStyle} bg-transparent border-none cursor-pointer`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => router.visit('/login')} 
            className={`transition-colors duration-300 ml-6 ${textStyle} ${hoverStyle} bg-transparent border-none cursor-pointer text-lg font-medium`}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavbar;
