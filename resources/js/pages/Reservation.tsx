import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Reservation() {
  const [activeTab, setActiveTab] = useState<'table' | 'event'>('table');
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true); // frontend only for now
    // Later backend:
    // post(route('reservation.store'), { onSuccess: () => reset() });
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center font-sans" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504754524776-8f4f37790774?q=80&w=2940&auto=format&fit=crop')" }}
    >
      <Head title="Reservation" />

      {/* NAVBAR */}
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
          <a href="/" className="text-white hover:text-orange-300">Home</a>
          <a href="/menu" className="text-white hover:text-orange-300">Menu</a>
          <a href="/reservation" className="text-white hover:text-orange-300">Reservation</a>
          <a href="/review" className="text-white hover:text-orange-300">Review</a>
          <a href="/about" className="text-white hover:text-orange-300">About</a>
          <button 
            onClick={() => window.location.href='/login'} 
            className="text-white hover:text-orange-300 ml-4"
            title="Login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="bg-black/70 min-h-screen flex justify-center items-center p-4">
        <div className="bg-yellow-400 p-8 rounded-xl shadow-2xl w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-black mb-6 underline">Reservation</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              className={`px-6 py-2 rounded-full font-semibold ${
                activeTab === 'table' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'
              }`}
              onClick={() => setActiveTab('table')}
            >
              Table
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold ${
                activeTab === 'event' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'
              }`}
              onClick={() => setActiveTab('event')}
            >
              Event
            </button>
          </div>

          <hr className="border-black mb-6" />

          {/* Success Message */}
          {submitted && (
            <div className="text-green-700 font-bold mb-4 text-center">
              ✅ Reservation Submitted Successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
            {activeTab === 'table' ? (
              <>
                <select
                  className="p-3 border border-gray-500 rounded"
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
                  className="p-3 border border-gray-500 rounded"
                  required
                />

                <input
                  type="time"
                  value={data.time}
                  onChange={(e) => setData('time', e.target.value)}
                  className="p-3 border border-gray-500 rounded"
                  required
                />

                <button
                  type="submit"
                  className="bg-black text-white font-bold px-6 py-3 rounded hover:bg-gray-900"
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
                  className="p-3 border border-gray-500 rounded"
                  required
                />

                <input
                  type="time"
                  placeholder="Start Time"
                  value={data.event_start}
                  onChange={(e) => setData('event_start', e.target.value)}
                  className="p-3 border border-gray-500 rounded"
                  required
                />

                <input
                  type="time"
                  placeholder="End Time"
                  value={data.event_end}
                  onChange={(e) => setData('event_end', e.target.value)}
                  className="p-3 border border-gray-500 rounded"
                  required
                />

                <button
                  type="submit"
                  className="bg-black text-white font-bold px-6 py-3 rounded hover:bg-gray-900"
                >
                  Book Event
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
