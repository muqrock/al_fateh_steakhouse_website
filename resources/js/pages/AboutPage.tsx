import React from 'react';
import { router, usePage } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

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

export default function AboutPage() {
  const { auth } = usePage<PageProps>().props;

  return (
    <CustomerLayout 
      currentPage="about"
      transparentNav={true}
      fullHeight={true}
      backgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2940&auto=format&fit=crop"
      title="About Us"
    >
      <div className="flex-1 flex flex-col text-white">
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center p-5">
          <div className="mb-5">
            <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Al-Fateh</h1>
            <h1 className="text-6xl md:text-7xl font-bold m-0 leading-none">Steak House</h1>
          </div>
          <p className="text-2xl mb-10 italic">
            Serving The Best Western Food For Our Lovely Customer
          </p>
          {/* About Content */}
          <div className="bg-black/60 rounded-xl p-8 max-w-2xl w-full mb-8">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="mb-4 text-justify font-serif text-lg leading-relaxed text-yellow-200 drop-shadow-md" style={{ letterSpacing: '0.03em', fontFamily: 'Merriweather, Georgia, serif' }}>
              Al-Fateh Steak House is your local destination for mouthwatering Western-style cuisine, proudly serving the communities of Tanjong Malim and Ulu Bernam. From juicy steaks and fried chicken to creamy pastas and gourmet burgers, every dish is prepared with passion and served in a warm, family-friendly setting. Whether you're dining with loved ones, catching up with friends, or celebrating a special occasion, Al-Fateh offers a cozy atmosphere and flavorful experience that keeps guests coming back for more.
            </p>
          </div>
          {/* Find Us Section */}
          <div className="bg-black/60 rounded-xl p-6 max-w-xl w-full mb-8">
            <h3 className="text-2xl font-semibold mb-2">Find us:</h3>
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
              Al-Fateh Steak House
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
          &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </CustomerLayout>
  );
}
