import { Mail, Phone } from 'lucide-react';
import { UserProfile } from '@/types/user/profile';

interface ProfileOverviewProps {
  user: UserProfile;
  formData: Partial<UserProfile>;
}

export default function ProfileOverview({ user, formData }: ProfileOverviewProps) {
  return (
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
  );
}