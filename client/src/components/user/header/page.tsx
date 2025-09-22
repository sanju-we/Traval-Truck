"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function handleLogout(){
    try {
      const res =await api.post('/user/auth/logout')
    const data = res.data
    if (!data.success) throw new Error("Logout failed");
    toast.success("Logout successfully")
    router.push("/login")
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to logout. Try again!");
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notifyRef.current &&
        !notifyRef.current.contains(event.target as Node)
      ) {
        setNotifyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-sm relative">
      <h1 className="text-xl font-bold">Travel Truck</h1>

      {/* Navigation */}
      <nav className="flex gap-6 text-sm font-medium">
        <a href="/user/home">Home</a>
        <a href="/user/package">Packages</a>
        <a href="/user/hotel">Hotels</a>
        <a href="/user/description">Destinations</a>
        <a href="/user/trips">Tips</a>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
          Get Started
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => setNotifyOpen(!notifyOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {notifyOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <p className="px-4 py-2 text-sm font-semibold text-gray-700">
                Notifications
              </p>
              <hr />
              <div className="max-h-60 overflow-y-auto">
                <p
                  onClick={() => toast.success("✈️ Goa trip confirmed!")}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  ✈️ Your Goa trip is confirmed!
                </p>
                <p
                  onClick={() => toast.success("🏨 Bali hotel booked!")}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  🏨 Hotel booking in Bali successful.
                </p>
                <p
                  onClick={() => toast("🎉 New offers available")}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  🎉 New package offers available.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Circle */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-emerald-500"
          >
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a
                href="/user/details"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Personal Details
              </a>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
