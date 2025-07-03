import React, { useState } from "react";
import { usePage, router } from '@inertiajs/react';

interface UserData {
  name: string; // Changed from username to match Laravel's default
  email: string;
  password: string;
  password_confirmation?: string;
}

interface PageProps {
  csrf_token: string;
}

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { csrf_token } = usePage<PageProps>().props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof UserData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<UserData> = {};
    
    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (mode === 'register' && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    if (mode === 'register') {
      await router.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }, {
        onSuccess: () => {
          setMode('login');
          setFormData({ name: "", email: "", password: "", password_confirmation: "" });
          // Optional: Show success message
        },
        onError: (errors) => {
          setErrors(errors as Partial<UserData>);
        }
      });
    } else {
      await router.post('/login', {
        email: formData.email,
        password: formData.password,
        remember: 'on'
      }, {
        onSuccess: () => {
          // Redirect handled by Laravel
        },
        onError: (errors) => {
          setErrors(errors as Partial<UserData>);
        }
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setMode('login')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'login' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'register' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />
          
          {/* Name Field (only for registration) */}
          {mode === 'register' && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Password Confirmation (only for registration) */}
          {mode === 'register' && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-orange-500 text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-colors shadow-md ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              mode === 'login' ? 'Login' : 'Register'
            )}
          </button>
        </form>
      </div>
      {/* Admin login link removed as requested */}
    </div>
  );
};

export default LoginPage;