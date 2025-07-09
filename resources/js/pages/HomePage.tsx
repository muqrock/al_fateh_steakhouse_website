import React from 'react';
import { router } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

interface PageProps {
  auth: {
    user?: {
      name: string;
      email: string;
      role: string;
    };
  };
  [key: string]: any;
}

export default function HomePage() {
  const handleSeeMenu = () => {
    router.visit('/menu'); // Navigates to the menu page
  };

  return (
    <CustomerLayout 
      currentPage="home" 
      transparentNav={true} 
      fullHeight={true}
      backgroundImage="/images/steak.jpg"
      title="Home"
    >
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-5 relative z-10">
        {/* Restaurant Name */}
        <div className="mb-5">
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Al-Fateh</h1>
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Steak House</h1>
        </div>
        
        {/* Tagline */}
        <p className="text-2xl mb-10 italic">
          Serving The Best Western Food For Our Lovely Customer
        </p>
        
        {/* Menu Button */}
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
          onClick={handleSeeMenu}
        >
          See Our Menu!
        </button>
      </div>
      
      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 text-sm relative z-10">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}
