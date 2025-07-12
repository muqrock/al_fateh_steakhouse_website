import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        router.post(
            '/admin/login',
            { password },
            {
                onError: (errors) => {
                    setError(errors.password || 'Login failed');
                },
                onSuccess: () => {
                    window.location.href = '/admin'; // Fixed this line
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
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
            <div className="absolute inset-0 z-0 bg-black/70" />
            <form className="relative z-10 w-full max-w-sm rounded-xl bg-white/95 p-8 shadow-2xl dark:bg-gray-900/90" onSubmit={handleSubmit}>
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">Admin Login</h2>
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700 dark:text-gray-300">Admin Password</label>
                    <input
                        type="password"
                        className="w-full rounded border bg-white px-4 py-2 text-black focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        autoFocus
                    />
                </div>
                {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

                <button
                    type="submit"
                    className="w-full rounded bg-orange-500 py-2 font-bold text-white transition hover:bg-orange-600"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login as Admin'}
                </button>
            </form>
        </div>
    );
}
