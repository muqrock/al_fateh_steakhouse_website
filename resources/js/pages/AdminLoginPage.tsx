import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    router.post('/admin/login', { password }, {
      onError: (errors) => {
        setError(errors.password || 'Login failed');
      },
      onSuccess: () => {
        window.location.href = '/admin'; // Fixed this line
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1554998171-89445e31c52b?q=80&w=2940&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Head title="Al-Fateh Steak House | Admin Login" />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 z-0" />
      <form className="relative z-10 bg-white/95 dark:bg-gray-900/90 p-8 rounded-xl shadow-2xl w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Admin Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-black dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}