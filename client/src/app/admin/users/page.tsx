'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { SideNavbar } from '@/components/admin/SideNavbar';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '@/redux/userDetailsSlice';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name?: string;
  userName?: string;
  profilePicture?: string;
  ownerName?: string;
  companyName?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  phone?: number;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('status');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();
  const router = useRouter();

  const fetchUsers = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/vendor/allUsers?page=${currentPage}&limit=${limit}`);
      const { data, totalPages } = res.data.data;
      setUsers(data);
      setTotalPages(totalPages);
      setPage(currentPage);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user: User) => {
    dispatch(setSelectedUser(user));
    router.push(`/admin/users/${user.id}`);
  };

  async function handleRoleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = e.target.value;
    // Optional: implement sorting with pagination if needed
    await api.get(`/admin/vendor/sort?sort=${selected}&status=${status}`);
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64">
        <SideNavbar active="Users" />
      </div>
      <Card className="flex-1 mt-6 mx-4 bg-white shadow-md rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search"
              className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex gap-4">
              <select className="px-4 py-2 border rounded-lg text-sm text-gray-700" onChange={handleRoleSort}>
                <option>Role</option>
                <option>User</option>
                <option>Restaurant</option>
                <option>Hotel</option>
                <option>Agency</option>
              </select>
              <select className="px-4 py-2 border rounded-lg text-sm text-gray-700" onChange={(e) => setStatus(e.target.value)}>
                <option>Status</option>
                <option>Active</option>
                <option>Blocked</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-2">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-sm text-gray-600 bg-gray-100">
                    <th className="px-4 py-3 text-left">Profile</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                          {user.companyName ? 'V' : 'U'}
                        </div>
                      </td>
                      <td className="px-4 py-3">{user.name || user.companyName}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-600'
                              : user.role === 'Restaurant Owner'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
                          {!user.isBlocked ? 'Active' : user.isApproved ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="text-sm text-purple-600 hover:underline"
                          onClick={() => handleViewDetails(user)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2 text-sm">
            <button
              className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded-md ${
                  page === i + 1 ? 'bg-purple-600 text-white' : 'border text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              &gt;
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
