import CustomerLayout from '@/layouts/CustomerLayout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Order {
    id: number;
    total_amount: number;
    status: string;
    payment_method?: string;
    items: unknown[];
    notes?: string;
    created_at: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    orders: {
        data: Order[];
        links: unknown[];
        total: number;
        [key: string]: unknown;
    };
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        min_amount?: string;
        max_amount?: string;
        status_filter?: string;
        payment_filter?: string;
        sort_by?: string;
        sort_order?: string;
    };
    auth: {
        user: AuthUser;
    };
    [key: string]: unknown;
}

export default function PaymentHistory() {
    const { orders = { data: [], links: [], total: 0 }, filters = {} } = usePage<PageProps>().props;

    // State for filters
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [minAmount, setMinAmount] = useState(filters.min_amount || '');
    const [maxAmount, setMaxAmount] = useState(filters.max_amount || '');
    const [statusFilter, setStatusFilter] = useState(filters.status_filter || '');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_filter || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

    // Handle filter submission
    const handleFilter = () => {
        router.get('/payment-history', {
            search: searchTerm,
            date_from: dateFrom,
            date_to: dateTo,
            min_amount: minAmount,
            max_amount: maxAmount,
            status_filter: statusFilter,
            payment_filter: paymentFilter,
            sort_by: sortBy,
            sort_order: sortOrder,
        });
    };

    // Handle reset filters
    const handleReset = () => {
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
        setMinAmount('');
        setMaxAmount('');
        setStatusFilter('');
        setPaymentFilter('');
        setSortBy('created_at');
        setSortOrder('desc');
        router.get('/payment-history');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const totalSpent = orders.data.reduce((sum: number, order: Order) => sum + parseFloat(order.total_amount.toString()), 0);

    return (
        <CustomerLayout
            currentPage="payment-history"
            transparentNav={true}
            fullHeight={true}
            backgroundImage="/images/steak.jpg"
            title="Payment History"
        >
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
                <div className="rounded-xl border border-sky-300/50 bg-gradient-to-br from-sky-100/95 to-indigo-200/95 p-8 shadow-2xl backdrop-blur-sm">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-indigo-800">Payment History</h1>
                        <p className="mt-2 text-indigo-700">View your order and payment history</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-lg border border-sky-300 bg-white/95 p-6 shadow-sm">
                            <h3 className="text-sm font-medium text-sky-700">Total Orders</h3>
                            <p className="mt-2 text-2xl font-bold text-indigo-800">{orders.data.length}</p>
                        </div>
                        <div className="rounded-lg border border-sky-300 bg-white/95 p-6 shadow-sm">
                            <h3 className="text-sm font-medium text-sky-700">Total Spent</h3>
                            <p className="mt-2 text-2xl font-bold text-emerald-600">RM {totalSpent.toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg border border-sky-300 bg-white/95 p-6 shadow-sm">
                            <h3 className="text-sm font-medium text-sky-700">Average Order</h3>
                            <p className="mt-2 text-2xl font-bold text-violet-600">
                                RM {orders.data.length > 0 ? (totalSpent / orders.data.length).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="mb-6 rounded-lg border border-sky-300 bg-white/95 p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-indigo-800">Search & Filter Orders</h3>

                        {/* First row - Search and basic filters */}
                        <div className="mb-4 grid gap-4 md:grid-cols-3">
                            {/* Search Input */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">Search Orders</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by item name, payment method, or status..."
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">Filter by Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Payment Method Filter */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">Filter by Payment Method</label>
                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                >
                                    <option value="">All Payment Methods</option>
                                    <option value="cash">Cash</option>
                                    <option value="online_banking">Online Banking</option>
                                    <option value="ewallet">E-Wallet</option>
                                </select>
                            </div>
                        </div>

                        {/* Second row - Date and amount filters */}
                        <div className="mb-4 grid gap-4 md:grid-cols-4">
                            {/* Date From */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">From Date</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">To Date</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                            </div>

                            {/* Min Amount */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">Min Amount (RM)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={minAmount}
                                    onChange={(e) => setMinAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                            </div>

                            {/* Max Amount */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">Max Amount (RM)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={maxAmount}
                                    onChange={(e) => setMaxAmount(e.target.value)}
                                    placeholder="1000.00"
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Third row - Sort options */}
                        <div className="mb-4 grid gap-4 md:grid-cols-2">
                            {/* Sort By */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                >
                                    <option value="created_at">Order Date</option>
                                    <option value="total_amount">Total Amount</option>
                                    <option value="status">Status</option>
                                    <option value="payment_method">Payment Method</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-indigo-700">Sort Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="w-full rounded border border-sky-300 bg-white/90 p-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleFilter}
                                className="rounded bg-indigo-600 px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-indigo-700"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={handleReset}
                                className="rounded bg-sky-500 px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-sky-600"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data.length > 0 ? (
                        <div className="space-y-4">
                            <h2 className="mb-4 text-xl font-bold text-indigo-800">Order History</h2>
                            {orders.data.map((order: Order) => (
                                <div key={order.id} className="rounded-lg border border-sky-300 bg-white/95 p-6 shadow-sm">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-indigo-800">Order #{order.id}</h3>
                                            <p className="text-sm text-slate-600">
                                                {new Date(order.created_at).toLocaleDateString('en-GB')} at{' '}
                                                {new Date(order.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {order.payment_method && (
                                                <p className="text-sm text-blue-600">
                                                    Payment: {order.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-800">
                                                RM {parseFloat(order.total_amount.toString()).toFixed(2)}
                                            </p>
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="mb-2 font-medium text-indigo-700">Items:</h4>
                                            <div className="space-y-2">
                                                {(order.items as { quantity: number; name: string; price: string | number }[]).map(
                                                    (item, index: number) => (
                                                        <div key={index} className="flex items-center justify-between text-sm">
                                                            <span className="text-sky-700">
                                                                {item.quantity}x {item.name}
                                                            </span>
                                                            <span className="text-sky-600">RM {parseFloat(String(item.price)).toFixed(2)}</span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Notes */}
                                    {order.notes && (
                                        <div className="mt-4 border-t border-gray-200 pt-4">
                                            <h4 className="mb-2 font-medium text-indigo-700">Notes:</h4>
                                            <p className="text-sm text-sky-700 italic">{order.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
                            {orders.links && orders.links.length > 3 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {(orders.links as { url: string | null; label: string; active: boolean }[]).map((link, index: number) => {
                                        if (link.url === null) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="cursor-not-allowed px-3 py-2 text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.visit(link.url)}
                                                className={`rounded border px-3 py-2 transition-colors duration-200 ${
                                                    link.active
                                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                                        : 'border-sky-300 bg-white/95 text-indigo-700 hover:bg-sky-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-indigo-800">
                                {searchTerm || sortBy !== 'created_at' ? 'No Orders Found' : 'No Orders Yet'}
                            </h3>
                            <p className="mb-4 text-sky-700">
                                {searchTerm || sortBy !== 'created_at'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : "You haven't placed any orders yet. Start exploring our menu!"}
                            </p>
                            {!searchTerm && sortBy === 'created_at' && (
                                <button
                                    onClick={() => (window.location.href = '/menu')}
                                    className="rounded-lg bg-orange-500 px-6 py-2 font-bold text-white transition duration-300 hover:bg-orange-600"
                                >
                                    Browse Menu
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 mt-auto bg-black/70 py-4 text-center text-sm text-white">
                &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
            </footer>
        </CustomerLayout>
    );
}
