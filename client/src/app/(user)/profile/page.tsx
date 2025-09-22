"use client";

import { useEffect, useState } from "react";
import { Camera, Edit, Mail, Phone, MapPin } from "lucide-react";
import { Header } from "@/components/user/header/page";
import { Footer } from "@/components/user/footer/page";
import api from "@/services/api";

interface Trip {
  title: string;
  date: string;
  image: string;
}

interface UserProfile {
  id: string;
  name: string;
  userName: string;
  email: string;
  password:string;
  isBlocked: boolean;
  role: string;
  googleId: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: number;
  gender?:string;
  interest?: string[];
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/user/profile/profile");

        if (!res.data.success) {
          throw new Error("Failed to fetch user profile");
        }

        const data: UserProfile = res.data;
        console.log(`data : ${data}`)
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-red-500">
        Failed to load profile 😔
      </div>
    );
  }

  return (
    <>
      <Header />
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={ "/images/profile.jpg"}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-500 object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-emerald-500 p-2 rounded-full text-white hover:bg-emerald-600 transition">
              <Camera size={18} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">Traveler | Adventure Seeker</p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                <Edit size={16} /> Edit Profile
              </button>
              <button className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
            <Mail className="text-emerald-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
            <Phone className="text-emerald-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{user.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Past Trips Section */}
      </div>
    </div>
    <Footer />
    </>
  );
}
