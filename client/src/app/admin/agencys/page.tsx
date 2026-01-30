'use client';

import { useEffect, useState } from 'react';
import { ADMIN_API_METHODS } from '@/services/APIs/admin.api.service';
import { Card, CardContent } from '@/components/shared/ui/card';
import { SideNavbar } from '@/components/admin/SideNavbar';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '@/redux/userDetailsSlice';
import { useRouter } from 'next/navigation';
import User from '@/types/user/profile';
import { Search } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();

    const fetchAgencies = async (currentPage = 1, searchTerm = '', statusFilter = '') => {
        setLoading(true);
        try {
            const res = await ADMIN_API_METHODS.getAllAgencies({
                page: currentPage,
                limit: limit,
                search: searchTerm,
                status: statusFilter
            });

            console.log("Admin Agencies Response:", res.data); // Debugging

            const { data, totalPages: total } = res.data;
            setAgencies(data);
            setTotalPages(total);
            setPage(currentPage);
        } catch (err) {
            console.error('Error fetching agencies:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAgencies(1, search, status);
    };

    const handleStatusSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);
        fetchAgencies(1, search, selectedStatus);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchAgencies(newPage, search, status);
        }
    };

    const handleViewDetails = (user: User) => {
        // Assuming reuse of user details page or if there's a specific agency detail page
        // For now, routing to users detail as fallback or maybe agency specific if exists
        // If no specific agency page, users/[id] often handles all roles if purely ID based
        dispatch(setSelectedUser(user));
        router.push(`/admin/users/${user.id}`);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <div className="w-full md:w-64">
                <SideNavbar active="Agencies" />
            </div>

            <Card className="flex-1 mt-6 mx-4 bg-white shadow-md rounded-xl">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Agencies</h2>
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center border rounded-lg px-3 py-2 w-full md:w-1/3 bg-white shadow-sm"
                        >
                            <Search className="text-gray-400 mr-2" size={18} />
                            <input
                                type="text"
                                placeholder="Search by company name..."
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
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-2 text-gray-600">Loading agencies...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="text-sm text-gray-600 bg-gray-100">
                                        <th className="px-4 py-3 text-left">Profile</th>
                                        <th className="px-4 py-3 text-left">Company Name</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Phone</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agencies.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-gray-500">
                                                No agencies found.
                                            </td>
                                        </tr>
                                    ) : (
                                        agencies.map((agency: any) => (
                                            <tr
                                                key={agency._id || agency.id}
                                                className="border-t hover:bg-gray-50 transition"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                        <img
                                                            src={
                                                                agency.logo ||
                                                                agency.profilePicture ||
                                                                '/images/profile.jpeg'
                                                            }
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">{agency.companyName || agency.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{agency.email}</td>
                                                <td className="px-4 py-3 text-gray-600">{agency.phone || 'N/A'}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`text-xs px-3 py-1 rounded-full font-medium ${agency.isApproved
                                                            ? 'bg-green-100 text-green-700'
                                                            : agency.isRestricted // Assuming isRestricted means rejected/blocked contextually, or checking isBlocked
                                                                ? 'bg-red-100 text-red-600'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {agency.isApproved ? 'Approved' : 'Pending/Restricted'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        className="text-sm text-purple-600 hover:underline"
                                                        onClick={() => handleViewDetails(agency)}
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

                    {totalPages > 1 && (
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
                                    className={`px-3 py-1 rounded-md ${page === i + 1
                                        ? 'bg-purple-600 text-white'
                                        : 'border text-gray-600 hover:bg-gray-100'
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
