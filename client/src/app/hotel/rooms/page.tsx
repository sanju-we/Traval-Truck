"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/shared/ui/table";
import { LayoutGrid, List } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AddRoomModal from "@/components/hotel/addRoomsModal";
import { HOTEL_API_METHODS } from "@/services/APIs/hotel.api.service";
import { Room } from "@/types/hotel";
import VendorFooter from "@/components/shared/Footer";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const router = useRouter();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await HOTEL_API_METHODS.getAllRooms(page, search, status);
      setRooms(res.data.data || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, status, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRooms();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
            <p className="text-gray-500">
              Manage room availability, pricing, and details
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
            placeholder="Search by room number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" onSelect={setStatus}>All</SelectItem>
              <SelectItem value="Available" onSelect={setStatus}>Available</SelectItem>
              <SelectItem value="Occupied" onSelect={setStatus}>Occupied</SelectItem>
              <SelectItem value="Cleaning" onSelect={setStatus}>Cleaning</SelectItem>
              <SelectItem value="Maintenance" onSelect={setStatus}>Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" variant="outline">
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            className="ml-auto flex items-center gap-2"
            onClick={() =>
              setViewMode(viewMode === "grid" ? "list" : "grid")
            }
          >
            {viewMode === "grid" ? <List size={16} /> : <LayoutGrid size={16} />}
            {viewMode === "grid" ? "List" : "Grid"}
          </Button>
        </form>
        <br />

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
            No rooms found. Try adjusting filters.
          </div>
        ) : viewMode === "list" ? (
          /* ================= LIST VIEW ================= */
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Available Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={room.images?.[0] || "/placeholder-room.jpg"}
                          className="w-14 h-12 object-cover rounded-md border"
                          alt="room"
                        />
                        <span className="font-medium">
                          {room.roomType}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{room.Capacity} Guests</TableCell>

                    <TableCell>{room.AvailableCount}</TableCell>

                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${room.Status === "Available"
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

                    <TableCell>
                      ₹{room.PricePerNight.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() =>
                          router.push(`/hotel/rooms/${room.id}`)
                        }
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* ================= GRID VIEW ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Image */}
                <div className="h-40 bg-gray-100">
                  <img
                    src={room.images?.[0] || "/placeholder-room.jpg"}
                    alt="room"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${room.Status === "Available"
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

                  <p className="font-semibold text-gray-800">
                    {room.roomType}
                  </p>
                  <p className="text-sm text-gray-500">
                    Capacity: {room.Capacity} Guests | Available: {room.AvailableCount}
                  </p>

                  <p className="text-lg font-bold text-gray-900 mt-3">
                    ₹{room.PricePerNight.toLocaleString()} / night
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/hotel/rooms/${room.id}`)
                    }
                    className="mt-4 text-blue-600 text-sm hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>

            <span className="text-sm text-gray-600">
              Page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
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
        <VendorFooter />
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
