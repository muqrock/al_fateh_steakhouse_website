import React, { useState } from 'react';

type Review = {
  name: string;
  comment: string;
  rating: number;
  imageUrl: string;
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      name: "Aisyah",
      comment: "Great steak and friendly staff!",
      rating: 5,
      imageUrl: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "John",
      comment: "Atmosphere was perfect, and food delicious.",
      rating: 4,
      imageUrl: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Nurul",
      comment: "Loved the lamb chop! Will come again.",
      rating: 5,
      imageUrl: "https://i.pravatar.cc/150?img=8",
    },
  ]);

  const [name, setName] = useState('');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [filterRating, setFilterRating] = useState(0);

  const handleSubmit = () => {
    if (name.trim() && newReview.trim() && rating > 0) {
      const randomImage = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
      setReviews([...reviews, { name, comment: newReview, rating, imageUrl: randomImage }]);
      setName('');
      setNewReview('');
      setRating(0);
    }
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
        <nav className="flex justify-end items-center gap-10 p-8 bg-black/60 text-xl">
          <a href="/" className="no-underline text-white hover:text-yellow-400 transition">Home</a>
          <a href="/menu" className="no-underline text-white hover:text-yellow-400 transition">Menu</a>
          <a href="/reservation" className="no-underline text-white hover:text-yellow-400 transition">Reservation</a>
          <a href="/review" className="no-underline text-yellow-400 font-bold">Review</a>
          <a href="/about" className="no-underline text-white hover:text-yellow-400 transition">About</a>
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
              .map((review, idx) => (
                <div key={idx} className="p-4 flex gap-4 bg-zinc-900/80 rounded-lg shadow border border-yellow-500/30">
                  <img
                    src={review.imageUrl}
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
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-black text-white border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div>
              <label className="text-lg font-medium text-white">Your Rating:</label>
              <div className="flex gap-2 mt-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-500'
                    } hover:scale-110 transition`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="Write your review here..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full p-3 bg-black text-white border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded uppercase tracking-wide hover:bg-yellow-300 transition duration-300 shadow-lg hover:shadow-yellow-400/50"
            >
              Enter Review
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
