'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const route = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const validate = () => {
    const newError: { [key: string]: string } = {};

    if (!formData.name.trim()) newError.name = 'Name is required';

    if (!formData.email) {
      newError.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newError.email = 'Invalid email address';
    }

    if (!formData.phoneNumber) {
      newError.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newError.phone = 'Phone must be 10 digits';
    }

    if (!formData.password) {
      newError.password = 'Password is required';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/.test(formData.password)) {
      newError.password =
        "Password must be at least 8 characters, include letters, numbers, and only '_' is allowed as special character";
    }

    if (formData.confirmPassword !== formData.password) {
      newError.confirmPassword = 'Passwords do not match';
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validate()) return;

    setIsOtpLoading(true);
    try {
      const res = await api.post('/user/auth/sendOtp', { email: formData.email });
      const data = res.data;

      if (data.success) {
        setShowOtpInput(true);
        setMessage('✅ OTP sent to your email');
        setErrors({});
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to send OTP');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setMessage('❌ Please enter complete OTP');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await api.post('/user/auth/verify', {
        email: formData.email,
        otp: otpCode,
        userData: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: Number(formData.phoneNumber),
        },
      });
      const data = res.data;

      if (data.success) {
        toast.success('Email verified successfully!');
        document.cookie = 'allowDrive=true; path=/';
        route.push('/drive');
      } else {
        toast.error(`${data.error}`);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      console.log('Error verifying OTP: ', err);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
          <h6 className="text-emerald-500 mt-2">{message}</h6>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              disabled={showOtpInput}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={showOtpInput}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={showOtpInput}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                disabled={showOtpInput}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={showOtpInput}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2 text-gray-500 text-sm"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {showOtpInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <p className="text-xs text-gray-500 mb-2">
                We've sent a 6-digit code to {formData.email}
              </p>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-10 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                ))}
              </div>
            </div>
          )}

          {!showOtpInput ? (
            <>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isOtpLoading}
                className="w-full bg-gray-800 text-white font-semibold py-2.5 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
              >
                {isOtpLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex-grow h-px bg-gray-200"></div>
                or
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => (window.location.href = 'http://localhost:5000/api/user/auth/google')}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md hover:bg-gray-50 transition"
              >
                <FcGoogle style={{ marginRight: -2 }} />
                Continue with Google
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otp.join('').length !== 6}
                className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </span>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp(['', '', '', '', '', '']);
                  setMessage('');
                }}
                className="w-full text-gray-700 font-medium py-2.5 rounded-md hover:bg-gray-100 transition"
              >
                ← Back to Form
              </button>
            </>
          )}
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-gray-700 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
