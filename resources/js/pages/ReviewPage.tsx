import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

type Review = {
  id: number;
  name: string;
  comment: string;
  rating: number;
  image_url: string;
  admin_reply?: string;
  admin?: {
    name: string;
  };
  admin_replied_at?: string;
  created_at: string;
};

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface PageProps {
  reviews: Review[];
  auth: {
    user?: AuthUser;
  };
  [key: string]: unknown;
}

export default function ReviewPage() {
  const { reviews, auth } = usePage<PageProps>().props;
  const [filterRating, setFilterRating] = useState(0);
  const { data, setData, post, processing, reset, errors } = useForm({
    comment: '',
    rating: 0,
    image_url: '',
  });

  // Check if user is logged in as customer
  const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

  // Custom date formatter to match backend d-m-y format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only allow customer to submit reviews
    if (!isCustomerLoggedIn) {
      router.visit('/login');
      return;
    }
    
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
    <CustomerLayout 
      currentPage="review"
      transparentNav={true}
      fullHeight={true}
      backgroundImage="https://i.pinimg.com/1200x/9d/49/0c/9d490ce54b6820bc747e9b00c6bb5d76.jpg"
      title="Reviews"
    >
      <main className="max-w-4xl mx-auto px-6 py-10 bg-black/70 rounded-xl border border-yellow-400 shadow-2xl text-white mt-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-yellow-400">Customer Reviews</h1>
          <p className="text-gray-300 mt-2">See what our guests are saying about Al-Fateh Steak House.</p>
        </div>

        {/* Elfsight Google Reviews Widget */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Google Reviews</h2>
          <div className="elfsight-app-bd736aba-8451-48e9-b16b-8af329482e30" data-elfsight-app-lazy></div>
        </section>

        {/* Customer Reviews from Database */}
        {reviews && reviews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews
                .filter(review => filterRating === 0 || review.rating === filterRating)
                .map((review) => (
                <div key={review.id} className="bg-black/80 rounded-xl border border-yellow-400/30 p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.image_url || `https://i.pravatar.cc/150?img=${review.id}`}
                      alt={`${review.name}'s avatar`}
                      className="w-12 h-12 rounded-full border-2 border-yellow-400"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-yellow-400">{review.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-gray-400 text-sm">({review.rating}/5)</span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3 italic">"{review.comment}"</p>
                      
                      {/* Admin Reply */}
                      {review.admin_reply && (
                        <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-4 mt-3 rounded-r-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-yellow-400 font-semibold text-sm">
                              Reply by {review.admin?.name || 'Al-Fateh Steak House'}
                            </span>
                            {review.admin_replied_at && (
                              <span className="text-gray-400 text-xs">
                                {new Date(review.admin_replied_at).toLocaleDateString('en-GB')}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-200 text-sm">{review.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Rating Filter */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 bg-black/80 rounded-lg p-3 border border-yellow-400/30">
                <span className="text-white text-sm">Filter by rating:</span>
                <button
                  onClick={() => setFilterRating(0)}
                  className={`px-3 py-1 rounded text-sm ${filterRating === 0 ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating)}
                    className={`px-2 py-1 rounded text-sm ${filterRating === rating ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Review Form - Only show if customer is logged in */}
        {isCustomerLoggedIn ? (
          <section className="space-y-5 bg-black/70 rounded-xl border border-yellow-400 shadow-2xl text-white p-6">
            <h2 className="text-2xl font-bold text-yellow-300">Leave a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-black/50 p-3 rounded border border-yellow-400/50">
                <label className="text-sm text-yellow-300">Reviewing as:</label>
                <p className="text-white font-medium">{auth.user?.name}</p>
              </div>
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
                {processing ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </section>
        ) : (
          <section className="space-y-5 bg-black/70 rounded-xl border border-yellow-400 shadow-2xl text-white p-6 text-center">
            <h2 className="text-2xl font-bold text-yellow-300">Want to Leave a Review?</h2>
            <p className="text-gray-300">Please log in to share your experience with us.</p>
            <button
              onClick={() => router.visit('/login')}
              className="bg-yellow-400 text-black font-bold py-3 px-8 rounded uppercase tracking-wide hover:bg-yellow-300 transition duration-300 shadow-lg hover:shadow-yellow-400/50"
            >
              Login to Review
            </button>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}
