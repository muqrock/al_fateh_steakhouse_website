import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react'; // at top if not already

type MenuItem = {
  name: string;
  price: number;
  image: string;
  description?: string;
  [key: string]: any;
};

type PageProps = {
  menu: {
    [category: string]: MenuItem[];
  };
};

type MenuItemProps = {
  imageUrl: string;
  name: string;
  price: number;
};

type MenuSectionProps = {
  title: string;
  children: React.ReactNode;
};

const MenuItem = ({ imageUrl, name, price, onClick }: MenuItemProps & { onClick?: () => void }) => (
  <div
    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={`View details for ${name}`}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick && onClick(); }}
  >
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-40 object-cover"
      onError={(e) => {
        e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
      }}
    />
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600 mt-1">RM {Number(price).toFixed(2)}</p>
    </div>
  </div>
);


const MenuSection = ({ title, children }: MenuSectionProps) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-400 pb-2 mb-6 uppercase tracking-wider">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {children}
    </div>
  </section>
);




export default function MenuPage() {
  const { menu = {} } = usePage<PageProps>().props;
  const [selectedMenu, setSelectedMenu] = useState<MenuItem & { category?: string } | null>(null);

  return (
    <div
      className="min-h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2940&auto=format&fit=crop')",
      }}
    >
      <div className="bg-black/60 min-h-screen text-white flex flex-col">
        {/* Navigation */}
        <nav className="flex items-center p-8 bg-black/50 text-xl justify-between">
          <a href="/" className="flex items-center gap-3 mr-8">
            <img
              src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OiPobw0uxKEQ7kNvwFpCej5&_nc_oc=AdnySHY-p4vNJ_WilO7nLkiPgWvv8X1yqA2MWyvPRo3pO_bKHdAalHT6Yxl6kOHL9E8&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=HtED01grQpvthOczf0nTUg&oh=00_AfM4d7K-cw-qeMA6bI1pM1OKfNk9DtFmeUk8FirU59BUGw&oe=68683232"
              alt="Al-Fateh Logo"
              className="h-10 w-10 rounded-lg"
            />
            <span className="text-2xl font-bold uppercase text-white">Al-Fateh</span>
          </a>
          <div className="flex items-center gap-6 text-lg">
            <a href="/" className="no-underline text-white hover:text-orange-300 transition">Home</a>
            <a href="/menu" className="no-underline text-white hover:text-orange-300 transition">Menu</a>
            <a href="/reservation" className="no-underline text-white hover:text-orange-300 transition">Reservation</a>
            <a href="/review" className="no-underline text-white hover:text-orange-300 transition">Review</a>
            <a href="/about" className="no-underline text-white hover:text-orange-300 transition">About</a>
            <a href="/login" title="Login" className="text-white hover:text-orange-300 transition ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9"/>
              </svg>
            </a>
          </div>
        </nav>

        {/* Menu Content */}
        <main className="max-w-7xl mx-auto p-8 my-10 bg-amber-300/90 rounded-xl shadow-2xl relative">
          {Object.entries(menu).length === 0 ? (
            <p className="text-center text-gray-700 font-semibold">No menu items available.</p>
          ) : (
            Object.entries(menu).map(([category, items]) => (
              <MenuSection title={category} key={category}>
                {items.map((item, idx) => (
                  <MenuItem
                    key={idx}
                    imageUrl={item.image}
                    name={item.name}
                    price={item.price}
                    onClick={() => setSelectedMenu({ ...item, category })}
                  />
                ))}
              </MenuSection>
            ))
          )}

          {/* Popup Modal for Menu Details */}
          {selectedMenu && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-4 border-orange-400 relative animate-fade-in">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-orange-500 text-2xl font-bold focus:outline-none"
                  onClick={() => setSelectedMenu(null)}
                  aria-label="Close menu details"
                >
                  &times;
                </button>
                <img
                  src={selectedMenu.image}
                  alt={selectedMenu.name}
                  className="w-full h-56 object-cover rounded-lg mb-4 border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
                  }}
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedMenu.name}</h3>
                <p className="text-lg text-gray-700 mb-2">RM {Number(selectedMenu.price).toFixed(2)}</p>
                {selectedMenu.category && (
                  <p className="text-sm text-orange-600 mb-2 font-semibold uppercase tracking-wider">{selectedMenu.category}</p>
                )}
                {selectedMenu.description && (
                  <p className="text-gray-600 mb-2">{selectedMenu.description}</p>
                )}
                {/* Show all other info if available */}
                {Object.entries(selectedMenu)
                  .filter(([key]) => !['name', 'price', 'image', 'category', 'description', 'id', 'created_at', 'updated_at'].includes(key))
                  .map(([key, value]) => (
                    <p key={key} className="text-gray-500 text-sm"><span className="font-semibold capitalize">{key}:</span> {String(value)}</p>
                  ))}
              </div>
            </div>
          )}

          <Link
            href="/order"
            className="inline-block bg-orange-500 text-white py-4 px-8 text-lg rounded-lg font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-400"
          >
            Order Now!
          </Link>
        </main>

        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
          &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </div>
  );
}
