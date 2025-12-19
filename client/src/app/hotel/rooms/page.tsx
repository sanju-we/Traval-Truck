"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LayoutGrid, List } from "lucide-react";
import { toast } from "react-hot-toast";
import { HOTEL_API_METHODS } from '@/services/APIs/hotel.api.service';
import SideNavbar from "@/components/hotel/SideNavbar";
import AddRoomModal from "@/components/hotel/addRoomsModal";

interface Room {
  id: string;
  RoomNumber: number;
  Capacity: number;
  Description: string;
  PricePerNight: number;
  Status: string
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [Description, setDescription] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter()

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await HOTEL_API_METHODS.getAllRooms(page, search, Description);
      console.log(res.data)
      setRooms(res.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, Description]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRooms();
  };

  const handleRoomAdded = () => {
    fetchRooms();
    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <div className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Rooms</h1>
            <p className="text-gray-500">
              Manage all room types, pricing, and current Description.
            </p>
          </div>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Room
          </Button>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-center gap-3"
        >
          <Input
            placeholder="Search by room number or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />

          <Select value={Description} onValueChange={setDescription}>
            <SelectTrigger>
              <SelectValue placeholder="Description" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" variant="outline">
            Search
          </Button>

          <Button
            variant="outline"
            className="ml-auto flex items-center gap-2"
            onClick={() =>
              setViewMode(viewMode === "list" ? "grid" : "list")
            }
          >
            {viewMode === "list" ? (
              <>
                <LayoutGrid size={16} /> Grid
              </>
            ) : (
              <>
                <List size={16} /> List
              </>
            )}
          </Button>
        </form>

        {/* Rooms Display */}
        <div>
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading rooms...</p>
          ) : rooms?.length === 0 ? (
            <p className="text-center text-gray-600 py-10">
              No rooms found. Try adjusting filters.
            </p>
          ) : viewMode === "list" ? (
            <div className="border rounded-xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room No.</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price (₹/Night)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms?.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.RoomNumber}</TableCell>
                      <TableCell>{room.Capacity} Adults</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${room.Status === "Available"
                            ? "bg-green-100 text-green-700"
                            : room.Status === "Occupied"
                              ? "bg-red-100 text-red-700"
                              : room.Status === "Cleaning"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {room.Status}
                        </span>
                      </TableCell>
                      <TableCell>₹{room.PricePerNight}</TableCell>
                      <TableCell>
                        <div className="space-x-3 text-sm font-medium text-blue-600">
                          <button onClick={() => router.push(`/hotel/rooms/${room.id}`)}>View</button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms?.map((room) => (
                <div
                  key={room.id}
                  className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${room.Status === "Available"
                        ? "bg-green-100 text-green-700"
                        : room.Status === "Occupied"
                          ? "bg-red-100 text-red-700"
                          : room.Status === "Cleaning"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {room.Status}
                    </span>
                  </div>
                  <p className="text-gray-600">Room No: {room.RoomNumber}</p>
                  <p className="text-gray-500">
                    Capacity: {room.Capacity} Adults
                  </p>
                  <p className="font-semibold text-lg mt-3 text-gray-900">
                    ₹{room.PricePerNight.toLocaleString()}
                  </p>
                  <div className="flex justify-between text-sm text-blue-600 mt-4">
                    <button onClick={() => router.push(`/hotel/rooms/${room.id}`)}>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <span className="text-gray-600 text-sm">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <AddRoomModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={fetchRooms}
          rooms={setRooms}
        />
      )}
    </div>
  );
}
