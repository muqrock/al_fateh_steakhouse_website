import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

interface MenuItem {
  name: string;
  price: number;
  image: string;
}

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface PageProps {
  menu: {
    [category: string]: MenuItem[];
  };
  auth: {
    user?: AuthUser;
  };
  [key: string]: any;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function OrderPage() {
  const { menu, auth } = usePage<PageProps>().props;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Check if user is logged in as customer
  const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

  useEffect(() => {
    if (!isCustomerLoggedIn) {
      router.visit('/login');
    }
  }, [isCustomerLoggedIn]);

  // Don't render page content if not a logged-in customer
  if (!isCustomerLoggedIn) {
    return null;
  }

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (name: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.name !== name));
    } else {
      setCart(prev =>
        prev.map(i => (i.name === name ? { ...i, quantity: qty } : i))
      );
    }
  };

  const increment = (name: string) => {
    updateQuantity(name, (cart.find(i => i.name === name)?.quantity || 1) + 1);
  };

  const decrement = (name: string) => {
    updateQuantity(name, (cart.find(i => i.name === name)?.quantity || 1) - 1);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCartGrouped = () => {
    const grouped: { [category: string]: CartItem[] } = {};
    for (const item of cart) {
      const category = Object.entries(menu).find(([_, items]) =>
        items.some(i => i.name === item.name)
      )?.[0] || 'Uncategorized';

      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    }
    return grouped;
  };

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
      currentPage="order" 
      title="Order"
      transparentNav={true}
      fullHeight={true}
      backgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2940&auto=format&fit=crop"
    >
      <div className="flex-1 flex flex-col min-h-screen p-4">
        <div className="max-w-7xl mx-auto py-4 px-4">
          {/* Header with Back Button and Title - Only show when not confirming */}
          {!confirming && (
            <div className="flex items-center mb-4 gap-4">
              {/* Back Button - Left Side */}
              <button
                className="flex items-center gap-1 text-white bg-orange-600 hover:bg-orange-700 font-semibold px-3 py-2 rounded-full transition-colors duration-150 border border-orange-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-fit drop-shadow-lg"
                onClick={() => window.history.back()}
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span className="text-sm">Back</span>
              </button>
              
              {/* Centered Title */}
              <div className="flex-1 text-center mx-4">
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Order Menu</h1>
              </div>
              
              {/* Cart Button - Right Side (Always Visible) */}
              <button
                onClick={() => {
                  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                  if (totalItems === 0) {
                    alert('Your cart is empty. Add some items to your cart first!');
                  } else {
                    const cartElement = document.getElementById('cart-summary');
                    cartElement?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center gap-1 text-white bg-yellow-600 hover:bg-yellow-700 font-semibold px-3 py-2 rounded-lg transition-colors duration-150 border border-yellow-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-fit drop-shadow-lg"
                aria-label="View cart"
              >
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span className="text-xs font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <span className="text-xs">View Cart</span>
              </button>
            </div>
          )}

          {/* Title for Order Summary when confirming */}
          {confirming && (
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Order Summary</h1>
            </div>
          )}

          {/* Search and Filter Controls - Only show when not confirming */}
          {!confirming && (
            <div className="mb-6 bg-black/80 rounded-xl p-4 border border-yellow-400 shadow-lg">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Search Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Search Menu</label>
                  <input
                    type="text"
                    placeholder="Search for dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-black text-white border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
                
                {/* Category Filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Filter by Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-black text-white border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-black">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

        {!confirming ? (
          <>
            {Object.keys(getFilteredMenu()).length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-black/80 rounded-xl p-8 border border-yellow-400 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                  <p className="text-gray-300">Try adjusting your search or filter options.</p>
                </div>
              </div>
            ) : (
              Object.entries(getFilteredMenu()).map(([category, items]) => (
              <section key={category} className="mb-10">
                <h2 className="text-xl font-bold mb-4 border-b pb-2 border-yellow-400 text-white drop-shadow-lg">{category}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => {
                    const inCart = cart.find(ci => ci.name === item.name);
                    return (
                      <div key={idx} className="bg-black/80 backdrop-blur-sm rounded-lg shadow-xl border border-yellow-400 p-4 relative text-white">
                        <img
                          src={item.image}
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
                          }}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <h3 className="font-semibold text-lg text-yellow-400">{item.name}</h3>
                        <p className="text-sm text-gray-300">RM {Number(item.price).toFixed(2)}</p>


                        {inCart ? (
                          <div className="flex items-center justify-between mt-2">
                            <button onClick={() => decrement(item.name)} className="bg-red-500 text-white px-3 py-1 rounded font-bold">-</button>
                            <span className="font-semibold text-lg">{inCart.quantity}</span>
                            <button onClick={() => increment(item.name)} className="bg-green-500 text-white px-3 py-1 rounded font-bold">+</button>
                          </div>
                        ) : (
                          <button
                            className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded transition-colors duration-300"
                            onClick={() => addToCart(item)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
            )}

            {cart.length > 0 && (
              <div id="cart-summary" className="mt-12 bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-400 p-6 shadow-xl text-white">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">🛒 Cart Summary</h2>
                {Object.entries(getCartGrouped()).map(([cat, items]) => (
                  <div key={cat} className="mb-6">
                    <h3 className="text-lg font-semibold border-b border-yellow-400 pb-1 mb-2 text-yellow-300">{cat}</h3>
                    {items.map(item => (
                      <div key={item.name} className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded" />
                          <div>
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-sm text-gray-300">RM {Number(item.price).toFixed(2)}</p>

                          </div>
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => decrement(item.name)} className="px-2 bg-red-500 text-white rounded">-</button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => increment(item.name)} className="px-2 bg-green-500 text-white rounded">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="text-right font-bold text-lg mt-4">
                  Total: RM {total.toFixed(2)}
                </div>

                <div className="text-center mt-6">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-8 rounded-lg font-bold shadow-md transition-colors duration-300"
                    onClick={() => setConfirming(true)}
                  >
                    Confirm Order ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </button>
                </div>

              </div>
            )}
          </>
        ) : (
          <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-400 p-8 shadow-xl max-w-4xl mx-auto text-white">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-600">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <small className="text-gray-300">RM {Number(item.price).toFixed(2)} x</small>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))}
                    className="ml-2 w-16 p-1 border border-yellow-400 rounded bg-black/50 text-white"
                  />
                </div>
                <p className="font-bold text-yellow-400">RM {Number(item.price * item.quantity).toFixed(2)}</p>

              </div>
            ))}

            <div className="mt-6 text-right font-bold text-lg text-yellow-400">
              Total: RM {total.toFixed(2)}
            </div>

            <div className="mt-8 flex justify-between gap-6">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded transition-colors duration-300 font-semibold"
                onClick={() => setConfirming(false)}
              >
                Back
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded transition-colors duration-300"
                onClick={() => alert('Proceed to payment...')}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}
