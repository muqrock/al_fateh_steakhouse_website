import CustomerLayout from '@/layouts/CustomerLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface MenuItem {
    name: string;
    price: number;
    image: string;
}

interface AuthUser {
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    menu: {
        [category: string]: MenuItem[];
    };
    auth: {
        user?: AuthUser;
    };
    [key: string]: unknown;
}

interface CartItem extends MenuItem {
    quantity: number;
}

export default function OrderPage() {
    const { menu, auth } = usePage<PageProps>().props;
    const [cart, setCart] = useState<CartItem[]>([]);
    const [confirming, setConfirming] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [countdown, setCountdown] = useState(5);

    // Check if user is logged in as customer
    const isCustomerLoggedIn = auth?.user && auth.user.role === 'customer';

    useEffect(() => {
        if (!isCustomerLoggedIn) {
            router.visit('/login');
        }
    }, [isCustomerLoggedIn]);

    // Countdown timer effect for payment success redirect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (paymentSuccess && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        // When countdown reaches 0, redirect to menu page
                        router.visit('/menu');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [paymentSuccess, countdown]);

    // Don't render page content if not a logged-in customer
    if (!isCustomerLoggedIn) {
        return null;
    }

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.name === item.name);
            if (existing) {
                return prev.map((i) => (i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (name: string, qty: number) => {
        if (qty <= 0) {
            setCart((prev) => prev.filter((i) => i.name !== name));
        } else {
            setCart((prev) => prev.map((i) => (i.name === name ? { ...i, quantity: qty } : i)));
        }
    };

    const increment = (name: string) => {
        updateQuantity(name, (cart.find((i) => i.name === name)?.quantity || 1) + 1);
    };

    const decrement = (name: string) => {
        updateQuantity(name, (cart.find((i) => i.name === name)?.quantity || 1) - 1);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        try {
            const response = await fetch('/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    items: cart,
                    total_amount: total,
                    payment_method: paymentMethod,
                    notes: '',
                }),
            });

            const data = await response.json();

            if (data.success) {
                setOrderId(data.order_id);
                setPaymentSuccess(true);
                setCountdown(5); // Reset countdown to 5 seconds
            } else {
                alert('Order failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
        }
    };

    const getCartGrouped = () => {
        const grouped: { [category: string]: CartItem[] } = {};
        for (const item of cart) {
            const category = Object.entries(menu).find(([, items]) => items.some((i) => i.name === item.name))?.[0] || 'Uncategorized';

            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(item);
        }
        return grouped;
    };

    // Filter menu items based on search and category
    const getFilteredMenu = () => {
        let filteredMenu = { ...menu };

        // Filter by category
        if (selectedCategory !== 'All') {
            filteredMenu = { [selectedCategory]: menu[selectedCategory] || [] };
        }

        // Filter by search term
        if (searchTerm) {
            const filtered: { [category: string]: MenuItem[] } = {};
            Object.entries(filteredMenu).forEach(([category, items]) => {
                const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
                if (filteredItems.length > 0) {
                    filtered[category] = filteredItems;
                }
            });
            return filtered;
        }

        return filteredMenu;
    };

    const categories = ['All', ...Object.keys(menu)];

    return (
        <CustomerLayout
            currentPage="order"
            title="Order"
            transparentNav={true}
            fullHeight={true}
            backgroundImage="https://scontent.fpen1-2.fna.fbcdn.net/v/t39.30808-6/475307793_1092407279250924_3575260276737139313_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=LuiNZSW4vxsQ7kNvwHh77b3&_nc_oc=AdndKQdBKyo2BAaHXuq7sHNLhi6oradMEnMAFV1UTaK0JHUOUK1QcTi__ZT6gl1jF1XQpTPfAkwRfS4_lQKiZF-e&_nc_zt=23&_nc_ht=scontent.fpen1-2.fna&_nc_gid=3ihnZd3YwvANt6ZhoV0apw&oh=00_AfRDpXR3yPjwlJW4C_cKxPnsp3Z6H2iDEpLZv_I1BWiSow&oe=68774F7D"
        >
            <div className="flex min-h-screen flex-1 flex-col p-4">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    {/* Header with Back Button and Title - Only show when not confirming */}
                    {!confirming && (
                        <div className="mb-4 flex items-center gap-4">
                            {/* Back Button - Left Side */}
                            <button
                                className="flex w-fit items-center gap-1 rounded-full border border-orange-700 bg-orange-600 px-3 py-2 font-semibold text-white shadow-lg drop-shadow-lg transition-colors duration-150 hover:bg-orange-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                onClick={() => window.history.back()}
                                aria-label="Go back"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                <span className="text-sm">Back</span>
                            </button>

                            {/* Centered Title */}
                            <div className="mx-4 flex-1 text-center">
                                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Order Menu</h1>
                            </div>

                            {/* Cart Button - Right Side (Always Visible) */}
                            <button
                                onClick={() => {
                                    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                                    if (totalItems === 0) {
                                        alert('Your cart is empty. Add some items to your cart first!');
                                    } else {
                                        const cartElement = document.getElementById('cart-summary');
                                        cartElement?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="flex w-fit flex-col items-center gap-1 rounded-lg border border-yellow-700 bg-yellow-600 px-3 py-2 font-semibold text-white shadow-lg drop-shadow-lg transition-colors duration-150 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                aria-label="View cart"
                            >
                                <div className="flex items-center gap-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                        />
                                    </svg>
                                    <span className="text-xs font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                </div>
                                <span className="text-xs">View Cart</span>
                            </button>
                        </div>
                    )}

                    {/* Title for Order Summary when confirming */}
                    {confirming && (
                        <div className="mb-6 text-center">
                            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Order Summary</h1>
                        </div>
                    )}

                    {/* Search and Filter Controls - Only show when not confirming */}
                    {!confirming && (
                        <div className="mb-6 rounded-xl border border-yellow-400 bg-black/80 p-4 shadow-lg">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Search Input */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-white">Search Menu</label>
                                    <input
                                        type="text"
                                        placeholder="Search for dishes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded border border-yellow-400 bg-black p-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-white">Filter by Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full rounded border border-yellow-400 bg-black p-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category} className="bg-black">
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {!confirming ? (
                        <>
                            {Object.keys(getFilteredMenu()).length === 0 ? (
                                <div className="flex min-h-[400px] items-center justify-center py-12 text-center transition-all duration-300 ease-in-out">
                                    <div className="rounded-xl border border-yellow-400 bg-black/80 p-8 shadow-lg">
                                        <h3 className="mb-2 text-xl font-bold text-white">No items found</h3>
                                        <p className="text-gray-300">Try adjusting your search or filter options.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="min-h-[600px] transition-all duration-300 ease-in-out">
                                    {Object.entries(getFilteredMenu()).map(([category, items]) => (
                                        <section key={category} className="mb-10 transition-all duration-300 ease-in-out">
                                            <h2 className="mb-4 border-b border-yellow-400 pb-2 text-xl font-bold text-white drop-shadow-lg">
                                                {category}
                                            </h2>
                                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {items.map((item, idx) => {
                                                    const inCart = cart.find((ci) => ci.name === item.name);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="relative rounded-lg border border-yellow-400 bg-black/80 p-4 text-white shadow-xl backdrop-blur-sm"
                                                        >
                                                            <img
                                                                src={item.image}
                                                                onError={(e) => {
                                                                    e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
                                                                }}
                                                                alt={item.name}
                                                                className="mb-2 h-32 w-full rounded object-cover"
                                                            />
                                                            <h3 className="text-lg font-semibold text-yellow-400">{item.name}</h3>
                                                            <p className="text-sm text-gray-300">RM {Number(item.price).toFixed(2)}</p>

                                                            {inCart ? (
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <button
                                                                        onClick={() => decrement(item.name)}
                                                                        className="rounded bg-red-500 px-3 py-1 font-bold text-white"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-lg font-semibold">{inCart.quantity}</span>
                                                                    <button
                                                                        onClick={() => increment(item.name)}
                                                                        className="rounded bg-green-500 px-3 py-1 font-bold text-white"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    className="mt-3 w-full rounded bg-yellow-500 py-2 font-bold text-black transition-colors duration-300 hover:bg-yellow-600"
                                                                    onClick={() => addToCart(item)}
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}

                            {cart.length > 0 && (
                                <div
                                    id="cart-summary"
                                    className="mt-12 rounded-lg border border-yellow-400 bg-black/80 p-6 text-white shadow-xl backdrop-blur-sm"
                                >
                                    <h2 className="mb-4 text-xl font-bold text-yellow-400">🛒 Cart Summary</h2>
                                    {Object.entries(getCartGrouped()).map(([cat, items]) => (
                                        <div key={cat} className="mb-6">
                                            <h3 className="mb-2 border-b border-yellow-400 pb-1 text-lg font-semibold text-yellow-300">{cat}</h3>
                                            {items.map((item) => (
                                                <div key={item.name} className="mb-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                                                        <div>
                                                            <p className="font-semibold text-white">{item.name}</p>
                                                            <p className="text-sm text-gray-300">RM {Number(item.price).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button onClick={() => decrement(item.name)} className="rounded bg-red-500 px-2 text-white">
                                                            -
                                                        </button>
                                                        <span className="px-3">{item.quantity}</span>
                                                        <button onClick={() => increment(item.name)} className="rounded bg-green-500 px-2 text-white">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    <div className="mt-4 text-right text-lg font-bold">Total: RM {total.toFixed(2)}</div>

                                    <div className="mt-6 text-center">
                                        <button
                                            className="rounded-lg bg-yellow-500 px-8 py-3 font-bold text-black shadow-md transition-colors duration-300 hover:bg-yellow-600"
                                            onClick={() => setConfirming(true)}
                                        >
                                            Confirm Order ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : paymentSuccess ? (
                        // Payment Success Screen
                        <div className="mx-auto max-w-4xl rounded-lg border border-green-400 bg-black/80 p-8 text-center text-white shadow-xl backdrop-blur-sm">
                            <div className="mb-6">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
                                    <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="mb-2 text-3xl font-bold text-green-400">Payment Successful!</h2>
                                <p className="mb-4 text-gray-300">Thank you for your order at Al-Fateh Steak House</p>
                            </div>

                            <div className="mb-6 rounded-lg border border-gray-600 bg-black/50 p-6">
                                <h3 className="mb-4 text-lg font-bold text-yellow-400">Order Receipt</h3>
                                <div className="space-y-2 text-left">
                                    <p>
                                        <span className="text-gray-300">Order ID:</span> <span className="font-mono text-white">#{orderId}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-300">Payment Method:</span>{' '}
                                        <span className="text-white capitalize">{paymentMethod.replace('_', ' ')}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-300">Date:</span>{' '}
                                        <span className="text-white">{new Date().toLocaleDateString('en-GB')}</span>
                                    </p>
                                    <div className="mt-4 border-t border-gray-600 pt-2">
                                        {cart.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-300">
                                                    {item.name} x{item.quantity}
                                                </span>
                                                <span className="text-white">RM {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="mt-2 flex justify-between border-t border-gray-600 pt-2 font-bold">
                                            <span className="text-yellow-400">Total:</span>
                                            <span className="text-yellow-400">RM {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-gray-300">
                                <p className="mb-2">Your order has been confirmed and will be prepared shortly.</p>
                                <p className="flex items-center justify-center gap-2 text-sm">
                                    Redirecting to menu page in
                                    <span className="text-lg font-bold text-yellow-400">{countdown}</span>
                                    second{countdown !== 1 ? 's' : ''}...
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Order Confirmation Screen
                        <div className="mx-auto max-w-4xl rounded-lg border border-yellow-400 bg-black/80 p-8 text-white shadow-xl backdrop-blur-sm">
                            <h3 className="mb-4 text-xl font-bold text-yellow-400">Review Your Order</h3>

                            {cart.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-gray-600 py-2">
                                    <div>
                                        <p className="font-semibold text-white">{item.name}</p>
                                        <small className="text-gray-300">RM {Number(item.price).toFixed(2)} x</small>

                                        <input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))}
                                            className="ml-2 w-16 rounded border border-yellow-400 bg-black/50 p-1 text-white"
                                        />
                                    </div>
                                    <p className="font-bold text-yellow-400">RM {Number(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}

                            <div className="mt-6 text-right text-lg font-bold text-yellow-400">Total: RM {total.toFixed(2)}</div>

                            {/* Payment Method Selection */}
                            <div className="mt-6 border-t border-gray-600 pt-6">
                                <h4 className="mb-4 text-lg font-bold text-white">Select Payment Method</h4>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div
                                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                            paymentMethod === 'cash'
                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                : 'border-gray-600 hover:border-yellow-400/50'
                                        }`}
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <div className="text-center">
                                            <div className="mb-2 text-2xl">💵</div>
                                            <p className="font-semibold">Cash</p>
                                            <p className="text-sm text-gray-300">Pay on delivery</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                            paymentMethod === 'online_banking'
                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                : 'border-gray-600 hover:border-yellow-400/50'
                                        }`}
                                        onClick={() => setPaymentMethod('online_banking')}
                                    >
                                        <div className="text-center">
                                            <div className="mb-2 text-2xl">🏦</div>
                                            <p className="font-semibold">Online Banking</p>
                                            <p className="text-sm text-gray-300">Bank transfer</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                            paymentMethod === 'ewallet'
                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                : 'border-gray-600 hover:border-yellow-400/50'
                                        }`}
                                        onClick={() => setPaymentMethod('ewallet')}
                                    >
                                        <div className="text-center">
                                            <div className="mb-2 text-2xl">📱</div>
                                            <p className="font-semibold">E-Wallet</p>
                                            <p className="text-sm text-gray-300">GrabPay, TouchnGo</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between gap-6">
                                <button
                                    className="rounded bg-gray-600 px-8 py-3 font-semibold text-white transition-colors duration-300 hover:bg-gray-700"
                                    onClick={() => {
                                        setConfirming(false);
                                        setPaymentMethod('');
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    className={`rounded px-8 py-3 font-bold transition-colors duration-300 ${
                                        paymentMethod
                                            ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                                            : 'cursor-not-allowed bg-gray-500 text-gray-300'
                                    }`}
                                    onClick={handlePayment}
                                    disabled={!paymentMethod}
                                >
                                    {paymentMethod ? 'Proceed to Pay' : 'Select Payment Method'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto bg-black/70 py-4 text-center text-sm text-white">
                &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
            </footer>
        </CustomerLayout>
    );
}
