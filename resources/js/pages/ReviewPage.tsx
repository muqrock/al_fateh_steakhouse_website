
import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

type Review = {
  id: number;
  name: string;
  comment: string;
  rating: number;
  image_url: string;
};

interface PageProps {
  reviews: Review[];
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
      {/* Black transparent overlay for readability */}
      <div className="min-h-screen bg-black/70 font-sans">
        {/* Navigation Bar */}
        <nav className="flex items-center p-8 bg-black/50 text-xl justify-between">
          {/* Logo and Brand */}
          <a href="/" className="flex items-center gap-3 mr-8">
            <img src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OiPobw0uxKEQ7kNvwFpCej5&_nc_oc=AdnySHY-p4vNJ_WilO7nLkiPgWvv8X1yqA2MWyvPRo3pO_bKHdAalHT6Yxl6kOHL9E8&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=HtED01grQpvthOczf0nTUg&oh=00_AfM4d7K-cw-qeMA6bI1pM1OKfNk9DtFmeUk8FirU59BUGw&oe=68683232" alt="Al-Fateh Steakhouse Logo" className="h-10 w-10 rounded-lg" />
            <span className="text-2xl font-bold uppercase text-white">Al-Fateh</span>
          </a>
          {/* Nav links right */}
          <div className="flex items-center gap-6 text-lg">
            <a href="/" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Home</a>
            <a href="/menu" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Menu</a>
            <a href="/reservation" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Reservation</a>
            <a href="/review" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Review</a>
            <a href="/about" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">About</a>
            {/* Auth section */}
            {/* Dummy auth for now, replace with real auth logic if needed */}
            <button onClick={() => window.location.href='/login'} title="Login" className="text-white hover:text-orange-300 transition-colors duration-300 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
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

          {/* Past Reviews */}
            {/* Filter by Rating */}
            <div className="flex gap-3 mb-4 items-center">
              <span className="text-white font-medium">Filter by rating:</span>
          {[0, 1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1 rounded ${
              filterRating === star
                ? 'bg-yellow-400 text-black font-bold'
                : 'bg-black/40 text-yellow-400 border border-yellow-400'
              }`}
            >
              {star === 0 ? 'All' : `${star}★`}
            </button>
          ))}
          </div>
          <section className="space-y-6 mb-12 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-black/30">
            {reviews
              .filter((review) => filterRating === 0 || review.rating === filterRating)
              .map((review) => (
                <div key={review.id} className="p-4 flex gap-4 bg-zinc-900/80 rounded-lg shadow border border-yellow-500/30">
                  <img
                    src={review.image_url}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border border-yellow-500/40"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-yellow-300">{review.name}</h3>
                    <div className="text-yellow-400 mb-2">{renderStars(review.rating)}</div>
                    <p className="text-gray-200">{review.comment}</p>
                  </div>
                </div>
              ))}
          </section>

          {/* New Review Form */}
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
                      className={`text-2xl ${
                        data.rating >= star ? 'text-yellow-400' : 'text-gray-500'
                      } hover:scale-110 transition`}
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
