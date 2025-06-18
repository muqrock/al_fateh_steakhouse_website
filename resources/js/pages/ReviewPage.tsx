import React, { useState } from 'react';

type Review = {
  name: string;
  comment: string;
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([
    { name: "Aisyah", comment: "Great steak and friendly staff!" },
    { name: "John", comment: "Atmosphere was perfect, and food delicious." },
    { name: "Nurul", comment: "Loved the lamb chop! Will come again." },
  ]);
  
  const [newReview, setNewReview] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (newReview.trim() && name.trim()) {
      setReviews([...reviews, { name, comment: newReview }]);
      setNewReview('');
      setName('');
    }
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

        {/* Content Section */}
        <main className="max-w-4xl mx-auto p-8 my-10 bg-white/90 rounded-xl text-gray-800 shadow-xl">
          {/* Description */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-center">Customer Reviews</h1>
            <p className="text-lg text-center text-gray-700">
              Read what our happy guests have said about Al-Fateh Steakhouse, and share your experience with us!
            </p>
          </div>

          {/* Existing Reviews */}
          <section className="space-y-6 mb-10">
            {reviews.map((review, idx) => (
              <div key={idx} className="p-4 border border-orange-300 rounded-lg bg-white shadow-md">
                <h3 className="font-semibold text-lg text-orange-600">{review.name}</h3>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </section>

          {/* Review Input */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Leave a Review</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
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
