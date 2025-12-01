'use client';

import { useEffect, useState } from 'react';
import { Camera, Edit, Mail, Phone, Pencil } from 'lucide-react';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/components/utils/UserCropImage';
import { UserProfile } from '@/types/user/profile';
import ProfileSidebar from '@/components/user/profile/ProfileSidebar';

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [profileLoad, setProfileLoad] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const router = useRouter();


  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await USER_API_METHODS.getProfile();
        if (!data.success) {
          toast.error(data.message);
          if (data.message === 'This user is Restricted by the admin') {
            router.push('/');
          }
          return;
        }

        const result: UserProfile = data.data;
        setUser(result);
        setFormData(result);
        // const res = await api.get(`/shared/wallet/user`)
        // console.log(res)
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
      const res = await USER_API_METHODS.editProfile(formData);
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setIsCropping(true);
    }
  }

  async function handleCropComplete() {
    try {
      setProfileLoad(true);
      const croppedImage = await getCroppedImg(imagePreview!, croppedAreaPixels);
      const ress = await fetch(croppedImage);
      const blob = await ress.blob();

      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      const formDataImg = new FormData();
      formDataImg.append('profile', file);
      const res = await USER_API_METHODS.uploadImage(formDataImg);
      if (res.data.success) {
        if (res.data.data != null) {
          setFormData(res.data.data);
          setUser(res.data.data);
        }
        toast.success('Profile picture updated successfully!');
      }
      setProfileLoad(false);
      setIsCropping(false);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to crop image.');
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
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-10">

          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <img
                src={user.profilePicture || "/images/profile.jpg"}
                className="w-32 h-32 rounded-full border-4 border-emerald-500 object-cover shadow-sm transition duration-300 group-hover:opacity-80"
              />
              <label
                htmlFor="profile-upload-hero"
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition duration-300"
              >
                <Camera size={22} className="text-white drop-shadow-lg" />
                <input
                  id="profile-upload-hero"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">@{user.userName || "traveler"}</p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 transition"
            >
              <Edit size={16} /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-10">
            {[
              { label: "Total Trips", value: 12 },
              { label: "Ongoing", value: 3 },
              { label: "Completed", value: 9 },
              { label: "Wishlist", value: 5 },
            ].map((item, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="text-xl font-bold text-gray-700">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-6 mt-10 border-b pb-2 text-sm">
            {['overview', 'history', 'wishlist', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-semibold transition ${activeTab === tab
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                {tab === 'overview' && 'Profile Overview'}
                {tab === 'history' && 'Trip History'}
                {tab === 'wishlist' && 'Wishlist'}
                {tab === 'settings' && 'Settings'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-4">Personal Info</h3>

                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                    <Mail className="text-emerald-500" size={20} />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                    <Phone className="text-emerald-500" size={20} />
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">
                        {formData.phoneNumber === 0 ? 'Not provided' : formData.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-semibold text-gray-700 mb-3">Your Interests</h3>

                <div className="flex flex-wrap gap-2">
                  {(user.interest || ["Beach", "Mountains", "Food"]).map((val, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-semibold text-gray-700 mb-2">Achievements</h3>

                <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl">
                  <div>
                    <p className="font-semibold text-emerald-600 text-sm">10% off your next trip</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Valid until December 31, 2025
                    </p>
                  </div>

                  <img
                    src="/images/coupon-card.png"
                    className="w-32 rounded-lg shadow"
                    alt="Coupon"
                  />
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <Footer />

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
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>

              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full">
                  <Pencil size={24} />
                </div>
              </div>

              <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Edit Profile
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Update your personal information
              </p>

              {/* Profile Picture Upload Section */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative group">
                  <img
                    src={
                      formData.profilePicture ||
                      user.profilePicture ||
                      '/images/profile.jpg'
                      || "/placeholder.svg"}
                    alt="Profile Preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 transition duration-300 group-hover:opacity-80"
                  />

                  <label
                    htmlFor="profile-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition duration-300"
                  >
                    <Camera size={22} className="text-white drop-shadow-lg" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Click the camera to change photo</p>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    name="userName"
                    value={formData.userName || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl w-[90%] max-w-lg h-[500px] overflow-hidden">
            <Cropper
              image={imagePreview || ''}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />

            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-2/3"
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                {profileLoad ? <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div> : 'Save Crop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
