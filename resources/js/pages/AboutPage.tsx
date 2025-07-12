import React from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';

export default function AboutPage() {

  return (
    <CustomerLayout 
      currentPage="about"
      transparentNav={true}
      fullHeight={true}
      backgroundImage="https://scontent.fkul16-2.fna.fbcdn.net/v/t39.30808-6/475998290_1099687531856232_8311037042774031704_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=RFfh8GjjVbYQ7kNvwE2I4fW&_nc_oc=AdnbfcPNr6N-i2q90wXykOJ0-l5EO4WNN3K3ek7LAaumMd93JcK-kzqNeWtCx-I0730&_nc_zt=23&_nc_ht=scontent.fkul16-2.fna&_nc_gid=kFtaQeATBe8NR1eJ4laJpA&oh=00_AfREkte2wUmj1vL4I0151aBT-UqRBqLZoI0Xu0nw_pgP1Q&oe=68751EB2"
      title="About Us"
    >
      <div className="flex-1 flex flex-col min-h-screen p-4">
        <div className="max-w-7xl mx-auto py-4 px-4">
          {/* Header with Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">About Us</h1>
          </div>

          {/* Main Content Container */}
          <div className="bg-gradient-to-br from-orange-50/70 to-amber-50/70 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-6 border border-orange-200/40">
            
            {/* Restaurant Name Section */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-2">Al-Fateh</h2>
              <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">Steak House</h2>
              <p className="text-xl text-orange-700 italic font-medium">
                Serving The Best Western Food For Our Lovely Customer
              </p>
            </div>

            {/* About Content */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-900 mb-4 border-b border-orange-400 pb-2">Our Story</h3>
              <p className="text-orange-800 text-lg leading-relaxed text-justify font-medium" style={{ letterSpacing: '0.03em' }}>
                Al-Fateh Steak House is your local destination for mouthwatering Western-style cuisine, proudly serving the communities of Tanjong Malim and Ulu Bernam. From juicy steaks and fried chicken to creamy pastas and gourmet burgers, every dish is prepared with passion and served in a warm, family-friendly setting. Whether you're dining with loved ones, catching up with friends, or celebrating a special occasion, Al-Fateh offers a cozy atmosphere and flavorful experience that keeps guests coming back for more.
              </p>
            </div>

            {/* Contact Information and Social Media Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Find Us Section */}
              <div className="bg-white/90 rounded-lg p-4 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-900 mb-3">📍 Find Us</h3>
                <div className="space-y-2">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full font-semibold text-center text-sm">
                    Al-Fateh Steak House
                  </div>
                  <p className="text-orange-800 text-center mt-2 text-sm leading-relaxed">
                    25, Jalan Bahtera 1B, Taman Bahtera,<br />
                    35900 Kerling, Selangor
                  </p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-white/90 rounded-lg p-4 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-900 mb-3">📞 Contact Us</h3>
                <div className="space-y-2">
                  <p className="flex flex-col gap-1 text-orange-800">
                    <span className="font-semibold text-sm">Phone:</span>
                    <span className="text-sm">013-4808167</span>
                  </p>
                  <p className="flex flex-col gap-1 text-orange-800">
                    <span className="font-semibold text-sm">Email:</span>
                    <span className="text-sm break-all">alfatehvision379@gmail.com</span>
                  </p>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="bg-white/90 rounded-lg p-4 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-900 mb-3">🌐 Follow Us</h3>
                <div className="flex justify-center items-center gap-4">
                  {/* Facebook */}
                  <a 
                    href="https://www.facebook.com/alfateh.steakhouse.9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-orange-800 font-semibold text-xs group-hover:text-orange-900 transition-colors duration-300">Facebook</span>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a 
                    href="https://www.instagram.com/alfatehsteakhouse/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <span className="text-orange-800 font-semibold text-xs group-hover:text-orange-900 transition-colors duration-300">Instagram</span>
                    </div>
                  </a>
                </div>
                <p className="text-center mt-2 text-orange-700 text-xs">
                  Stay connected with us!
                </p>
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-orange-900 mb-4 border-b border-orange-400 pb-2">Our Location</h3>
              <div className="border-2 border-orange-300 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7963.239736668501!2d101.5315833!3d3.6736806!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cb880405581985%3A0x316cf03690f76bb!2sAl%20Fateh%20Vision%20Steak%20House!5e0!3m2!1sen!2smy!4v1752293175832!5m2!1sen!2smy" 
                  width="100%" 
                  height="400" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Al Fateh Vision Steak House Location"
                ></iframe>
              </div>
              <p className="text-center mt-3 text-sm text-orange-600">
                📍 Interactive map - Click and drag to explore, zoom in/out for details
              </p>
            </div>
          </div>
        </div>
      </div>
        
      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}
