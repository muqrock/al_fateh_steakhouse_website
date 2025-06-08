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
        <nav className="flex justify-between items-center p-6 bg-black/50 text-white">
            <a href="/" className="text-2xl font-bold uppercase no-underline text-white">Al-Fateh</a>
            <div className="flex items-center gap-6 text-lg">
                <a href="/" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Home</a>
                <a href="/menu" className="no-underline text-orange-400 font-bold">Menu</a>
                <a href="/reservation" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Reservation</a>
                <a href="/review" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Review</a>
                <a href="/about" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">About</a>
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
      </div>
    </div>
  );
}