"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/shared/ui/button";
import api from "@/services/api";
import toast from "react-hot-toast";
import EditRoomModal from "@/components/hotel/EditRoomModal";
import { IRoom } from "@/types/hotel";
import SideNavbar from "@/components/hotel/SideNavbar";
import {
  ArrowLeft,
  Users,
  IndianRupee,
  Wifi,
  Edit,
  ToggleLeft,
  ToggleRight,
  Ban,
  CheckCircle,
  ImageIcon,
} from "lucide-react";

export default function RoomDetails() {
  const { roomId } = useParams();
  const navigate = useRouter();
  const [room, setRoom] = useState<IRoom | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchRoom() {
      const res = await api.get(`/hotel/rooms/getRoom/${roomId}`);
      const data = res.data;
      console.log(data.data)
      setRoom(data.data);
    }
    fetchRoom();
  }, [roomId]);

  async function tongleStatus(id: string) {
    const status = room?.Status == 'Available' ? 'Maintance' : 'Available'
    const { data } = await api.patch('/hotel/rooms/updateStatus', { id, status })
    console.log(data)
    if (data.success) {
      toast.success(`Status updated as ${status}`)
      setRoom(data.data)
    } else toast.error(data.message)
  }

  const handleSave = (updatedRoom: any) => {
    console.log(updatedRoom)
    setRoom(updatedRoom);
  };

  async function tongleBlock(id: string) {
    const status = room?.isBlocked ? false : true
    const { data } = await api.patch('/hotel/rooms/updateBlock', { id, status })
    console.log(data)
    if (data.success) {
      toast.success(`Room ${status ? 'blocked' : 'unblocked'} successfully`)
      setRoom(data.data)
    } else toast.error(data.message)
  }

  if (!room) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <SideNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading room details...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Occupied':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Cleaning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Maintenance':
      case 'Maintance':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SideNavbar />
      <div className="flex-1 flex flex-col p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <button
            onClick={() => navigate.push("/hotel/rooms")}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Rooms</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Room No. {room.RoomNumber}</h1>
              <p className="text-blue-100">{room.Description}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setOpenEdit(true)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Edit size={18} className="mr-2" />
                Edit Room
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-96">
                <img
                  src={room.images[selectedImage]}
                  alt={`Room ${room.RoomNumber}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-2">
                  <ImageIcon size={16} />
                  {selectedImage + 1} / {room.images.length}
                </div>
              </div>

              {/* Image Thumbnails */}
              {room.images.length > 1 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-3">
                    {room.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition ${selectedImage === idx
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Room Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Room Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Users className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-semibold text-gray-800">{room.Capacity} Adults</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                  <IndianRupee className="text-green-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Price Per Night</p>
                    <p className="font-semibold text-gray-800">₹{room.PricePerNight.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-start gap-3">
                  <Wifi className="text-purple-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {room.Facilities.map((facility, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm text-gray-700"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Status</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(room.Status)}`}>
                    <CheckCircle size={16} />
                    {room.Status}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Available Rooms</p>
                  <p className="text-2xl font-bold text-blue-600">{room.AvailableCount}</p>
                </div>

                {room.isBlocked && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <Ban size={16} />
                      <span className="text-sm font-medium">Room is blocked</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>

              <div className="space-y-3">
                <Button
                  onClick={() => tongleStatus(room.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {room.Status === 'Available' ? (
                    <>
                      <ToggleRight size={18} className="mr-2" />
                      Mark as Maintenance
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={18} className="mr-2" />
                      Mark as Available
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => tongleBlock(room.id)}
                  variant={room.isBlocked ? 'default' : 'danger'}
                  className="w-full"
                >
                  {room.isBlocked ? (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      Enable Room
                    </>
                  ) : (
                    <>
                      <Ban size={18} className="mr-2" />
                      Disable Room
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openEdit && (
        <EditRoomModal
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          onSave={handleSave}
          room={room}
        />
      )}
    </div>
  );
}
