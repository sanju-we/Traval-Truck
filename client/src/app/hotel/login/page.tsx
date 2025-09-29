'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/hotel/auth/login', formData);
      const data = res.data;
      console.log('data:', data);

      if (data.success) {
        toast.success('Login successful!');
        router.push('/hotel/profile');
      } else {
        toast.error(`${data.message}`);
      }
    } catch (err) {
      toast.error('Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 shadow-sm">
        <h1 className="text-lg font-bold">Travel Truck</h1>
        <button
          onClick={() => router.push('/agency/signup')}
          className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
        >
          Sign up
        </button>
      </header>

      {/* Main */}
      <main className="min-h-screen flex flex-col items-center w-full max-w-md mt-10 px-6">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-2">Login with your credentials</p>

        <form className="w-full mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                👁
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <p className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
            <a href="/agency/forgetPassword" className="text-purple-600 hover:underline">
              Forgot password?
            </a>
          </p>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              'Log in'
            )}
          </button>

          {/* Google Login */}
          <button
            type="button"
            className="w-full bg-gray-100 font-medium py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Continue with GOOGLE
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500">
          Don’t have an account?{' '}
          <a href="/hotel/signup" className="text-purple-600 hover:underline">
            Sign up here
          </a>
        </p>
      </main>
    </div>
  );
}
