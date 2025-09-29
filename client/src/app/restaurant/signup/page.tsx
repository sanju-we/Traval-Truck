'use client';

import type React from 'react';
import { useState, useRef, useLayoutEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [timer, setTimer] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    ownerName: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const route = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      return updated;
    });
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

    if (!formData.companyName.trim()) newError.companyName = 'Company Name is required';

    if (!formData.ownerName.trim()) newError.ownerName = 'Owner Name is required';

    if (!formData.email) {
      newError.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newError.email = 'Invalid email address';
    }

    if (!formData.phone) {
      newError.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
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

  const handleTimer = () => {
    let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);

    try {
      const res = await api.post('/restaurant/auth/sendOtp', {
        email: formData.email,
      });

      const data = res.data;

      if (data.success) {
        toast.success('OTP resent to your email');
        setTimer(60); // restart timer
        handleTimer(); // restart countdown
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleSendOtp = async () => {
    if (!validate()) return;

    setIsOtpLoading(true);
    try {
      const res = await api.post('/restaurant/auth/sendOtp', {
        email: formData.email,
      });
      const data = res.data;

      if (data.success) {
        setShowOtpInput(true);
        toast.success('OTP sent to your email');
        setTimer(60);
        handleTimer();
        setErrors({});
      } else {
        toast.error(`${data.error}`);
      }
    } catch (err) {
      toast.error('Failed to send OTP');
      console.log('Error sending OTP: ', err);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await api.post('/restaurant/auth/verify', {
        email: formData.email,
        otp: otpCode,
        restaurantData: {
          companyName: formData.companyName,
          ownerName: formData.ownerName,
          email: formData.email,
          password: formData.password,
          phone: Number(formData.phone),
        },
      });
      const data = res.data;
      console.log('Error verifying OTP: ');

      if (data.success) {
        toast.success('Email Registered successfully, Approval Request sended');
        route.push('/restaurant/profile');
      } else {
        toast.error(`${data.message}`);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      toast.error('Verification failed');
      console.log('Error verifying OTP: ', err);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <header className="w-full flex justify-between items-center px-6 py-4 shadow-sm">
        <h1 className="text-lg font-bold">Travel Truck</h1>
        <button
          className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
          onClick={() => route.push('/restaurant/login')}
        >
          Sign in
        </button>
      </header>

      <main className="min-h-screen flex flex-col items-center w-full max-w-md mt-10 px-6">
        <h2 className="text-2xl font-bold">Sign up to DriveReady</h2>
        <p className="text-gray-500 text-sm mt-2">Or sign up with</p>
        <h6 className="text-emerald-500 ">{message}</h6>

        <form className="w-full mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter your Company Name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleChange(e)}
              disabled={showOtpInput}
            />
            {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              placeholder="Enter Company Owner Name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleChange(e)}
              disabled={showOtpInput}
            />
            {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your official email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleChange(e)}
              disabled={showOtpInput}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your Phone Number"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleChange(e)}
              disabled={showOtpInput}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => handleChange(e)}
                disabled={showOtpInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                disabled={showOtpInput}
              >
                👁
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => handleChange(e)}
                disabled={showOtpInput}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                disabled={showOtpInput}
              >
                👁
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showOtpInput ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 pt-4">
              <label className="block text-sm font-medium">Enter OTP</label>
              <p className="text-xs text-gray-500">
                `We&apos;ve sent a 6-digit code to {formData.email}`
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
                    className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    style={{
                      transform: digit ? 'scale(1.05)' : 'scale(1)',
                      borderColor: digit ? '#8b5cf6' : '#d1d5db',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {!showOtpInput ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isOtpLoading}
                className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOtpLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col items-center gap-3 text-sm text-gray-600">
                <span className="text-gray-500">Didn’t receive OTP?</span>
                <span className="font-medium text-purple-600">Resend available in {timer}s</span>
              </div>
              {timer === 0 ? (
                isResendingOtp ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resending...
                  </div>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                )
              ) : isVerifyingOtp ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otp.join('').length !== 6}
                  className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify OTP
                </button>
              )}
              <button
                type="button"
                className="w-full bg-gray-100 font-medium py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Continue with Email
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp(['', '', '', '', '', '']);
                  setMessage('');
                }}
                className="w-full text-purple-600 font-medium py-2 rounded-lg hover:bg-purple-50 transition"
              >
                ← Back to Form
              </button>
            </div>
          )}
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/restaurant/login" className="text-purple-600 hover:underline">
            Login here
          </a>
        </p>
      </main>
    </div>
  );
}
