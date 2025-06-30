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
      imageUrl: "https://i.pravatar.cc/150?img=3"
    },
    {
      name: "John",
      comment: "Atmosphere was perfect, and food delicious.",
      rating: 4,
      imageUrl: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Nurul",
      comment: "Loved the lamb chop! Will come again.",
      rating: 5,
      imageUrl: "https://i.pravatar.cc/150?img=8"
    },
  ]);

  const [name, setName] = useState('');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

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
      <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1562967916-eb82221dfb36?q=80&w=2940&auto=format&fit=crop')`
      }}
    >
      {/* Dark Overlay */}
      <div className="min-h-screen bg-black/80">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-6 bg-black border-b border-yellow-400">
          <a href="/" className="text-2xl font-bold uppercase text-yellow-400">Al-Fateh</a>
          <div className="flex items-center gap-6 text-md font-medium">
            <a href="/" className="text-white hover:text-yellow-400 transition">Home</a>
            <a href="/menu" className="text-white hover:text-yellow-400 transition">Menu</a>
            <a href="/reservation" className="text-white hover:text-yellow-400 transition">Reservation</a>
            <a href="/review" className="text-yellow-400 font-bold">Review</a>
            <a href="/about" className="text-white hover:text-yellow-400 transition">About</a>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto p-8 my-10 bg-zinc-900 rounded-xl shadow-2xl border border-yellow-500/30 text-white">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-yellow-400">Customer Reviews</h1>
            <p className="text-gray-300 mt-2">See what our guests are saying about Al-Fateh Steakhouse.</p>
          </div>

          {/* Reviews */}
          <section className="space-y-6 mb-10">
            {reviews.map((review, idx) => (
              <div key={idx} className="p-4 flex gap-4 bg-zinc-800 rounded-lg shadow border border-yellow-400/30">
                <img src={review.imageUrl} alt={review.name} className="w-14 h-14 rounded-full object-cover border border-yellow-500/40" />
                <div>
                  <h3 className="font-semibold text-lg text-yellow-300">{review.name}</h3>
                  <div className="text-yellow-400 mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Input Form */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-yellow-300">Leave a Review</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-zinc-800 text-white border border-yellow-500/30 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div>
              <label className="text-lg font-medium text-white">Your Rating:</label>
              <div className="flex gap-2 mt-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-600'
                    } hover:scale-110`}
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
              className="w-full p-3 bg-zinc-800 text-white border border-yellow-500/30 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
