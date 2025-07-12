import React, { useState, useRef, useEffect } from 'react';
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
  [key: string]: unknown;
}

interface CustomerNavbarProps {
  transparent?: boolean;
  currentPage?: string;
}

const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ transparent = false, currentPage }) => {
  const { auth } = usePage<PageProps>().props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Only show customer users (not admins) in the navbar
  const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.post('/logout', {}, {
      onSuccess: () => router.visit('/')
    });
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
          <div className="relative ml-6" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 transition-colors duration-300 ${textStyle} ${hoverStyle} bg-transparent border-none cursor-pointer`}
            >
              {/* Profile Icon */}
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {auth.user!.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold">{auth.user!.name}</span>
              {/* Dropdown Arrow */}
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    router.visit('/profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={() => {
                    router.visit('/payment-history');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Payment History
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
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
