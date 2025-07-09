import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';

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
    <CustomerLayout 
      currentPage="profile" 
      transparentNav={true}
      fullHeight={true}
      backgroundImage="/images/steak.jpg"
      title="Profile"
    >
      <div className="max-w-2xl mx-auto px-6 py-10 relative z-10">
        <div className="bg-gradient-to-br from-stone-200/95 to-amber-100/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-stone-300/60">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {auth.user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-extrabold text-stone-800">My Profile</h1>
            <p className="text-stone-700 mt-2">Manage your account information</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/90 text-stone-800"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/90 text-stone-800"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="border-t border-stone-400 pt-6">
              <h3 className="text-lg font-semibold text-stone-800 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/90 text-stone-800"
                    placeholder="Leave blank to keep current password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/90 text-stone-800"
                    placeholder="Confirm your new password"
                  />
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wide hover:bg-orange-600 transition duration-300 shadow-lg disabled:opacity-50"
              >
                {processing ? 'Updating...' : 'Update Profile'}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-3 border border-stone-400 text-stone-700 font-bold rounded-lg hover:bg-stone-300/50 transition duration-300"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Account Info */}
          <div className="mt-8 pt-6 border-t border-stone-400">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Account Information</h3>
            <div className="bg-stone-100/80 p-4 rounded-lg border border-stone-300">
              <p className="text-sm text-stone-700">
                <span className="font-medium">Member Since:</span> {new Date(auth.user.created_at).toLocaleDateString('en-GB')}
              </p>
              <p className="text-sm text-stone-700 mt-2">
                <span className="font-medium">Account Type:</span> Customer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm relative z-10">
        &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
      </footer>
    </CustomerLayout>
  );
}
