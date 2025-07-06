import React from 'react';
import { router, usePage } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

interface PageProps {
  auth: {
    user?: {
      name: string;
      email: string;
      role: string;
    };
  };
  [key: string]: any; // Added index signature
}

export default function HomePage() {
  const { auth } = usePage<PageProps>().props;

  // Handler for Order Now button
  const handleOrderNow = () => {
    if (auth?.user && auth.user.role === 'customer') {
      router.visit('/reservation');
    } else {
      router.visit('/login');
    }
  };

  return (
    <CustomerLayout 
      currentPage="home" 
      transparentNav={true} 
      fullHeight={true}
      backgroundImage="https://images.unsplash.com/photo-1554998171-89445e31c52b?q=80&w=2940&auto=format&fit=crop"
      title="Home"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-5">
        {/* Restaurant Name */}
        <div className="mb-5">
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Al-Fateh</h1>
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Steak House</h1>
        </div>
        
        {/* Tagline */}
        <p className="text-2xl mb-10 italic">
          Serving The Best Western Food For Our Lovely Customer
        </p>
        
        {/* Order Button */}
        <button 
          className="
            bg-orange-500 
            text-white 
            border-none 
            py-4 
            px-8 
            cursor-pointer 
            text-lg 
            rounded-lg 
            font-bold 
            uppercase 
            tracking-wider 
            transition-all 
            duration-300 
            ease-in-out 
            hover:scale-105 
            hover:bg-orange-600
            hover:shadow-lg 
            hover:shadow-orange-500/50
            focus:outline-none
            focus:ring-4
            focus:ring-orange-400
          "
          onClick={handleOrderNow}
        >
          Order Now!
        </button>
      </div>
      
      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}