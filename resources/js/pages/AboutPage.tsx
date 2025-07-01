import React from 'react';
import { router } from '@inertiajs/react';

// Dummy auth for now (replace with real auth from backend later)
const dummyAuth = {
  user: {
    name: 'Amani', // Set to null or undefined to simulate not logged in
    // name: null,
  },
};

export default function AboutPage({ auth = dummyAuth }: { auth?: { user: { name: string | null } } }) {
  // Dummy logout handler
  const handleLogout = () => {
    alert('Logged out! (dummy)');
    // In real app, call logout endpoint and redirect
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-white" style={{ backgroundColor: '#7c4a03' }}>
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
        <div className="mb-5">
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Al-Fateh</h1>
          <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Steakhouse</h1>
        </div>
        <p className="text-2xl mb-10 italic">
          Serving The Best Western Food For Our Lovely Customer
        </p>
        {/* About Content */}
        <div className="bg-black/60 rounded-xl p-8 max-w-2xl w-full mb-8">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="mb-4 text-justify font-serif text-lg leading-relaxed text-yellow-200 drop-shadow-md" style={{ letterSpacing: '0.03em', fontFamily: 'Merriweather, Georgia, serif' }}>
            Al-Fateh Steakhouse is your local destination for mouthwatering Western-style cuisine, proudly serving the communities of Tanjong Malim and Ulu Bernam. From juicy steaks and fried chicken to creamy pastas and gourmet burgers, every dish is prepared with passion and served in a warm, family-friendly setting. Whether you're dining with loved ones, catching up with friends, or celebrating a special occasion, Al-Fateh offers a cozy atmosphere and flavorful experience that keeps guests coming back for more.
          </p>
        </div>
        {/* Find Us Section */}
        <div className="bg-black/60 rounded-xl p-6 max-w-xl w-full mb-8">
          <h3 className="text-2xl font-semibold mb-2">Find us:</h3>
          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
            Al-Fateh Steakhouse
          </span>
          <p className="mt-4">
            25, Jalan Bahtera 1B, Taman Bahtera,<br />
            35900 Kerling, Selangor
          </p>
        </div>
        {/* Map Section */}
        <div className="mb-8 w-full max-w-3xl mx-auto">
          <a
            href="https://www.google.com/maps/place/Al+Fateh+Vision+Steak+House/@3.6736806,101.5315833,16.85z/data=!4m6!3m5!1s0x31cb880405581985:0x316cf03690f76bb!8m2!3d3.6736743!4d101.5313491!16s%2Fg%2F11c6zxlyjx?entry=ttu&g_ep=EgoyMDI1MDYyMy4yIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-80 border-4 border-blue-400 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 relative"
          >
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=3.6736743,101.5313491&zoom=16&size=600x320&markers=color:red%7C3.6736743,101.5313491&key=YOUR_GOOGLE_MAPS_API_KEY"
              alt="Map location"
              className="w-full h-80 object-cover"
              style={{ filter: 'brightness(0.95) contrast(1.1)', background: '#eee' }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200 z-20">
              <span className="text-white text-lg font-semibold bg-blue-600 bg-opacity-80 px-4 py-2 rounded-full">Open in Google Maps</span>
            </div>
          </a>
        </div>
        {/* Contact Section */}
        <div className="bg-black/60 rounded-xl p-6 max-w-xl w-full mb-8">
          <h3 className="text-2xl font-semibold mb-4">Contact us:</h3>
          <p className="flex items-center justify-center gap-2">
            📞 013-4808167
          </p>
          <p className="flex items-center justify-center gap-2 mt-2">
            📧 alfatehvision379@gmail.com
          </p>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
        &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </div>
  );
}
