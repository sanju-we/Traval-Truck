'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent } from '@/components/shared/ui/card';

import { useDispatch } from 'react-redux';
import { setSelectedUser } from '@/redux/userDetailsSlice';
import { useRouter } from 'next/navigation';
import User from '@/types/user/profile';
import { Search } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('status');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ Fetch users from backend
  const fetchUsers = async (currentPage = 1, searchTerm = '', statusFilter = '') => {
    setLoading(true);
    try {
      const res = await api.get(
        `/admin/vendor/allUsers?page=${currentPage}&limit=${limit}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
        }${statusFilter ? `&status=${statusFilter}` : ''}`
      );

      const { data, totalPages, total } = res.data.data;
      setUsers(data);
      setTotalPages(totalPages);
      setTotalItems(total || 0);
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

  // ✅ Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search, status);
  };

  // ✅ Handle status filter
  const handleStatusSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
    fetchUsers(1, search, selectedStatus);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage, search, status);
    }
  };

  const handleViewDetails = (user: User) => {
    dispatch(setSelectedUser(user));
    router.push(`/admin/users/${user.id}`);
  };

  return (
    <div className="flex-1 p-6">
      <Card className="bg-white shadow-md rounded-xl">
        <CardContent className="p-6">
          {/* ✅ Search + Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <form
              onSubmit={handleSearch}
              className="flex items-center border rounded-lg px-3 py-2 w-full md:w-1/3 bg-white shadow-sm"
            >
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none border-none text-sm text-gray-700"
              />
              <Button
                type="submit"
                className="ml-2 bg-purple-600 text-white hover:bg-purple-700 text-sm"
              >
                Search
              </Button>
            </form>

            <div className="flex gap-4">
              <select
                className="px-4 py-2 border rounded-lg text-sm text-gray-700"
                value={status}
                onChange={handleStatusSort}
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* ✅ Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-2 text-gray-600">Loading users...</p>
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
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img
                              src={
                                user.profilePicture ||
                                user.logo ||
                                '/images/profile.jpeg'
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">{user.name || user.companyName}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${user.role === 'admin'
                              ? 'bg-purple-100 text-purple-600'
                              : user.role === 'Restaurant Owner'
                                ? 'bg-yellow-100 text-yellow-700'
                                : user.role === 'Hotel Owner'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${user.isBlocked
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-700'
                              }`}
                          >
                            {user.isBlocked ? 'Blocked' : 'Active'}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ Premium Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 mt-6">
            <p className="text-sm text-gray-600 font-medium">
              Showing {users.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalItems)} of {totalItems} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors border text-gray-700 shadow-sm"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-semibold text-sm border border-purple-100">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className="px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors border text-gray-700 shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
