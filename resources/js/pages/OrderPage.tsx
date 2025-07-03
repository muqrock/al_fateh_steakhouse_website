import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

interface MenuItem {
  name: string;
  price: number;
  image: string;
}

interface PageProps {
  menu: {
    [category: string]: MenuItem[];
  };
  [key: string]: any; // Add this index signature
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function OrderPage() {
  const { menu } = usePage<PageProps>().props;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [confirming, setConfirming] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (name: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.name !== name));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.name === name ? { ...i, quantity: qty } : i))
      );
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-amber-100 text-black font-sans">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 text-center">Order Menu</h1>

        {!confirming ? (
          <>
            {Object.entries(menu).map(([category, items]) => (
              <section key={category} className="mb-10">
                <h2 className="text-xl font-bold mb-4 border-b pb-2 border-orange-300">{category}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow p-4">
                      <img
                        src={item.image}
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
                        }}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">RM {Number(item.price).toFixed(2)}
</p>
                      <button
                        className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="text-center mt-12">
              <button
                disabled={cart.length === 0}
                onClick={() => setConfirming(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-lg font-bold shadow-md"
              >
                Confirm Order ({cart.length} items)
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-orange-800">Order Summary</h2>
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <small className="text-gray-600">RM {item.price.toFixed(2)} x</small>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))}
                    className="ml-2 w-16 p-1 border rounded"
                  />
                </div>
                <p className="font-bold">RM {(item.price * item.quantity).toFixed(2)}</p>
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
      </div>
    </div>
  );
}
