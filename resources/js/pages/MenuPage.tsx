import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

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
    className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-sm rounded-lg shadow-xl border border-orange-200/40 p-4 relative transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={`View details for ${name}`}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick && onClick(); }}
  >
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-32 object-cover rounded mb-2"
      onError={(e) => {
        e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
      }}
    />
    <div className="">
      <h3 className="font-semibold text-lg text-orange-900">{name}</h3>
      <p className="text-sm text-orange-700">RM {Number(price).toFixed(2)}</p>
    </div>
  </div>
);

const MenuSection = ({ title, children }: MenuSectionProps) => (
  <section className="mb-10 transition-all duration-300 ease-in-out">
    <h2 className="text-xl font-bold mb-4 border-b pb-2 border-orange-400 text-white drop-shadow-lg">{title}</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </section>
);

export default function MenuPage() {
  const { menu = {} } = usePage<PageProps>().props;
  const [selectedMenu, setSelectedMenu] = useState<MenuItem & { category?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter menu items based on search and category
  const getFilteredMenu = () => {
    let filteredMenu = { ...menu };

    // Filter by category
    if (selectedCategory !== 'All') {
      filteredMenu = { [selectedCategory]: menu[selectedCategory] || [] };
    }

    // Filter by search term
    if (searchTerm) {
      const filtered: { [category: string]: MenuItem[] } = {};
      Object.entries(filteredMenu).forEach(([category, items]) => {
        const filteredItems = items.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredItems.length > 0) {
          filtered[category] = filteredItems;
        }
      });
      return filtered;
    }

    return filteredMenu;
  };

  const categories = ['All', ...Object.keys(menu)];

  return (
    <CustomerLayout 
      currentPage="menu"
      transparentNav={true}
      fullHeight={true}
      backgroundImage="https://scontent.fkul16-2.fna.fbcdn.net/v/t39.30808-6/475973444_1099047458586906_1471199143652275342_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=P9T2Kl0P6BgQ7kNvwHLwGbO&_nc_oc=Adl3ozV0dvI6avP54mmITaSgAHBiDhkbJqp6keeUNQUW_d_rq8Ps_yZT50ftFPvvOHQ&_nc_zt=23&_nc_ht=scontent.fkul16-2.fna&_nc_gid=PA-1Etd0iN12GKHJ6WggEQ&oh=00_AfTmQynrKwXbWYmW-eU-atfOjxH8R8w-he5tpzSpZ8LKYA&oe=6875205C"
      title="Menu"
    >
      <div className="flex-1 flex flex-col min-h-screen p-4">
        <div className="max-w-7xl mx-auto py-4 px-4">
          {/* Header with Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Our Menu</h1>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-6 bg-gradient-to-br from-orange-50/70 to-amber-50/70 backdrop-blur-sm rounded-xl p-4 border border-orange-200/40 shadow-lg">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-orange-800 text-sm font-medium mb-2">Search Menu</label>
                <input
                  type="text"
                  placeholder="Search for dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 bg-white/90 text-orange-800 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-orange-800 text-sm font-medium mb-2">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-white/90 text-orange-800 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        {Object.keys(getFilteredMenu()).length === 0 ? (
          <div className="text-center py-12 min-h-[400px] flex items-center justify-center transition-all duration-300 ease-in-out">
            <div className="bg-gradient-to-br from-orange-50/70 to-amber-50/70 backdrop-blur-sm rounded-xl p-8 border border-orange-200/40 shadow-lg">
              <h3 className="text-xl font-bold text-orange-900 mb-2">No items found</h3>
              <p className="text-orange-700">Try adjusting your search or filter options.</p>
            </div>
          </div>
        ) : (
          <div className="min-h-[600px] transition-all duration-300 ease-in-out">
            {Object.entries(getFilteredMenu()).map(([category, items]) => (
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
            ))}
          </div>
        )}

        {/* Popup Modal for Menu Details */}
        {selectedMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gradient-to-br from-orange-50/95 to-amber-50/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full p-8 border-2 border-orange-300/60 relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-orange-600 hover:text-orange-800 text-2xl font-bold focus:outline-none"
                onClick={() => setSelectedMenu(null)}
                aria-label="Close menu details"
              >
                &times;
              </button>
              <img
                src={selectedMenu.image}
                alt={selectedMenu.name}
                className="w-full h-56 object-cover rounded-lg mb-4 border border-orange-200"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
                }}
              />
              <h3 className="text-2xl font-bold text-orange-900 mb-2">{selectedMenu.name}</h3>
              <p className="text-lg text-orange-800 mb-2">RM {Number(selectedMenu.price).toFixed(2)}</p>
              {selectedMenu.category && (
                <p className="text-sm text-orange-600 mb-2 font-semibold uppercase tracking-wider">{selectedMenu.category}</p>
              )}
              {selectedMenu.description && (
                <p className="text-orange-700 mb-2">{selectedMenu.description}</p>
              )}
              {/* Show all other info if available */}
              {Object.entries(selectedMenu)
                .filter(([key]) => !['name', 'price', 'image', 'category', 'description', 'id', 'created_at', 'updated_at'].includes(key))
                .map(([key, value]) => (
                  <p key={key} className="text-orange-600 text-sm"><span className="font-semibold capitalize text-orange-800">{key}:</span> {String(value)}</p>
                ))}
            </div>
          </div>
        )}

          <Link
            href="/order"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 px-8 text-lg rounded-lg font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-400"
          >
            Order Now!
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}
