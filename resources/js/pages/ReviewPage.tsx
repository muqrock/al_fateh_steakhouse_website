import CustomerLayout from '@/layouts/CustomerLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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
    updated_at?: string;
    user_id?: number;
};

interface AuthUser {
    id: number;
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

    const { data, setData, post, processing, reset } = useForm({
        comment: '',
        rating: 0,
        image_url: '',
    });
    const [showFallback, setShowFallback] = useState(false);
    const [widgetLoaded, setWidgetLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;
    const [editingReview, setEditingReview] = useState<number | null>(null);
    const [editData, setEditData] = useState({ comment: '', rating: 0 });

    // Check if user is logged in as customer
    const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

    // Pagination logic for customer reviews
    const filteredReviews = reviews.filter((review) => filterRating === 0 || review.rating === filterRating);
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = filteredReviews.slice(startIndex, endIndex);

    // Reset to first page when filter changes
    const handleFilterChange = (rating: number) => {
        setFilterRating(rating);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        // Use setTimeout to ensure DOM has updated with new page content
        setTimeout(() => {
            // Scroll to top of reviews section when page changes
            const reviewsSection = document.querySelector('#customer-reviews-section');
            if (reviewsSection) {
                const headerOffset = 120; // Increased offset for better positioning
                const elementPosition = reviewsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            } else {
                // Fallback: scroll to a reasonable position if section not found
                window.scrollTo({
                    top: 400,
                    behavior: 'smooth',
                });
            }
        }, 100); // Short delay to ensure DOM update
    };

    useEffect(() => {
        // Load Elfsight script for Google Reviews widget
        const script = document.createElement('script');
        script.src = 'https://static.elfsight.com/platform/platform.js';
        script.async = true;
        document.head.appendChild(script);

        // Set up widget detection with multiple checks
        const checkWidgetLoaded = () => {
            const elfsightWidget = document.querySelector('.elfsight-app-074e2495-6a8d-45f6-9718-9e042e15f12a');

            if (elfsightWidget) {
                // Check if widget has actual content (not just the empty div)
                const hasContent =
                    elfsightWidget.children.length > 0 ||
                    elfsightWidget.innerHTML.trim() !== '' ||
                    elfsightWidget.querySelector('iframe') !== null ||
                    elfsightWidget.querySelector('[data-elfsight-app-lazy]') === null; // Widget has been processed

                if (hasContent) {
                    setWidgetLoaded(true);
                    setShowFallback(false);
                    return true;
                }
            }
            return false;
        };

        // Check immediately in case widget loads very fast
        setTimeout(() => checkWidgetLoaded(), 1000);

        // Set up fallback detection after widget load attempt
        const fallbackTimer = setTimeout(() => {
            if (!checkWidgetLoaded()) {
                setShowFallback(true);
            }
        }, 8000); // Increased to 8 seconds to give more time

        // Also check periodically in case widget loads slowly
        const intervalCheck = setInterval(() => {
            if (checkWidgetLoaded()) {
                clearInterval(intervalCheck);
            }
        }, 2000);

        return () => {
            clearTimeout(fallbackTimer);
            clearInterval(intervalCheck);
            // Clean up script on unmount
            const existingScript = document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Only allow customer to submit reviews
        if (!isCustomerLoggedIn) {
            router.visit('/login');
            return;
        }

        // Specific validation with scroll to error
        if (!data.rating) {
            Swal.fire({
                title: 'Rating Required!',
                text: 'Please select a rating (1-5 stars) before submitting your review.',
                icon: 'error',
                showConfirmButton: true,
                confirmButtonColor: '#f97316',
                confirmButtonText: 'OK',
                draggable: true,
                background: '#fff5f5',
                color: '#9a3412',
                customClass: {
                    popup: 'border-2 border-orange-200 shadow-2xl',
                    title: 'text-orange-700 font-bold',
                },
            }).then(() => {
                // Scroll to rating section
                const ratingElement = document.querySelector('[data-field="rating"]');
                if (ratingElement) {
                    ratingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add highlight effect
                    ratingElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500');
                    setTimeout(() => {
                        ratingElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500');
                    }, 3000);
                }
            });
            return;
        }

        if (!data.comment.trim()) {
            Swal.fire({
                title: 'Review Required!',
                text: 'Please write your review before submitting.',
                icon: 'error',
                showConfirmButton: true,
                confirmButtonColor: '#f97316',
                confirmButtonText: 'OK',
                draggable: true,
                background: '#fff5f5',
                color: '#9a3412',
                customClass: {
                    popup: 'border-2 border-orange-200 shadow-2xl',
                    title: 'text-orange-700 font-bold',
                },
            }).then(() => {
                // Scroll to comment section and focus
                const commentElement = document.querySelector('[data-field="comment"]') as HTMLTextAreaElement;
                if (commentElement) {
                    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    commentElement.focus();
                    // Add highlight effect
                    commentElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500');
                    setTimeout(() => {
                        commentElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500');
                    }, 3000);
                }
            });
            return;
        }

        setData('image_url', `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`);
        post('/review', {
            onSuccess: () => {
                reset();
                Swal.fire({
                    title: 'Review submitted successfully!',
                    text: 'Thank you for sharing your experience with us!',
                    icon: 'success',
                    showConfirmButton: true,
                    confirmButtonText: 'Wonderful!',
                    confirmButtonColor: '#f97316',
                    timer: 3000,
                    background: '#fff5f5',
                    color: '#9a3412',
                    customClass: {
                        popup: 'border-2 border-orange-200 shadow-2xl',
                        title: 'text-orange-700 font-bold',
                    },
                });
            },
        });
    };

    const handleEditStart = (review: Review) => {
        setEditingReview(review.id);
        setEditData({
            comment: review.comment,
            rating: review.rating,
        });
    };

    const handleEditCancel = () => {
        setEditingReview(null);
        setEditData({ comment: '', rating: 0 });
    };

    const handleEditSubmit = (reviewId: number) => {
        // Validation: require rating and comment
        if (!editData.rating || !editData.comment.trim()) {
            Swal.fire({
                title: 'Please complete the form!',
                text: 'You must provide a rating and write a review before updating.',
                icon: 'error',
                showConfirmButton: true,
                confirmButtonColor: '#f97316',
                confirmButtonText: 'OK',
                draggable: true,
                background: '#fff5f5',
                color: '#9a3412',
                customClass: {
                    popup: 'border-2 border-orange-200 shadow-2xl',
                    title: 'text-orange-700 font-bold',
                },
            });
            return;
        }

        router.put(
            `/review/${reviewId}`,
            {
                comment: editData.comment,
                rating: editData.rating,
            },
            {
                onSuccess: () => {
                    setEditingReview(null);
                    setEditData({ comment: '', rating: 0 });
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your review has been updated!',
                        text: 'Thank you for keeping your review up to date.',
                        showConfirmButton: true,
                        confirmButtonText: 'Great!',
                        confirmButtonColor: '#f97316',
                        timer: 3000,
                        background: '#fff5f5',
                        color: '#9a3412',
                        customClass: {
                            popup: 'border-2 border-orange-200 shadow-2xl',
                            title: 'text-orange-700 font-bold',
                        },
                    });
                },
                onError: () => {
                    Swal.fire({
                        title: 'Error updating review!',
                        text: 'There was an error updating your review. Please try again.',
                        icon: 'error',
                        showConfirmButton: true,
                        confirmButtonColor: '#f97316',
                        confirmButtonText: 'OK',
                        draggable: true,
                        background: '#fff5f5',
                        color: '#9a3412',
                        customClass: {
                            popup: 'border-2 border-orange-200 shadow-2xl',
                            title: 'text-orange-700 font-bold',
                        },
                    });
                },
            },
        );
    };

    const handleDeleteReview = (reviewId: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#fff5f5',
            color: '#9a3412',
            customClass: {
                popup: 'border-2 border-orange-200 shadow-2xl',
                title: 'text-orange-700 font-bold',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/review/${reviewId}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your review has been successfully deleted.',
                            icon: 'success',
                            showConfirmButton: true,
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#f97316',
                            background: '#fff5f5',
                            color: '#9a3412',
                            customClass: {
                                popup: 'border-2 border-orange-200 shadow-2xl',
                                title: 'text-orange-700 font-bold',
                            },
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'There was an error deleting your review. Please try again.',
                            icon: 'error',
                            showConfirmButton: true,
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#f97316',
                            background: '#fff5f5',
                            color: '#9a3412',
                            customClass: {
                                popup: 'border-2 border-orange-200 shadow-2xl',
                                title: 'text-orange-700 font-bold',
                            },
                        });
                    },
                });
            }
        });
    };

    const canEditReview = (review: Review) => {
        return isCustomerLoggedIn && auth?.user && review.user_id === auth.user.id;
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
            backgroundImage="https://scontent.fpen1-1.fna.fbcdn.net/v/t39.30808-6/476130548_1099553275202991_5856351097499968454_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=7zIdn5NL0P8Q7kNvwF4xaZV&_nc_oc=AdlT-fK5XpJft_S5xh6hcOykjQJwECXrznIYR0hQyG91OMTrPGgnG4Lmx0HjeEeo8XowjrbFkyJKL83cwd4XKZDr&_nc_zt=23&_nc_ht=scontent.fpen1-1.fna&_nc_gid=mWcX3BG_acdFj0kwlEX7yA&oh=00_AfRIDcvITPtc1IUe_bYsJJQWSEwvtMyVX1Tk8j33lDzhXQ&oe=68771A8D"
            title="Reviews"
        >
            <main className="relative z-10 mx-auto my-10 max-w-4xl px-6 py-10">
                {/* Success Toast Popup removed, now handled by SweetAlert2 */}

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-white">Customer Reviews</h1>
                    <p className="mt-2 text-white/90">See what our guests are saying about Al-Fateh Steak House.</p>
                </div>

                {/* Google Reviews Widget*/}
                <section className="mb-12">
                    <div className="mb-6">
                        {/* Elfsight Google Reviews Widget */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                            {/* Elfsight Widget Container */}
                            <div className="elfsight-widget-container">
                                <div className="elfsight-app-074e2495-6a8d-45f6-9718-9e042e15f12a" data-elfsight-app-lazy></div>

                                {/* Loading Message */}
                                {!widgetLoaded && !showFallback && (
                                    <div className="py-8 text-center">
                                        <div className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2">
                                            <svg
                                                className="mr-3 -ml-1 h-5 w-5 animate-spin text-blue-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            <span className="font-medium text-blue-600">Loading Google Reviews...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fallback Message when Elfsight widget fails or expires */}
                            {showFallback && (
                                <div className="py-8 text-center">
                                    <div className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6">
                                        <div className="mb-4 flex items-center justify-center">
                                            <svg className="mr-3 h-8 w-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                />
                                            </svg>
                                            <h4 className="text-xl font-bold text-amber-800">Google Reviews Widget</h4>
                                        </div>
                                        <p className="mb-4 leading-relaxed text-amber-700">
                                            We're currently using a trial version of our Google Reviews widget service. The widget may temporarily be
                                            unavailable due to subscription limitations.
                                        </p>
                                        <div className="mb-4 rounded-lg border border-amber-200 bg-white p-4">
                                            <div className="mb-2 text-lg font-semibold text-green-600">⭐⭐⭐⭐⭐ 4.0 out of 5 stars</div>
                                            <p className="text-sm text-gray-600">Based on our recent Google My Business reviews</p>
                                        </div>
                                        <div className="mb-4 text-sm text-amber-600">
                                            You can still view all our authentic Google reviews and leave your own by clicking the button below.
                                        </div>
                                        <a
                                            href="https://www.google.com/maps/place/Al+Fateh+Vision+Steak+House/@3.6736806,101.5315833,16.85z/data=!4m6!3m5!1s0x31cb880405581985:0x316cf03690f76bb!8m2!3d3.6736743!4d101.5313491!16s%2Fg%2F11c6zxlyjx?entry=ttu&g_ep=EgoyMDI1MDYyMy4yIKXMDSoASAFQAw%3D%3D"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition duration-300 hover:bg-blue-700"
                                        >
                                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            View & Leave Google Reviews
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Customer Reviews from Database */}
                {reviews && reviews.length > 0 && (
                    <section id="customer-reviews-section" className="mb-12">
                        <h2 className="mb-6 text-center text-2xl font-bold text-white">User Reviews</h2>

                        {/* Reviews Count */}
                        <div className="mb-4 text-center">
                            <span className="text-sm text-white/80">
                                Showing {currentReviews.length} of {filteredReviews.length} reviews
                                {filterRating > 0 && ` (${filterRating} star${filterRating > 1 ? 's' : ''})`}
                            </span>
                        </div>

                        {/* Rating Filter */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex items-center gap-2 rounded-lg border-2 border-orange-400 bg-white/90 p-3 shadow">
                                <span className="text-sm font-semibold text-orange-900">Filter by rating:</span>
                                <button
                                    onClick={() => handleFilterChange(0)}
                                    className={`rounded px-3 py-1 text-sm font-bold transition-colors duration-150 ${filterRating === 0 ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}
                                >
                                    All
                                </button>
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => handleFilterChange(rating)}
                                        className={`rounded px-2 py-1 text-sm font-bold transition-colors duration-150 ${filterRating === rating ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}
                                    >
                                        {rating}★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {currentReviews.map((review) => (
                                <div key={review.id} className="rounded-xl border-2 border-orange-400 bg-white/90 p-6 shadow-xl">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={review.image_url || `https://i.pravatar.cc/150?img=${review.id}`}
                                            alt={`${review.name}'s avatar`}
                                            className="h-12 w-12 rounded-full border-2 border-orange-400 shadow"
                                        />
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-orange-800">{review.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        {editingReview === review.id ? (
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <span
                                                                        key={star}
                                                                        onClick={() => setEditData((prev) => ({ ...prev, rating: star }))}
                                                                        className={`cursor-pointer text-lg ${editData.rating >= star ? 'text-orange-500' : 'text-orange-200'} transition hover:scale-110`}
                                                                    >
                                                                        ★
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex">{renderStars(review.rating)}</div>
                                                                <span className="text-sm text-orange-600">({review.rating}/5)</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-xs font-semibold text-orange-500">
                                                        {new Date(review.created_at).toLocaleDateString('en-GB')}
                                                    </span>
                                                    {review.updated_at && review.updated_at !== review.created_at && (
                                                        <span className="text-xs text-orange-400 italic">
                                                            Edited: {new Date(review.updated_at).toLocaleDateString('en-GB')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {editingReview === review.id ? (
                                                <div className="mb-3">
                                                    <textarea
                                                        value={editData.comment}
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, comment: e.target.value }))}
                                                        className="w-full rounded-md border-2 border-orange-200 bg-white px-3 py-2 text-orange-800 shadow-sm focus:border-orange-400 focus:ring-orange-400"
                                                        rows={3}
                                                        placeholder="Edit your review..."
                                                    />
                                                    <div className="mt-2 flex gap-2">
                                                        <button
                                                            onClick={() => handleEditSubmit(review.id)}
                                                            className="rounded-md bg-orange-500 px-4 py-1 text-sm text-white transition-colors hover:bg-orange-600"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleEditCancel}
                                                            className="rounded-md bg-gray-500 px-4 py-1 text-sm text-white transition-colors hover:bg-gray-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            className="rounded-md bg-red-500 px-4 py-1 text-sm text-white transition-colors hover:bg-red-600"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="mb-3 font-medium text-orange-900 italic">"{review.comment}"</p>
                                                    {canEditReview(review) && (
                                                        <button
                                                            onClick={() => handleEditStart(review)}
                                                            className="mb-2 text-sm text-orange-600 transition-colors hover:text-orange-800"
                                                        >
                                                            ✏️ Edit Review
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {/* Admin Reply */}
                                            {review.admin_reply && (
                                                <div className="mt-3 rounded-r-lg border-l-4 border-orange-500 bg-orange-100 p-4">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-orange-800">
                                                            Reply by {review.admin?.name || 'Al-Fateh Steak House'}
                                                        </span>
                                                        {review.admin_replied_at && (
                                                            <span className="text-xs text-orange-600">
                                                                {new Date(review.admin_replied_at).toLocaleDateString('en-GB')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-orange-800">{review.admin_reply}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No reviews message when filter returns empty */}
                        {currentReviews.length === 0 && (
                            <div className="py-8 text-center">
                                <div className="mb-2 text-lg font-semibold text-white">No reviews found</div>
                                <p className="text-sm text-white/70">
                                    {filterRating > 0
                                        ? `No ${filterRating} star reviews available. Try a different rating filter.`
                                        : 'No customer reviews available yet.'}
                                </p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`rounded-lg px-3 py-2 font-medium transition-colors ${
                                            currentPage === 1
                                                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                        }`}
                                    >
                                        ← Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`rounded-lg px-3 py-2 font-medium transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-orange-500 text-white'
                                                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`rounded-lg px-3 py-2 font-medium transition-colors ${
                                            currentPage === totalPages
                                                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                        }`}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Review Form - Only show if customer is logged in */}
                {isCustomerLoggedIn ? (
                    <section className="mb-12 space-y-5 rounded-xl border-2 border-orange-400 bg-gradient-to-br from-orange-50/90 to-amber-50/90 p-8 text-orange-900 shadow-2xl backdrop-blur-sm">
                        <h2 className="mb-2 text-center text-2xl font-bold text-orange-700">Leave a Review</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block font-semibold text-orange-900">Your Name</label>
                                    <input
                                        type="text"
                                        value={auth?.user?.name || ''}
                                        disabled
                                        className="w-full rounded-md border-2 border-orange-200 bg-orange-100/70 px-4 py-3 font-semibold text-orange-700 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-orange-900">Your Email</label>
                                    <input
                                        type="email"
                                        value={auth?.user?.email || ''}
                                        disabled
                                        className="w-full rounded-md border-2 border-orange-200 bg-orange-100/70 px-4 py-3 font-semibold text-orange-700 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div data-field="rating">
                                <label className="mb-1 block font-semibold text-orange-900">Your Rating</label>
                                <div className="mt-1 flex cursor-pointer gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setData('rating', star)}
                                            className={`text-2xl ${data.rating >= star ? 'text-orange-500' : 'text-orange-200'} transition hover:scale-110`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block font-semibold text-orange-900">Your Review</label>
                                <textarea
                                    data-field="comment"
                                    rows={4}
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    className="w-full rounded-md border-2 border-orange-200 bg-white/90 px-4 py-3 text-orange-800 shadow-sm transition-all duration-300 focus:border-orange-400 focus:ring-orange-400"
                                    placeholder="Share your experience..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-orange-500 py-3 font-bold tracking-wider text-white uppercase shadow-md transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </section>
                ) : (
                    <section className="space-y-5 rounded-xl border border-orange-300/60 bg-white/95 p-6 text-center shadow-lg">
                        <h2 className="text-2xl font-bold text-orange-900">Want to Leave a Review?</h2>
                        <p className="text-orange-700">Please log in to share your experience with us.</p>
                        <button
                            onClick={() => router.visit('/login')}
                            className="rounded bg-orange-500 px-8 py-3 font-bold tracking-wide text-white uppercase shadow-lg transition duration-300 hover:bg-orange-600"
                        >
                            Login to Review
                        </button>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 mt-auto bg-black/70 py-4 text-center text-sm text-white">
                &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
            </footer>
        </CustomerLayout>
    );
}
