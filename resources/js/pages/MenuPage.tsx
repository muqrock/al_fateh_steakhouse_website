import React, { ReactNode } from 'react';

type MenuItemProps = {
  imageUrl: string;
  name: string;
};

type MenuSectionProps = {
  title: string;
  children: ReactNode;
};

const MenuItem = ({ imageUrl, name }: MenuItemProps) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
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
      <p className="text-sm text-gray-600 mt-1">RM 15.90</p>
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
  return (
    <div 
      className="min-h-screen bg-cover bg-center font-sans" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504754524776-8f4f37790774?q=80&w=2940&auto=format&fit=crop')" }}
    >
      <div className="bg-black/60 min-h-screen">
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
            {/* Dummy auth for now, replace with real auth logic if needed */}
            <button onClick={() => window.location.href='/login'} title="Login" className="text-white hover:text-orange-300 transition-colors duration-300 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </nav>
        
        {/* Menu Content */}
        <main className="max-w-7xl mx-auto p-8 my-10 bg-amber-300/90 rounded-xl shadow-2xl">
          <MenuSection title="Fried Chicken">
            <MenuItem imageUrl="https://placehold.co/400x300/f87171/white?text=Fried+Chicken+1" name="Classic Fried Chop" />
            <MenuItem imageUrl="https://placehold.co/400x300/f87171/white?text=Fried+Chicken+2" name="Spicy Fried Chop" />
            <MenuItem imageUrl="https://placehold.co/400x300/f87171/white?text=Fried+Chicken+3" name="Cheese Fried Chop" />
          </MenuSection>

          <MenuSection title="Chicken Grill">
            <MenuItem imageUrl="https://placehold.co/400x300/fb923c/white?text=Chicken+Grill+1" name="Black Pepper Grill" />
            <MenuItem imageUrl="https://placehold.co/400x300/fb923c/white?text=Chicken+Grill+2" name="Mushroom Grill" />
            <MenuItem imageUrl="https://placehold.co/400x300/fb923c/white?text=Chicken+Grill+3" name="BBQ Grill" />
          </MenuSection>

          <MenuSection title="Beef Grill">
            <MenuItem imageUrl="https://placehold.co/400x300/4ade80/white?text=Beef+Grill+1" name="Sirloin Steak" />
            <MenuItem imageUrl="https://placehold.co/400x300/4ade80/white?text=Beef+Grill+2" name="Ribeye Steak" />
            <MenuItem imageUrl="https://placehold.co/400x300/4ade80/white?text=Beef+Grill+3" name="T-Bone Steak" />
          </MenuSection>

          <MenuSection title="Lamb Grill">
            <MenuItem imageUrl="https://placehold.co/400x300/38bdf8/white?text=Lamb+Grill+1" name="Classic Lamb Chop" />
            <MenuItem imageUrl="https://placehold.co/400x300/38bdf8/white?text=Lamb+Grill+2" name="Garlic Lamb Chop" />
            <MenuItem imageUrl="https://placehold.co/400x300/38bdf8/white?text=Lamb+Grill+3" name="Mint Lamb Chop" />
          </MenuSection>

          <MenuSection title="Beverages">
            <MenuItem imageUrl="https://placehold.co/400x300/c084fc/white?text=Drink+1" name="Iced Lemon Tea" />
            <MenuItem imageUrl="https://placehold.co/400x300/c084fc/white?text=Drink+2" name="Sirap Bandung" />
            <MenuItem imageUrl="https://placehold.co/400x300/c084fc/white?text=Drink+3" name="Fresh Orange Juice" />
          </MenuSection>

          {/* Updated Order Now Button to match homepage */}
          <div className="text-center mt-12">
            <a 
              href="/order" 
              className="
                inline-block 
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
                no-underline
              "
            >
              Order Now!
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
          &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </div>
  );
}