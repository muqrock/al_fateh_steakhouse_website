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

  return (
    <CustomerLayout currentPage="order" title="Order">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Minimalist Back Button at the top */}
        <button
          className="mb-6 flex items-center gap-2 text-white bg-orange-600 hover:bg-orange-700 font-semibold px-4 py-2 rounded-full transition-colors duration-150 border border-orange-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-fit drop-shadow-lg"
          onClick={() => window.history.back()}
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="text-base">Back</span>
        </button>
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">Order Menu</h1>

        {!confirming ? (
          <>
            {Object.entries(menu).map(([category, items]) => (
              <section key={category} className="mb-10">
                <h2 className="text-xl font-bold mb-4 border-b pb-2 border-orange-300">{category}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => {
                    const inCart = cart.find(ci => ci.name === item.name);
                    return (
                      <div key={idx} className="bg-white rounded-lg shadow p-4 relative">
                        <img
                          src={item.image}
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
                          }}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">RM {Number(item.price).toFixed(2)}</p>


                        {inCart ? (
                          <div className="flex items-center justify-between mt-2">
                            <button onClick={() => decrement(item.name)} className="bg-red-500 text-white px-3 py-1 rounded font-bold">-</button>
                            <span className="font-semibold text-lg">{inCart.quantity}</span>
                            <button onClick={() => increment(item.name)} className="bg-green-500 text-white px-3 py-1 rounded font-bold">+</button>
                          </div>
                        ) : (
                          <button
                            className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
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
            ))}

            {cart.length > 0 && (
              <div className="mt-12 bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-orange-800 mb-4">🛒 Cart Summary</h2>
                {Object.entries(getCartGrouped()).map(([cat, items]) => (
                  <div key={cat} className="mb-6">
                    <h3 className="text-lg font-semibold border-b border-orange-200 pb-1 mb-2">{cat}</h3>
                    {items.map(item => (
                      <div key={item.name} className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded" />
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">RM {Number(item.price).toFixed(2)}</p>

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
    className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-lg font-bold shadow-md"
    onClick={() => setConfirming(true)}
  >
    Confirm Order ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
  </button>
</div>

              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-orange-800">Order Summary</h2>
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <small className="text-gray-600">RM {Number(item.price).toFixed(2)} x</small>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))}
                    className="ml-2 w-16 p-1 border rounded"
                  />
                </div>
                <p className="font-bold">RM {Number(item.price * item.quantity).toFixed(2)}</p>

              </div>
            ))}

            <div className="mt-6 text-right font-bold text-lg">
              Total: RM {total.toFixed(2)}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded"
                onClick={() => setConfirming(false)}
              >
                Back
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
                onClick={() => alert('Proceed to payment...')}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
          &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </CustomerLayout>
  );
}
