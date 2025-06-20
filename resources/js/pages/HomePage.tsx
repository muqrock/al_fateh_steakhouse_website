import React from 'react';

// This component assumes you have Tailwind CSS set up in your project.
// You would typically have a main CSS file where you import Tailwind's base styles:
// @import 'tailwindcss/base';
// @import 'tailwindcss/components';
// @import 'tailwindcss/utilities';

export default function HomePage() {
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
      <nav className="flex justify-center items-center gap-10 p-8 bg-black/50 text-xl">
  <a href="/" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Home</a>
  <a href="/menu" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Menu</a>
  <a href="/reservation" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Reservation</a>
  <a href="/review" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Review</a>
  <a href="/about" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">About</a> {/* Correct Link */}
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
          The best in Tanjong Malim
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
        >
          Order Now!
        </button>
      </div>
    </div>
  );
}
