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
      setReviews([
        ...reviews,
        { name, comment: newReview, rating, imageUrl: randomImage }
      ]);
      setName('');
      setNewReview('');
      setRating(0);
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center font-sans" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909218-31e1c5ff1c1b?q=80&w=2940&auto=format&fit=crop')" }}
    >
      <div className="bg-black/60 min-h-screen text-white">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-6 bg-black/50 text-white">
          <a href="/" className="text-2xl font-bold uppercase no-underline text-white">Al-Fateh</a>
          <div className="flex items-center gap-6 text-lg">
            <a href="/" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Home</a>
            <a href="/menu" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Menu</a>
            <a href="/reservation" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">Reservation</a>
            <a href="/review" className="no-underline text-orange-400 font-bold">Review</a>
            <a href="/about" className="no-underline text-white hover:text-orange-300 transition-colors duration-300">About</a>
          </div>
        </nav>

        {/* Main Section */}
        <main className="max-w-4xl mx-auto p-8 my-10 bg-white/90 rounded-xl text-gray-800 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Customer Reviews</h1>
            <p className="text-lg text-gray-700">Read reviews from our guests and leave your own!</p>
          </div>

          {/* Existing Reviews */}
          <section className="space-y-6 mb-10">
            {reviews.map((review, idx) => (
              <div key={idx} className="p-4 flex gap-4 border border-orange-300 rounded-lg bg-white shadow-md items-start">
                <img src={review.imageUrl} alt={review.name} className="w-14 h-14 rounded-full object-cover border" />
                <div>
                  <h3 className="font-semibold text-lg text-orange-600">{review.name}</h3>
                  <div className="text-yellow-500 mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Input Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Leave a Review</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Star Rating Input */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-gray-700">Your Rating:</label>
              <div className="flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${rating >= star ? 'text-yellow-400' : 'text-gray-400'} hover:scale-110`}
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
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>

            <button
              onClick={handleSubmit}
              className="
                bg-orange-500 
                text-white 
                font-bold 
                py-3 
                px-6 
                rounded-lg 
                uppercase 
                tracking-wide 
                hover:bg-orange-600 
                hover:shadow-lg 
                hover:scale-105 
                transition 
                duration-300
              "
            >
              Enter Review
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
