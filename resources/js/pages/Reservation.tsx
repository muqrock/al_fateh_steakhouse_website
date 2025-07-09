import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
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
  const [submitted, setSubmitted] = useState(false);

  const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

  const { data, setData, post, processing, errors, reset } = useForm({
  name: auth?.user?.name || '',
  email: auth?.user?.email || '',
  phone: '',
  reservation_date: '',
  reservation_time: '',
  guests: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCustomerLoggedIn) {
      router.visit('/login');
      return;
    }

    post(route('reservation.store'), {
      onSuccess: () => {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 4000);
      },
    });
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
            <h2 className="text-3xl font-bold text-orange-700 mb-6 underline text-center drop-shadow">
              Table Reservation
            </h2>

            {submitted && (
              <div className="text-green-700 font-bold mb-4 text-center">
                ✅ Reservation Submitted Successfully!
              </div>
            )}

<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <input
    type="tel"
    placeholder="Phone Number"
    value={data.phone}
    onChange={(e) => setData('phone', e.target.value)}
    required
    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 col-span-2"
  />

  <select
    value={data.guests}
    onChange={(e) => setData('guests', parseInt(e.target.value))}
    required
    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
  >
    <option value="">Select Guests</option>
    <option value="1">1 person</option>
    <option value="2">2 people</option>
    <option value="3">3 people</option>
    <option value="4">4 people</option>
    <option value="5">5+ people</option>
  </select>

  <input
    type="date"
    value={data.reservation_date}
    onChange={(e) => setData('reservation_date', e.target.value)}
    required
    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
/>

  <input
    type="time"
    value={data.reservation_time}
    onChange={(e) => setData('reservation_time', e.target.value)}
    required
    className="p-3 border-2 border-orange-400 rounded bg-white text-orange-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
/>

  <button
    type="submit"
    className="bg-orange-500 text-white font-bold px-6 py-3 rounded shadow hover:bg-orange-600 transition col-span-full"
  >
    Reserve Table
  </button>
</form>

          </div>
        </div>

        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm w-full">
          &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </CustomerLayout>
  );
}
