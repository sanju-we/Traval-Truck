"use client";

import { useEffect, useState } from "react";
import { Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell, } from "@/components/ui/table";
import { SideNavbar } from "@/components/admin/SideNavbar";
import {
  Loader2,
  Package,
  Hotel,
  Utensils,
  Calendar,
  IndianRupee,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { ADMIN_API_METHODS } from "@/services/APIs/admin.api.service";

interface Order {
  id: string;
  orderId: string;
  role: "Package" | "Rooms" | "Foods";
  amount: number;
  status: "Upcoming" | "Ongoing" | "Completed";
  startDate?: string;
  endDate?: Date;
  createdAt: string;
  userId?: {
    name?: string;
    email?: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const data = await ADMIN_API_METHODS.getAllOrders()
      if (data.success) {
        console.log(data.data)
        setOrders(data.data);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const roleIcon = (role: string) => {
    if (role === "Package") return <Package size={16} />;
    if (role === "Rooms") return <Hotel size={16} />;
    return <Utensils size={16} />;
  };

  const statusBadge = (status: string) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold inline-block";
    if (status === "Completed")
      return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>;
    if (status === "Ongoing")
      return <span className={`${base} bg-blue-100 text-blue-700`}>{status}</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SideNavbar active="Orders" />

      {/* Main */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="font-mono text-sm text-gray-800">
                          #{order.orderId}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-700">
                          {roleIcon(order.role)}
                          {order.role}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-800">
                            {order.userId?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.userId?.email || "-"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-emerald-600">
                          ₹{order.amount.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell>{statusBadge(order.status)}</TableCell>

                      <TableCell>
                        {order.startDate
                          ? new Date(order.startDate).toLocaleDateString()
                          : "—"}
                      </TableCell>

                      <TableCell>
                        {new Date(order.endDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}