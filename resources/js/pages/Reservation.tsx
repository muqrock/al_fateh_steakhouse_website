import React, { useState, ReactNode } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface ReservationData {
  reservation_date: string;
  reservation_time: string;
  guests: number;
  phone: string;
}

interface PageProps {
  auth: {
    user?: AuthUser;
    reservation?: ReservationData;
  };
  [key: string]: any;
}

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-bold text-orange-800 mb-2">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">{children}</div>
  </div>
);

interface InputIconProps {
  children: ReactNode;
}

const InputIcon: React.FC<InputIconProps> = ({ children }) => (
  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
    {children}
  </div>
);

export default function Reservation() {
  const { auth } = usePage<PageProps>().props;
  const [submitted, setSubmitted] = useState(false);
  const userReservation = auth?.reservation;

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
        reset('phone', 'reservation_date', 'reservation_time', 'guests');
        setTimeout(() => setSubmitted(false), 5000);
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
          <div className="bg-gradient-to-br from-orange-50 to-amber-50/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-3xl border border-orange-200/70">

            <h2 className="text-3xl font-bold text-orange-900 mb-6 underline text-center drop-shadow">
              Table Reservation
            </h2>

            {submitted && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">✅ Reservation Submitted Successfully!</p>
                <p>We look forward to seeing you.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name" id="name">
                  <InputIcon>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </InputIcon>
                  <input
                    id="name"
                    type="text"
                    value={data.name}
                    disabled
                    className="block w-full rounded-md border-orange-200 bg-orange-100/70 pl-10 py-3 text-orange-700"
                  />
                </FormField>

                <FormField label="Email Address" id="email">
                  <InputIcon>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  </InputIcon>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    disabled
                    className="block w-full rounded-md border-orange-200 bg-orange-100/70 pl-10 py-3 text-orange-700"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Phone Number" id="phone">
                  <InputIcon>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5h-1.5A11.5 11.5 0 013.5 6.5h-1A1.5 1.5 0 012 5V3.5z" clipRule="evenodd" /></svg>
                  </InputIcon>
                  <input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    required
                    className="block w-full rounded-md border-orange-200 bg-white/90 text-orange-800 pl-10 py-3 focus:border-orange-400 focus:ring-orange-400"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </FormField>

                <FormField label="Number of Guests" id="guests">
                  <InputIcon>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM1.496 18.28a.75.75 0 01-.256-1.453C2.116 16.24 3.349 15.5 5.5 15.5h9c2.152 0 3.384.74 4.26 1.327a.75.75 0 11-.992 1.126C16.992 17.39 16.006 17 14.5 17h-9c-1.506 0-2.492.39-3.26.908a.75.75 0 01-1.244-.328z" /></svg>
                  </InputIcon>
                  <select
                    id="guests"
                    value={data.guests}
                    onChange={(e) => setData('guests', parseInt(e.target.value))}
                    required
                    className="block w-full rounded-md border-orange-200 bg-white/90 text-orange-800 pl-10 py-3 focus:border-orange-400 focus:ring-orange-400"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num === 6 ? '6+ people' : `${num} ${num === 1 ? 'person' : 'people'}`}
                      </option>
                    ))}
                  </select>
                  {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Reservation Date" id="reservation_date">
                  <InputIcon>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                  </InputIcon>
                  <input
                    id="reservation_date"
                    type="date"
                    value={data.reservation_date}
                    onChange={(e) => setData('reservation_date', e.target.value)}
                    required
                    className="block w-full rounded-md border-orange-200 bg-white/90 text-orange-800 pl-10 py-3 focus:border-orange-400 focus:ring-orange-400"
                  />
                  {errors.reservation_date && <p className="text-red-500 text-sm mt-1">{errors.reservation_date}</p>}
                </FormField>

                <FormField label="Reservation Time" id="reservation_time">
                  <InputIcon>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>
                  </InputIcon>
                  <input
                    id="reservation_time"
                    type="time"
                    value={data.reservation_time}
                    onChange={(e) => setData('reservation_time', e.target.value)}
                    required
                    className="block w-full rounded-md border-orange-200 bg-white/90 text-orange-800 pl-10 py-3 focus:border-orange-400 focus:ring-orange-400"
                  />
                  {errors.reservation_time && <p className="text-red-500 text-sm mt-1">{errors.reservation_time}</p>}
                </FormField>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-4 rounded-lg shadow-lg"
              >
                {processing ? 'Reserving...' : 'Reserve Table'}
              </button>
            </form>

            {/* ✅ Reservation Info Table (after the form) */}
            {userReservation && (
              <div className="mt-10 p-6 bg-gradient-to-r from-orange-100 to-amber-100/90 rounded-lg border border-orange-300/70 shadow-md">
                <h3 className="text-xl font-semibold text-orange-900 mb-4 text-center">
                  📋 Your Latest Reservation
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-orange-300">
                    <thead className="bg-orange-200 text-orange-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Time</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Guests</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/90 text-orange-800">
                      <tr className="hover:bg-orange-50">
                        <td className="px-4 py-3">
                          {new Date(userReservation.reservation_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">{userReservation.reservation_time}</td>
                        <td className="px-4 py-3">{userReservation.guests}</td>
                        <td className="px-4 py-3">{userReservation.phone}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm w-full">
          &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </CustomerLayout>
  );
}
