"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Separator } from "@/components/shared/ui/seperator";
import { Badge } from "@/components/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/ui/table";
import api from "@/services/api";
import toast from "react-hot-toast";
import EditRoomModal from "@/components/hotel/EditRoomModal";
import { IRoom } from "@/types/hotel";

export default function RoomDetails() {
  const { roomId } = useParams();
  const navigate = useRouter();
  const [room, setRoom] = useState<IRoom | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [roomData, setRoomData] = useState(room);

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
      toast.success(`Status updates as ${status}`)
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
      toast.success(`Status updates as ${status}`)
      setRoom(data.data)
    } else toast.error(data.message)
  }

  if (!room) return <div className="p-10 text-center">Loading room details...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-sm text-gray-500 mb-2">
        <span
          onClick={() => navigate.push("/hotel/rooms")}
          className="cursor-pointer hover:underline text-blue-500"
        >
          Rooms
        </span>{" "}
        / Room No. {room.RoomNumber}
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Room Details - Room No. {room.RoomNumber}</h1>
          <p className="text-gray-500">Overview of room status, pricing, and recent activity.</p>
          <Button onClick={() => setOpenEdit(true)}>Edit</Button>
        </div>
        <Button variant="outline" onClick={() => navigate.push("/hotel/rooms")}>
          ← Back to All Rooms
        </Button>
      </div>

      <Separator />

      {/* Room Info Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2">
          <Badge
            variant={
              room.Status === "Available"
                ? "success"
                : room.Status === "Maintenance"
                  ? "destructive"
                  : "secondary"
            }
          >
            {room.Status}
          </Badge>
          <p className="font-medium text-lg">{room.Description}</p>
          <p className="text-sm text-gray-600">
            Capacity: {room.Capacity} Adults • ₹{room.PricePerNight}/night
          </p>
          <p className="text-sm text-gray-600">
            Facilities: {room.Facilities.join(", ")}
          </p>
          <p className="text-sm text-gray-600">
            Available Rooms: {room.AvailableCount}
          </p>
        </div>

        <Card className="w-72 h-48 overflow-hidden">
          <img
            src={room.images[0]}
            alt="Room"
            className="w-full h-full object-cover"
          />
        </Card>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => tongleStatus(room.id)}>{room.Status == 'Available' ? 'Mark as Maintenance' : 'Mark as Available'}</Button>
        <Button variant={room.isBlocked ? 'default' : 'danger'} onClick={() => tongleBlock(room.id)}>{room.isBlocked ? 'Enable Room' : 'Disable Room'}</Button>
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
