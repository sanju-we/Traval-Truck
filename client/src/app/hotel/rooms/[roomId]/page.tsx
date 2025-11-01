"use client"

import { useEffect, useState } from "react";
import { useRouter,useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/seperator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/services/api";
import toast from "react-hot-toast";
import { prevStep } from "@/redux/userDriveSlice";
import { Data } from "@react-google-maps/api";

interface IRoom {
  _id: string;
  RoomNumber: number;
  Description: string;
  PricePerNight: number;
  Capacity: number;
  Facilities: string[];
  Images: string[];
  reviews: {
    Comment: string;
    CreatedAt: string;
    Name: string;
    Rating: string;
    UserId: string;
  }[];
  rating: {
    Average: number;
    Count: number;
  };
  AvailableCount: number;
  Status: string;
  CreatedAt: string;
  HotelId: string;
}

export default function RoomDetails() {
  const { roomId } = useParams();
  const navigate = useRouter();
  const [room, setRoom] = useState<IRoom | null>(null);
  console.log(roomId)
  useEffect(() => {
    async function fetchRoom() {
      const res = await api.get(`/hotel/rooms/getRoom/${roomId}`);
      const data = res.data;
      setRoom(data.data);
    }
    fetchRoom();
  }, [roomId]);

  async function tongleStatus(id:string){
    const status = !room?.Status
    const {data} = await api.patch('/hotel/rooms/updateStatus',{id,status})
    if(data.success){
      toast.success(`Status updates as ${status}`)
      setRoom(data.data)
    }
    toast.error(data.message)
  }

  if (!room) return <div className="p-10 text-center">Loading room details...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        <span
          onClick={() => navigate.push("/hotel/rooms")}
          className="cursor-pointer hover:underline text-blue-500"
        >
          Rooms
        </span>{" "}
        / Room No. {room.RoomNumber}
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Room Details - Room No. {room.RoomNumber}</h1>
          <p className="text-gray-500">Overview of room status, pricing, and recent activity.</p>
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
            src={room.Images[0]}
            alt="Room"
            className="w-full h-full object-cover"
          />
        </Card>
      </div>

      {/* Booking History */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Recent Booking History</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Anu Raj</TableCell>
                <TableCell>Aug 14</TableCell>
                <TableCell>Aug 16</TableCell>
                <TableCell>
                  <Badge variant="secondary">Checked-Out</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Joseph M</TableCell>
                <TableCell>Aug 10</TableCell>
                <TableCell>Aug 12</TableCell>
                <TableCell>
                  <Badge variant="outline">Cancelled</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Status Change Log */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Status Change Log</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Changed To</TableHead>
                <TableHead>By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Aug 16</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Front Desk</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Aug 16</TableCell>
                <TableCell>Cleaning</TableCell>
                <TableCell>Housekeeping</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary">{room.Status == 'Available' ? 'Mark as Maintenance' : 'Mark as Available'}</Button>
        <Button variant="danger">Disable Room</Button>
      </div>
    </div>
  );
}
