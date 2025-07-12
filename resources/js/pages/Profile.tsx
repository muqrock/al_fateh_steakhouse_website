import CustomerLayout from '@/layouts/CustomerLayout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface PageProps {
    auth: {
        user: AuthUser;
    };
    [key: string]: unknown;
}

export default function Profile() {
    const { auth } = usePage<PageProps>().props;
    const { data, setData, put, processing, errors, reset } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile', {
            onSuccess: () => {
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    return (
        <CustomerLayout currentPage="profile" transparentNav={true} fullHeight={true} backgroundImage="/images/steak.jpg" title="Profile">
            <div className="relative z-10 mx-auto max-w-2xl px-6 py-10">
                <div className="rounded-xl border border-stone-300/60 bg-gradient-to-br from-stone-200/95 to-amber-100/95 p-8 shadow-2xl backdrop-blur-sm">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="text-3xl font-extrabold text-stone-800">My Profile</h1>
                        <p className="mt-2 text-stone-700">Manage your account information</p>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-stone-700">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-stone-300 bg-white/90 p-3 text-stone-800 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-stone-700">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border border-stone-300 bg-white/90 p-3 text-stone-800 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="border-t border-stone-400 pt-6">
                            <h3 className="mb-4 text-lg font-semibold text-stone-800">Change Password</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-stone-700">New Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-lg border border-stone-300 bg-white/90 p-3 text-stone-800 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                        placeholder="Leave blank to keep current password"
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-stone-700">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-lg border border-stone-300 bg-white/90 p-3 text-stone-800 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                                        placeholder="Confirm your new password"
                                    />
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-lg bg-orange-500 px-6 py-3 font-bold tracking-wide text-white uppercase shadow-lg transition duration-300 hover:bg-orange-600 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Profile'}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="rounded-lg border border-stone-400 px-6 py-3 font-bold text-stone-700 transition duration-300 hover:bg-stone-300/50"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    {/* Account Info */}
                    <div className="mt-8 border-t border-stone-400 pt-6">
                        <h3 className="mb-4 text-lg font-semibold text-stone-800">Account Information</h3>
                        <div className="rounded-lg border border-stone-300 bg-stone-100/80 p-4">
                            <p className="text-sm text-stone-700">
                                <span className="font-medium">Member Since:</span> {new Date(auth.user.created_at).toLocaleDateString('en-GB')}
                            </p>
                            <p className="mt-2 text-sm text-stone-700">
                                <span className="font-medium">Account Type:</span> Customer
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 mt-auto bg-black/70 py-4 text-center text-sm text-white">
                &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
            </footer>
        </CustomerLayout>
    );
}
