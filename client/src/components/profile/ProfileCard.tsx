// components/profile/ProfileCard.tsx
import { Camera, Edit } from 'lucide-react';
import Image from 'next/image';

interface ProfileCardProps<T> {
  profile: T;
  logoField: keyof T;
  nameField: keyof T;
  companyField?: keyof T;
  onEdit: () => void;
  onUpload: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileCard<T>({
  profile,
  logoField,
  nameField,
  companyField,
  onEdit,
  onUpload,
  onImageChange,
}: ProfileCardProps<T>) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-[120px] h-[120px] flex-shrink-0 group">
        <Image
          src={(profile[logoField] as string) || '/images/profile.jpg'}
          alt="Profile"
          fill
          className="rounded-full object-cover border-4 border-emerald-500"
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
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-emerald-700">{profile[nameField] as string}</h2>
        {companyField && <p className="text-gray-500">{(profile[companyField] as string) || 'N/A'}</p>}
        <div className="mt-4 flex gap-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 text-sm"
          >
            <Edit size={16} /> Edit Profile
          </button>
          <button
            onClick={onUpload}
            className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 text-sm"
          >
            Attach Documents
          </button>
        </div>
      </div>
    </div>
  );
}