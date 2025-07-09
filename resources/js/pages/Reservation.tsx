import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
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

export default function Reservation() {
  const { auth } = usePage<PageProps>().props;
  const [activeTab, setActiveTab] = useState<'table' | 'event'>('table');
  const [submitted, setSubmitted] = useState(false);

  // Check if user is logged in as customer
  const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

  // Remove the automatic redirect - allow viewing without login

  const { data, setData, post, processing, errors, reset } = useForm({
    people: '',
    date: '',
    time: '',
    event_start: '',
    event_end: '',
    event_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in as customer before submitting
    if (!isCustomerLoggedIn) {
      router.visit('/login');
      return;
    }
    
    setSubmitted(true); // frontend only for now
    // Later backend:
    // post(route('reservation.store'), { onSuccess: () => reset() });
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <CustomerLayout 
      currentPage="reservation"
      transparentNav={true}
      fullHeight={true}
      backgroundImage="https://i.pinimg.com/1200x/9d/49/0c/9d490ce54b6820bc747e9b00c6bb5d76.jpg"
      title="Reservation"
    >
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex flex-1 justify-center items-center p-4">
          <div className="bg-white/90 dark:bg-gray-900/90 p-8 rounded-xl shadow-2xl w-full max-w-3xl border-4 border-orange-500">
            <h2 className="text-3xl font-bold text-orange-700 mb-6 underline text-center drop-shadow">Reservation</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 justify-center">
              <button
                className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 shadow ${
                  activeTab === 'table'
                    ? 'bg-orange-500 text-white scale-105'
                    : 'bg-gray-200 text-orange-900 hover:bg-orange-100'
                }`}
                onClick={() => setActiveTab('table')}
              >
                Table
              </button>
              <button
                className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 shadow ${
                  activeTab === 'event'
                    ? 'bg-orange-500 text-white scale-105'
                    : 'bg-gray-200 text-orange-900 hover:bg-orange-100'
                }`}
                onClick={() => setActiveTab('event')}
              >
                Event
              </button>
            </div>

            <hr className="border-orange-400 mb-6" />

            {/* Success Message */}
            {submitted && (
              <div className="text-green-700 font-bold mb-4 text-center">
                ✅ Reservation Submitted Successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activeTab === 'table' ? (
                <>
                  <select
                    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    value={data.people}
                    onChange={(e) => setData('people', e.target.value)}
                    required
                  >
                    <option value="">Select People</option>
                    <option>1 person</option>
                    <option>2 people</option>
                    <option>3 people</option>
                    <option>4 people</option>
                    <option>5+ people</option>
                  </select>

                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) => setData('date', e.target.value)}
                    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    required
                  />

                  <input
                    type="time"
                    value={data.time}
                    onChange={(e) => setData('time', e.target.value)}
                    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    required
                  />

                  <button
                    type="submit"
                    className="bg-orange-500 text-white font-bold px-6 py-3 rounded shadow hover:bg-orange-600 transition"
                  >
                    Find a Table
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="date"
                    value={data.event_date}
                    onChange={(e) => setData('event_date', e.target.value)}
                    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    required
                  />

                  <input
                    type="time"
                    placeholder="Start Time"
                    value={data.event_start}
                    onChange={(e) => setData('event_start', e.target.value)}
                    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    required
                  />

                  <input
                    type="time"
                    placeholder="End Time"
                    value={data.event_end}
                    onChange={(e) => setData('event_end', e.target.value)}
                    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    required
                  />

                  <button
                    type="submit"
                    className="bg-orange-500 text-white font-bold px-6 py-3 rounded shadow hover:bg-orange-600 transition"
                  >
                    Book Event
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
        {/* Footer */}
        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm w-full">
          &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </CustomerLayout>
  );
}
