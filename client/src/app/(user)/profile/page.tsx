'use client';

import { useEffect, useState } from 'react';
import { Camera, Edit, Mail, Phone, Pencil } from 'lucide-react';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface UserProfile {
  id: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  isBlocked: boolean;
  role: string;
  googleId: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: number;
  gender?: string;
  interest?: string[];
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get('/user/profile/profile');

        if (!data.success) {
          toast.error(data.message);
          if (data.message === 'This user is Restricted by the admin') {
            router.push('/');
          }
        }

        const result: UserProfile = data.data;
        setUser(result);
        setFormData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phoneNumber' ? (value === '' ? undefined : Number(value)) : value,
    }));
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.patch('/user/profile/update', formData);
      if (!res.data.success) {
        toast.error(res.data.message || 'Update failed');
        setIsSaving(false);
        return;
      }
      toast.success('Profile updated successfully');
      setUser(res.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-2">Ooops Something went wrong...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={user.profilePicture || '/images/profile.jpg'}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-500 object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-emerald-500 p-2 rounded-full text-white hover:bg-emerald-600 transition">
                <Camera size={18} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">{user.interest ? user.interest.map((val)=>` ${val} | ` ):'Traveler | Adventure Seeker'}</p>
              <div className="flex justify-center md:justify-start gap-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
                >
                  <Edit size={16} /> Edit Profile
                </button>
                <button className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50">
                  Settings
                </button>
              </div>
            </div>
          </div>

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
                <p className="font-medium text-gray-800">{formData.phoneNumber === 0 ? '' : formData.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* 🆕 Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>

              {/* Optional Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                  <Pencil size={24} />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">Edit Profile</h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Update your personal information
              </p>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    name="userName"
                    value={formData.userName || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber === 0 ? '' : formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-md transition ${isSaving
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                  >
                    {isSaving ? (
                      <svg
                        className="animate-spin h-5 w-5 mx-auto text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
