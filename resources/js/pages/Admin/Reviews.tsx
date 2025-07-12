import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { usePage, useForm, router } from '@inertiajs/react';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  admin_reply?: string;
  admin?: {
    name: string;
  };
  admin_replied_at?: string;
  user?: {
    name: string;
    email: string;
  };
}

interface PageProps {
  reviews: {
    data: Review[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const AdminReviews: React.FC = () => {
  const { reviews } = usePage<PageProps>().props;
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingReply, setEditingReply] = useState<number | null>(null);
  const { data, setData, post, put, processing, reset, errors } = useForm({
    admin_reply: '',
  });

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.max(0, Math.min(5, rating)));
  };

  const handleReply = (reviewId: number) => {
    if (!data.admin_reply.trim()) return;

    post(`/admin/reviews/${reviewId}/reply`, {
      onSuccess: () => {
        reset();
        setReplyingTo(null);
      },
    });
  };

  const handleEditReply = (reviewId: number) => {
    if (!data.admin_reply.trim()) return;

    put(`/admin/reviews/${reviewId}/reply`, {
      onSuccess: () => {
        reset();
        setEditingReply(null);
      },
    });
  };

  const handleDelete = (reviewId: number) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      router.delete(`/admin/reviews/${reviewId}`);
    }
  };

  const startReply = (reviewId: number) => {
    setReplyingTo(reviewId);
    setEditingReply(null);
    setData('admin_reply', '');
  };

  const startEditReply = (reviewId: number, currentReply: string) => {
    setData('admin_reply', currentReply);
    setEditingReply(reviewId);
    setReplyingTo(null);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    reset();
  };

  const cancelEditReply = () => {
    reset();
    setEditingReply(null);
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
          {reviews.data && reviews.data.length > 0 ? reviews.data.map((review) => (
            <div key={review.id} style={{
              padding: 20,
              background: '#fafafa',
              borderRadius: 12,
              border: '1px solid #f0f0f0'
            }}>
              {/* Review Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px 0', color: '#4e2e1e' }}>
                    {review.user?.name || review.user_name || 'Guest User'}
                  </h3>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                    {review.user?.email ? `Account: ${review.user.email}` : 'Guest Review'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{renderStars(review.rating)}</span>
                    <span style={{ fontSize: 14, color: '#6b7280' }}>({review.rating}/5)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {new Date(review.created_at).toLocaleDateString('en-GB')}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!review.admin_reply && replyingTo !== review.id && editingReply !== review.id && (
                      <button
                        onClick={() => startReply(review.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        Reply
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Review */}
              <p style={{ 
                color: '#374151', 
                fontSize: 14, 
                lineHeight: 1.6, 
                margin: '0 0 16px 0', 
                fontStyle: 'italic' 
              }}>
                "{review.comment}"
              </p>

              {/* Admin Reply Section */}
              {review.admin_reply && editingReply !== review.id && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: 12,
                  borderRadius: 8,
                  borderLeft: '4px solid #3b82f6',
                  marginTop: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>
                      Reply by {review.admin?.name || 'Admin'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>
                        {review.admin_replied_at && new Date(review.admin_replied_at).toLocaleDateString('en-GB')}
                      </span>
                      <button
                        onClick={() => startEditReply(review.id, review.admin_reply!)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>
                    {review.admin_reply}
                  </p>
                </div>
              )}

              {/* Edit Reply Form */}
              {editingReply === review.id && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: 16,
                  borderRadius: 8,
                  marginTop: 12,
                  border: '1px solid #f59e0b'
                }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    Edit your reply:
                  </label>
                  <textarea
                    value={data.admin_reply}
                    onChange={(e) => setData('admin_reply', e.target.value)}
                    placeholder="Edit your reply to this customer review..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      marginBottom: 12
                    }}
                  />
                  {errors.admin_reply && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: 8 }}>
                      {errors.admin_reply}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEditReply(review.id)}
                      disabled={processing || !data.admin_reply.trim()}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: processing || !data.admin_reply.trim() ? '#9ca3af' : '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processing || !data.admin_reply.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {processing ? 'Updating...' : 'Update Reply'}
                    </button>
                    <button
                      onClick={cancelEditReply}
                      disabled={processing}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === review.id && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: 16,
                  borderRadius: 8,
                  marginTop: 12,
                  border: '1px solid #e2e8f0'
                }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    Write your reply:
                  </label>
                  <textarea
                    value={data.admin_reply}
                    onChange={(e) => setData('admin_reply', e.target.value)}
                    placeholder="Type your reply to this customer review..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      marginBottom: 12
                    }}
                  />
                  {errors.admin_reply && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: 8 }}>
                      {errors.admin_reply}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={processing || !data.admin_reply.trim()}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: processing || !data.admin_reply.trim() ? '#9ca3af' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processing || !data.admin_reply.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {processing ? 'Posting...' : 'Post Reply'}
                    </button>
                    <button
                      onClick={cancelReply}
                      disabled={processing}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Reply Form */}
              {editingReply === review.id && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: 16,
                  borderRadius: 8,
                  marginTop: 12,
                  border: '1px solid #e2e8f0'
                }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    Edit your reply:
                  </label>
                  <textarea
                    value={data.admin_reply}
                    onChange={(e) => setData('admin_reply', e.target.value)}
                    placeholder="Edit your reply to this customer review..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      marginBottom: 12
                    }}
                  />
                  {errors.admin_reply && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: 8 }}>
                      {errors.admin_reply}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEditReply(review.id)}
                      disabled={processing || !data.admin_reply.trim()}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: processing || !data.admin_reply.trim() ? '#9ca3af' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processing || !data.admin_reply.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {processing ? 'Updating...' : 'Update Reply'}
                    </button>
                    <button
                      onClick={cancelEditReply}
                      disabled={processing}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
