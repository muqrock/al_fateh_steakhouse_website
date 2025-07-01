import React from 'react';

export default function OrderPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center text-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Order Page
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This is where you'll design your awesome order page!
        </p>
        <a 
          href="/" 
          className="
            mt-8
            inline-block
            bg-orange-500 
            text-white 
            py-3 
            px-6 
            rounded-lg 
            font-bold 
            uppercase 
            tracking-wider 
            transition-transform
            duration-300
            hover:scale-105
            focus:outline-none
            focus:ring-4
            focus:ring-orange-400
            no-underline
          "
        >
          Back to Home
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
        &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </div>
  );
}
