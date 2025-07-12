// Moved from AdminDashboard.tsx for correct Inertia page resolution
import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface Stats {
    total_users: number;
    total_admins: number;
    total_reservations: number;
    total_reviews: number;
    total_menu_items: number;
    today_reservations: number;
    today_reviews: number;
    today_registrations: number;
    monthly_reservations: number;
    monthly_reviews: number;
    monthly_registrations: number;
    average_rating: number;
    estimated_monthly_revenue: number;
    weekly_reservations: number;
    weekly_reviews: number;
    yesterday_reservations: number;
    customer_growth_percentage: number;
    customer_growth_this_month: number;
    customer_growth_last_month: number;
    menu_by_category: { [key: string]: number };
    popular_menu_items: Array<{
        name: string;
        category: string;
        price: number;
        reviews_count: number;
    }>;
    recent_reservations: Array<{
        name: string;
        date: string;
        time: string;
        guests: number;
        created_at: string;
    }>;
    recent_reviews: Array<{
        user_name: string;
        rating: string;
        comment: string;
        created_at: string;
    }>;
}

interface PageProps {
    stats: Stats;
    [key: string]: unknown;
}

const AdminDashboard: React.FC = () => {
    const { stats } = usePage<PageProps>().props;

    return (
        <AdminLayout currentPage="Dashboard">
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, color: '#4e2e1e' }}>Restaurant Dashboard</h1>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
                <div
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: 24,
                        borderRadius: 12,
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 24, marginRight: 12 }}>👥</span>
                        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Total Customers</h3>
                    </div>
                    <p style={{ fontSize: 36, fontWeight: 700, margin: '8px 0' }}>{stats.total_users}</p>
                    <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>+{stats.today_registrations} registered today</p>
                </div>

                <div
                    style={{
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        padding: 24,
                        borderRadius: 12,
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 24, marginRight: 12 }}>📅</span>
                        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Total Reservations</h3>
                    </div>
                    <p style={{ fontSize: 36, fontWeight: 700, margin: '8px 0' }}>{stats.total_reservations}</p>
                    <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>+{stats.today_reservations} booked today</p>
                </div>

                <div
                    style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        padding: 24,
                        borderRadius: 12,
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 24, marginRight: 12 }}>🍽️</span>
                        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Menu Items</h3>
                    </div>
                    <p style={{ fontSize: 36, fontWeight: 700, margin: '8px 0' }}>{stats.total_menu_items}</p>
                    <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>Active dishes available</p>
                </div>

                <div
                    style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        padding: 24,
                        borderRadius: 12,
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 24, marginRight: 12 }}>⭐</span>
                        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Average Rating</h3>
                    </div>
                    <p style={{ fontSize: 36, fontWeight: 700, margin: '8px 0' }}>{stats.average_rating}/5</p>
                    <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>From {stats.total_reviews} customer reviews</p>
                </div>
            </div>

            {/* Monthly Statistics */}
            <div
                style={{
                    background: 'white',
                    padding: 32,
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    marginBottom: 32,
                    border: '1px solid #f0f0f0',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                    <span style={{ fontSize: 24, marginRight: 12 }}>📊</span>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#4e2e1e', margin: 0 }}>This Month's Performance</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
                    <div style={{ textAlign: 'center', padding: 16, background: '#fef7e6', borderRadius: 12 }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: '#d97706', margin: '0 0 8px 0' }}>{stats.monthly_reservations}</p>
                        <p style={{ fontSize: 14, color: '#92400e', fontWeight: 500, margin: 0 }}>Reservations This Month</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 16, background: '#f0f9ff', borderRadius: 12 }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: '#0284c7', margin: '0 0 8px 0' }}>{stats.monthly_reviews}</p>
                        <p style={{ fontSize: 14, color: '#0369a1', fontWeight: 500, margin: 0 }}>Reviews This Month</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: '#16a34a', margin: '0 0 8px 0' }}>{stats.monthly_registrations}</p>
                        <p style={{ fontSize: 14, color: '#15803d', fontWeight: 500, margin: 0 }}>New Customers</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 16, background: '#fdf2f8', borderRadius: 12 }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: '#dc2626', margin: '0 0 8px 0' }}>RM{stats.estimated_monthly_revenue}</p>
                        <p style={{ fontSize: 14, color: '#b91c1c', fontWeight: 500, margin: 0 }}>Estimated Revenue</p>
                    </div>
                </div>
            </div>

            {/* Weekly Performance & Growth Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                {/* Weekly Performance */}
                <div
                    style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 16,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 20, marginRight: 10 }}>📈</span>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4e2e1e', margin: 0 }}>Weekly Performance</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ textAlign: 'center', padding: 16, background: '#f0f9ff', borderRadius: 12 }}>
                            <p style={{ fontSize: 24, fontWeight: 700, color: '#0284c7', margin: '0 0 4px 0' }}>{stats.weekly_reservations}</p>
                            <p style={{ fontSize: 12, color: '#0369a1', fontWeight: 500, margin: 0 }}>Reservations This Week</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
                            <p style={{ fontSize: 24, fontWeight: 700, color: '#16a34a', margin: '0 0 4px 0' }}>{stats.weekly_reviews}</p>
                            <p style={{ fontSize: 12, color: '#15803d', fontWeight: 500, margin: 0 }}>Reviews This Week</p>
                        </div>
                    </div>
                    <div style={{ marginTop: 16, textAlign: 'center', padding: 16, background: '#fef7e6', borderRadius: 12 }}>
                        <p style={{ fontSize: 20, fontWeight: 700, color: '#d97706', margin: '0 0 4px 0' }}>{stats.yesterday_reservations}</p>
                        <p style={{ fontSize: 12, color: '#92400e', fontWeight: 500, margin: 0 }}>Reservations Yesterday</p>
                    </div>
                </div>

                {/* Customer Growth */}
                <div
                    style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 16,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 20, marginRight: 10 }}>📊</span>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4e2e1e', margin: 0 }}>Customer Growth</h2>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <p
                            style={{
                                fontSize: 32,
                                fontWeight: 700,
                                color: stats.customer_growth_percentage >= 0 ? '#16a34a' : '#dc2626',
                                margin: '0 0 8px 0',
                            }}
                        >
                            {stats.customer_growth_percentage >= 0 ? '+' : ''}
                            {stats.customer_growth_percentage}%
                        </p>
                        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Growth vs Last Month</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ textAlign: 'center', padding: 12, background: '#f0f9ff', borderRadius: 8 }}>
                            <p style={{ fontSize: 18, fontWeight: 600, color: '#0284c7', margin: '0 0 4px 0' }}>{stats.customer_growth_this_month}</p>
                            <p style={{ fontSize: 11, color: '#0369a1', margin: 0 }}>This Month</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                            <p style={{ fontSize: 18, fontWeight: 600, color: '#6b7280', margin: '0 0 4px 0' }}>{stats.customer_growth_last_month}</p>
                            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Last Month</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Category Distribution */}
            {Object.keys(stats.menu_by_category).length > 0 && (
                <div
                    style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 16,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        marginBottom: 32,
                        border: '1px solid #f0f0f0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 20, marginRight: 10 }}>🍴</span>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4e2e1e', margin: 0 }}>Menu Categories</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                        {Object.entries(stats.menu_by_category).map(([category, count]) => (
                            <div
                                key={category}
                                style={{
                                    textAlign: 'center',
                                    padding: 16,
                                    background: '#fafafa',
                                    borderRadius: 12,
                                    border: '1px solid #f0f0f0',
                                }}
                            >
                                <p style={{ fontSize: 20, fontWeight: 700, color: '#dc2626', margin: '0 0 4px 0' }}>{count}</p>
                                <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, margin: 0, textTransform: 'capitalize' }}>{category}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {/* Popular Menu Items */}
                <div
                    style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 16,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 20, marginRight: 10 }}>🏆</span>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4e2e1e', margin: 0 }}>Popular Menu Items</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {stats.popular_menu_items.length > 0 ? (
                            stats.popular_menu_items.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 16,
                                        background: '#fafafa',
                                        borderRadius: 12,
                                        border: '1px solid #f0f0f0',
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 4px 0', color: '#4e2e1e' }}>{item.name}</p>
                                        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{item.category}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px 0', color: '#dc2626' }}>RM{item.price}</p>
                                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{item.reviews_count} reviews</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>No menu items with reviews yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Reservations */}
                <div
                    style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 16,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 20, marginRight: 10 }}>📋</span>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4e2e1e', margin: 0 }}>Recent Reservations</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {stats.recent_reservations.length > 0 ? (
                            stats.recent_reservations.map((reservation, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: 16,
                                        background: '#fafafa',
                                        borderRadius: 12,
                                        border: '1px solid #f0f0f0',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 4px 0', color: '#4e2e1e' }}>{reservation.name}</p>
                                            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{reservation.guests} guests</p>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: 12, color: '#6b7280' }}>
                                            <p style={{ margin: '0 0 2px 0' }}>
                                                {reservation.date} at {reservation.time}
                                            </p>
                                            <p style={{ margin: 0 }}>Booked {reservation.created_at}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>No reservations yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Reviews */}
            <div
                style={{
                    background: 'white',
                    padding: 24,
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    marginTop: 32,
                    border: '1px solid #f0f0f0',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                    <span style={{ fontSize: 20, marginRight: 10 }}>💬</span>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4e2e1e', margin: 0 }}>Recent Customer Reviews</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {stats.recent_reviews.length > 0 ? (
                        stats.recent_reviews.map((review, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: 20,
                                    background: '#fafafa',
                                    borderRadius: 12,
                                    border: '1px solid #f0f0f0',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 4px 0', color: '#4e2e1e' }}>{review.user_name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ color: '#fbbf24', marginRight: 8 }}>{'⭐'.repeat(parseInt(review.rating) || 0)}</span>
                                            <span style={{ fontSize: 14, color: '#6b7280' }}>({review.rating}/5)</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: 12, color: '#6b7280' }}>
                                        <p style={{ margin: 0 }}>{review.created_at}</p>
                                    </div>
                                </div>
                                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{review.comment}"</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>No reviews yet</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
