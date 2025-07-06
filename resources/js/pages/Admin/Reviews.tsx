import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface PageProps {
  reviews: Review[];
  [key: string]: any;
}

const AdminReviews: React.FC = () => {
  const { reviews = [] } = usePage<PageProps>().props;

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.max(0, Math.min(5, rating)));
  };

  return (
    <AdminLayout currentPage="Review List">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#4e2e1e' }}>Review Management</h1>
        <p style={{ color: '#6b7280', fontSize: 16 }}>Monitor and manage customer reviews</p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: 12, 
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} style={{
              padding: 20,
              background: '#fafafa',
              borderRadius: 12,
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px 0', color: '#4e2e1e' }}>
                    {review.user_name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{renderStars(review.rating)}</span>
                    <span style={{ fontSize: 14, color: '#6b7280' }}>({review.rating}/5)</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p style={{ 
                color: '#374151', 
                fontSize: 14, 
                lineHeight: 1.6, 
                margin: 0, 
                fontStyle: 'italic' 
              }}>
                "{review.comment}"
              </p>
            </div>
          )) : (
            <div style={{ 
              padding: '60px 20px', 
              textAlign: 'center', 
              color: '#6b7280', 
              fontStyle: 'italic' 
            }}>
              No reviews found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
