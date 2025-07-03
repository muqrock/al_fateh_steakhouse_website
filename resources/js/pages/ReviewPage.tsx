import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

type Review = {
  id: number;
  name: string;
  comment: string;
  rating: number;
  image_url: string;
};

interface PageProps {
  reviews: Review[];
  [key: string]: unknown;
}

export default function ReviewPage() {
  const { reviews } = usePage<PageProps>().props;
  const [filterRating, setFilterRating] = useState(0);
  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    comment: '',
    rating: 0,
    image_url: '',
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData('image_url', `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`);
    post('/review', {
      onSuccess: () => reset(),
    });
  };

  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-500'}>
        ★
      </span>
    ));

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/9d/49/0c/9d490ce54b6820bc747e9b00c6bb5d76.jpg')",
      }}
    >
      <div className="min-h-screen bg-black/70 font-sans">
        {/* Navigation */}
        <nav className="flex items-center p-8 bg-black/50 text-xl justify-between">
          <a href="/" className="flex items-center gap-3 mr-8">
            <img src="/images/logo.png" alt="Al-Fateh Steakhouse Logo" className="h-10 w-10 rounded-lg" />
            <span className="text-2xl font-bold uppercase text-white">Al-Fateh</span>
          </a>
          <div className="flex items-center gap-6 text-lg">
            <a href="/" className="no-underline text-white hover:text-orange-300">Home</a>
            <a href="/menu" className="no-underline text-white hover:text-orange-300">Menu</a>
            <a href="/reservation" className="no-underline text-white hover:text-orange-300">Reservation</a>
            <a href="/review" className="no-underline text-white hover:text-orange-300">Review</a>
            <a href="/about" className="no-underline text-white hover:text-orange-300">About</a>
            <button onClick={() => router.visit('/login')} title="Login" className="text-white hover:text-orange-300 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Review Section */}
        <main className="max-w-4xl mx-auto px-6 py-10 bg-black/70 rounded-xl border border-yellow-400 shadow-2xl text-white mt-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-yellow-400">Customer Reviews</h1>
            <p className="text-gray-300 mt-2">See what our guests are saying about Al-Fateh Steakhouse.</p>
          </div>

          {/* Elfsight Google Reviews Widget */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Google Reviews</h2>
            <div className="elfsight-app-bd736aba-8451-48e9-b16b-8af329482e30" data-elfsight-app-lazy></div>
          </section>

          {/* Optional: Local Review Form */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-yellow-300">Leave a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Your name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className="w-full p-3 bg-black text-white border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <div>
                <label className="text-lg font-medium text-white">Your Rating:</label>
                <div className="flex gap-2 mt-1 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setData('rating', star)}
                      className={`text-2xl ${data.rating >= star ? 'text-yellow-400' : 'text-gray-500'} hover:scale-110 transition`}
                      style={{ cursor: 'pointer' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <textarea
                rows={4}
                placeholder="Write your review here..."
                value={data.comment}
                onChange={e => setData('comment', e.target.value)}
                className="w-full p-3 bg-black text-white border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              {errors && (
                <div className="text-red-400 text-sm">
                  {Object.values(errors).map((err, i) => (
                    <div key={i}>{err}</div>
                  ))}
                </div>
              )}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded uppercase tracking-wide hover:bg-yellow-300 transition duration-300 shadow-lg hover:shadow-yellow-400/50"
              >
                Enter Review
              </button>
            </form>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
          &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </div>
  );
}
