'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // token from email link

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/restaurant/auth/reset-password', {
        token,
        newPassword: password,
      });
      const data = res.data;

      if (data.success) {
        toast.success('Password reset successful! Redirecting...');
        setTimeout(() => router.push('/restaurant/login'), 2000);
      } else {
        toast.error(`${data.error}`);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Failed to reset password');
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
          onClick={() => router.push('/restaurant/login')}
          className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
        >
          Log in
        </button>
      </header>

      {/* Main */}
      <main className="min-h-screen flex flex-col items-center w-full max-w-md mt-20 px-6">
        <h2 className="text-2xl font-bold">Reset Your Password</h2>
        <p className="text-gray-500 text-sm mt-2">Enter your new password below</p>

        <form
          className="w-full mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
        >
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Resetting...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
