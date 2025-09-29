'use client';

import { useRouter } from 'next/navigation';

export default function PasswordResetSentPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 shadow-sm">
        <h1 className="text-lg font-bold">Travel Truck</h1>
        <button
          onClick={() => router.push('/agency/login')}
          className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
        >
          Log in
        </button>
      </header>

      {/* Main */}
      <main className="min-h-screen flex flex-col items-center w-full max-w-md mt-20 px-6 text-center">
        <h2 className="text-2xl font-bold">Check your email 📩</h2>
        <p className="text-gray-600 mt-3">
          If the email you entered is registered with us, you’ll receive a link to reset your
          password shortly.
        </p>

        <button
          onClick={() => router.push('/login')}
          className="mt-8 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Back to Login
        </button>
      </main>
    </div>
  );
}
