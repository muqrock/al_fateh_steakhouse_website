import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

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
      <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        <div className="bg-gradient-to-br from-sky-100/95 to-indigo-200/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-sky-300/50">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-indigo-800">Payment History</h1>
            <p className="text-indigo-700 mt-2">View your order and payment history</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/95 p-6 rounded-lg border border-sky-300 shadow-sm">
              <h3 className="text-sm font-medium text-sky-700">Total Orders</h3>
              <p className="text-2xl font-bold text-indigo-800 mt-2">{orders.data.length}</p>
            </div>
            <div className="bg-white/95 p-6 rounded-lg border border-sky-300 shadow-sm">
              <h3 className="text-sm font-medium text-sky-700">Total Spent</h3>
              <p className="text-2xl font-bold text-emerald-600 mt-2">RM {totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white/95 p-6 rounded-lg border border-sky-300 shadow-sm">
              <h3 className="text-sm font-medium text-sky-700">Average Order</h3>
              <p className="text-2xl font-bold text-violet-600 mt-2">
                RM {orders.data.length > 0 ? (totalSpent / orders.data.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/95 rounded-lg border border-sky-300 p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-indigo-800 mb-4">Search & Filter Orders</h3>
            
            {/* First row - Search and basic filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Search Orders
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by item name, payment method, or status..."
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Filter by Payment Method
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                >
                  <option value="">All Payment Methods</option>
                  <option value="cash">Cash</option>
                  <option value="online_banking">Online Banking</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
              </div>
            </div>

            {/* Second row - Date and amount filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                />
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Min Amount (RM)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                />
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Max Amount (RM)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="1000.00"
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                />
              </div>
            </div>

            {/* Third row - Sort options */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
                >
                  <option value="created_at">Order Date</option>
                  <option value="total_amount">Total Amount</option>
                  <option value="status">Status</option>
                  <option value="payment_method">Payment Method</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Sort Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white/90"
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium transition-colors duration-200 shadow-md"
              >
                Apply Filters
              </button>
              <button
                onClick={handleReset}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-medium transition-colors duration-200 shadow-md"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Orders List */}
          {orders.data.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-indigo-800 mb-4">Order History</h2>
              {orders.data.map((order: Order) => (
                <div key={order.id} className="bg-white/95 rounded-lg border border-sky-300 p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-indigo-800">Order #{order.id}</h3>
                      <p className="text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleDateString('en-GB')} at {new Date(order.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {order.payment_method && (
                        <p className="text-sm text-blue-600">
                          Payment: {order.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">RM {parseFloat(order.total_amount.toString()).toFixed(2)}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-indigo-700 mb-2">Items:</h4>
                      <div className="space-y-2">
                        {(order.items as { quantity: number; name: string; price: string | number }[]).map((item, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-sky-700">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-sky-600">RM {parseFloat(String(item.price)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="font-medium text-indigo-700 mb-2">Notes:</h4>
                      <p className="text-sm text-sky-700 italic">{order.notes}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {orders.links && orders.links.length > 3 && (
                <div className="flex justify-center mt-6 gap-2">
                  {(orders.links as { url: string | null; label: string; active: boolean }[]).map((link, index: number) => {
                    if (link.url === null) {
                      return (
                        <span
                          key={index}
                          className="px-3 py-2 text-gray-400 cursor-not-allowed"
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      );
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => link.url && router.visit(link.url)}
                        className={`px-3 py-2 rounded border transition-colors duration-200 ${
                          link.active
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white/95 text-indigo-700 border-sky-300 hover:bg-sky-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-indigo-800 mb-2">
                {searchTerm || sortBy !== 'created_at' ? 'No Orders Found' : 'No Orders Yet'}
              </h3>
              <p className="text-sky-700 mb-4">
                {searchTerm || sortBy !== 'created_at' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'You haven\'t placed any orders yet. Start exploring our menu!'}
              </p>
              {(!searchTerm && sortBy === 'created_at') && (
                <button
                  onClick={() => window.location.href = '/menu'}
                  className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  Browse Menu
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm relative z-10">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}
