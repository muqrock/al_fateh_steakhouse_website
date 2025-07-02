import React, { useState } from 'react';

export default function OrderPage() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    item: '',
    quantity: 1,
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order submitted! (Frontend only)');
    // Backend logic will be added later.
  };

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

        {/* Order Form */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-orange-600 uppercase">Place Your Order</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  required
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Menu Item</label>
                <input
                  type="text"
                  name="item"
                  required
                  value={form.item}
                  onChange={handleChange}
                  placeholder="E.g. Classic Lamb Chop"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Special Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition hover:scale-105 shadow-lg shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-orange-400"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black/70 text-white text-center py-4 text-sm">
          &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </div>
  );
}
