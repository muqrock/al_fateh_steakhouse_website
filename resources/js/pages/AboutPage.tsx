import React from 'react';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center text-center p-6">
      <div className="w-full max-w-4xl">
        {/* Top Image with overlay */}
        <div className="relative">
          <img 
            src="/path-to-your-top-image.jpg" 
            alt="Steakhouse" 
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4 rounded-lg">
            <h2 className="text-lg mb-2">About Us:</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Al-Fateh Steakhouse</h1>
            <p className="text-md italic">"Serving the best Western food for our lovely customer"</p>
            <p className="mt-4 text-sm md:text-base max-w-2xl">
              Al-Fateh Steakhouse is your local destination for mouthwatering Western-style cuisine,
              proudly serving the communities of Tanjong Malim and Ulu Bernam. From juicy steaks and
              fried chicken to creamy pastas and gourmet burgers, every dish is prepared with passion
              and served in a warm, family-friendly setting. Whether you're dining with loved ones,
              catching up with friends, or celebrating a special occasion, Al-Fateh offers a cozy atmosphere
              and flavorful experience that keeps guests coming back for more.
            </p>
          </div>
        </div>

        {/* Find Us Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Find us:</h3>
          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
            Al-Fateh Steakhouse
          </span>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            25, Jalan Bahtera 1B, Taman Bahtera,<br />
            35900 Kerling, Selangor
          </p>
        </div>

        {/* Map Section */}
        <div className="mt-6">
          <img 
            src="/path-to-your-map-image.jpg" 
            alt="Map location" 
            className="w-full h-80 object-cover border-4 border-blue-400 rounded-lg shadow-md"
          />
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-gray-700 dark:text-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Contact us:</h3>
          <p className="flex items-center justify-center gap-2">
            📞 013-4808167
          </p>
          <p className="flex items-center justify-center gap-2 mt-2">
            📧 alfatehvision379@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
