"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("❌ Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/user/auth/forgot-password", { email });
      const data = res.data;

      if (data.success) {
        setMessage(`success`);
        router.push("/forgetPassword/sent");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("❌ Failed to send reset link");
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
          onClick={() => router.push("/login")}
          className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
        >
          Log in
        </button>
      </header>

      {/* Main */}
      <main className="min-h-screen flex flex-col items-center w-full max-w-md mt-10 px-6">
        <h2 className="text-2xl font-bold">Forgot Password?</h2>
        <p className="text-gray-500 text-sm mt-2">
          Enter your email to receive a reset link
        </p>
        <h6 className="text-emerald-500 mt-2">{message}</h6>

        <form
          className="w-full mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword();
          }}
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500">
          Remembered your password?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Log in
          </a>
        </p>
      </main>
    </div>
  );
}
