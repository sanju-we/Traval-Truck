import React, { useState } from 'react';
import {
  Hotel,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface RoomDetailsProps {
  product: any;
}

export default function RoomDetails({ product }: RoomDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const roomNumber = product?.RoomNumber;
  const roomImages = product?.Images || [];
  const roomDescription = product?.Description;
  const capacity = product?.Capacity;
  const pricePerNight = product?.PricePerNight;
  const facilities = product?.Facilities || [];
  const roomStatus = product?.Status;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Hotel className="text-blue-600" size={22} />
          Room Information
        </h2>
      </div>

      <div className="p-6">
        {/* Image Gallery */}
        {roomImages.length > 0 && (
          <div className="mb-6">
            <div className="relative h-64 rounded-lg overflow-hidden mb-3">
              <img
                src={roomImages[selectedImage]}
                alt={`Room ${roomNumber}`}
                className="w-full h-full object-cover"
              />
            </div>
            {roomImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {roomImages.slice(0, 4).map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Room {roomNumber}
        </h3>

        {roomDescription && (
          <p className="text-gray-600 mb-4">{roomDescription}</p>
        )}

        {/* Room Specific Details */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {capacity && (
              <div className="flex items-center gap-2 text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <User size={18} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="font-semibold text-gray-800">
                    {capacity} {capacity === 1 ? 'Person' : 'People'}
                  </p>
                </div>
              </div>
            )}
            {pricePerNight && (
              <div className="flex items-center gap-2 text-gray-700 bg-purple-50 rounded-lg p-3 border border-purple-100">
                <CreditCard size={18} className="text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Price Per Night</p>
                  <p className="font-semibold text-gray-800">
                    ₹{pricePerNight.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {facilities.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="text-blue-600" size={18} />
                Room Facilities
              </h4>
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 capitalize"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {roomStatus && (
            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <AlertCircle size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Room Status</p>
                <p
                  className={`font-semibold ${
                    roomStatus === 'Available'
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}
                >
                  {roomStatus}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}