import React, { useState } from 'react';
import {
  Hotel,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
} from 'lucide-react';

interface RoomDetailsProps {
  product: any;
  startDate?: string;
  endDate?: string;
  people?: number;
  hotel?: any;
}

export default function RoomDetails({ product, startDate, endDate, people, hotel }: RoomDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const roomNumber = product?.RoomNumber;
  const roomType = product?.roomType;

  // Combine room images and hotel images, prioritizing room images
  const roomImages = [
    ...(product?.images || []),
    ...(hotel?.images || [])
  ].filter((img, index, self) => img && self.indexOf(img) === index);

  const roomDescription = product?.Description;
  const capacity = product?.Capacity;
  const pricePerNight = product?.PricePerNight;
  const facilities = product?.Facilities || [];
  const roomStatus = product?.Status;
  const hotelName = hotel?.companyName || hotel?.name || "Hotel Information";
  const hotelAddress = hotel?.address;

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
            <div className="relative h-64 rounded-xl overflow-hidden mb-3 shadow-sm border border-gray-100 group">
              <img
                src={roomImages[selectedImage]}
                alt={`Room ${roomNumber}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Highlighted Logo Overlay */}
              {hotel?.logo && (
                <div className="absolute top-4 right-4 z-10 w-16 h-16 rounded-2xl bg-white p-2 shadow-2xl border border-white flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                  <img src={hotel.logo} alt={hotelName} className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>
            {roomImages.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {roomImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx
                      ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
                      : 'border-transparent hover:border-gray-300'
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

        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {roomType} - Room {roomNumber}
            </h3>
            <p className="text-sm font-semibold text-blue-600">{hotelName}</p>
          </div>
          {hotelAddress && (
            <div className="flex items-center gap-1 text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <MapPin size={14} className="text-gray-400" />
              <span>{hotelAddress}</span>
            </div>
          )}
        </div>

        {roomDescription && (
          <p className="text-gray-600 mb-4">{roomDescription}</p>
        )}

        {/* Booking Dates & Guests */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {startDate && (
            <div className="flex items-center gap-2 text-gray-700 bg-green-50 rounded-lg p-3 border border-green-100">
              <Calendar size={18} className="text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Check-in</p>
                <p className="font-semibold text-gray-800">
                  {new Date(startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          {endDate && (
            <div className="flex items-center gap-2 text-gray-700 bg-red-50 rounded-lg p-3 border border-red-100">
              <Calendar size={18} className="text-red-600" />
              <div>
                <p className="text-xs text-gray-500">Check-out</p>
                <p className="font-semibold text-gray-800">
                  {new Date(endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          {people && (
            <div className="flex items-center gap-2 text-gray-700 bg-orange-50 rounded-lg p-3 border border-orange-100">
              <User size={18} className="text-orange-600" />
              <div>
                <p className="text-xs text-gray-500">Guests</p>
                <p className="font-semibold text-gray-800">
                  {people} {people === 1 ? 'Person' : 'People'}
                </p>
              </div>
            </div>
          )}
        </div>

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
                  className={`font-semibold ${roomStatus === 'Available'
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