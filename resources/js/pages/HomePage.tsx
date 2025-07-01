import React from 'react';
import { router } from '@inertiajs/react';

// This component assumes you have Tailwind CSS set up in your project.
// You would typically have a main CSS file where you import Tailwind's base styles:
// @import 'tailwindcss/base';
// @import 'tailwindcss/components';
// @import 'tailwindcss/utilities';

// Accept auth prop from Inertia (Laravel passes this from backend)
// Dummy auth for now (replace with real auth from backend later)
const dummyAuth = {
  user: {
    name: 'Amani', // Set to null or undefined to simulate not logged in
    // name: null,
  },
};

export default function HomePage({ auth = dummyAuth }: { auth?: { user: any } }) {
  // Handler for Order Now button
  const handleOrderNow = () => {
    if (auth && auth.user) {
      router.visit('/reservation');
    } else {
      router.visit('/login');
    }
  };
  // Dummy logout handler
  const handleLogout = () => {
    alert('Logged out! (dummy)');
    // In real app, call logout endpoint and redirect
  };

  return (
    // Main container with background image styling
    // NOTE: The background image URL is still applied via inline style
    // as it's dynamic content. Tailwind is used for all other properties.
    <div
      className="h-screen bg-cover bg-center text-white flex flex-col font-sans"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1554998171-89445e31c52b?q=80&w=2940&auto=format&fit=crop')",
      }}
    >
      {/* Navigation Bar */}
      <nav className="flex items-center p-8 bg-black/50 text-xl justify-between">
        {/* Logo and Brand */}
        <a href="/" className="flex items-center gap-3 mr-8">
          <img src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OiPobw0uxKEQ7kNvwFpCej5&_nc_oc=AdnySHY-p4vNJ_WilO7nLkiPgWvv8X1yqA2MWyvPRo3pO_bKHdAalHT6Yxl6kOHL9E8&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=HtED01grQpvthOczf0nTUg&oh=00_AfM4d7K-cw-qeMA6bI1pM1OKfNk9DtFmeUk8FirU59BUGw&oe=68683232" alt="Al-Fateh Steakhouse Logo" className="h-10 w-10 rounded-lg" />
          <span className="text-2xl font-bold uppercase text-white">Al-Fateh</span>
        </a>
        {/* Nav links right */}
        <div className="flex items-center gap-6 text-lg">
          <a href="/" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Home</a>
          <a href="/menu" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Menu</a>
          <a href="/reservation" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Reservation</a>
          <a href="/review" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Review</a>
          <a href="/about" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">About</a>
          {/* Auth section */}
          {auth && auth.user && auth.user.name ? (
            <>
              <span className="text-white font-semibold ml-4">{auth.user.name}</span>
              {/* Logout icon (simple SVG) */}
              <button onClick={handleLogout} title="Logout" className="text-white hover:text-orange-300 transition-colors duration-300 ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </>
          ) : (
            <button onClick={() => router.visit('/login')} title="Login" className="text-white hover:text-orange-300 transition-colors duration-300 ml-4">
              {/* Login icon (simple SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-5">
        
        {/* Restaurant Name - Split into two lines */}
        <div className="mb-5">
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Al-Fateh</h1>
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Steakhouse</h1>
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
        &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </div>
  );
}
