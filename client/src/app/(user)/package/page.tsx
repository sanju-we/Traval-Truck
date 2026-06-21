'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Loader2, Search } from 'lucide-react';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import { useRouter } from 'next/navigation';
import { Package } from '@/types/agency';
import { useDebounce } from '@/hooks/useDebounce';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [price, setPrice] = useState('All');
  const [duration, setDuration] = useState('All');
  const [sortBy, setSortBy] = useState('title_asc');

  const router = useRouter()

  const itemsPerPage = 6; // adjust how many packages per page

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchPackages(currentPage, debouncedSearch, price, duration, sortBy);
  }, [currentPage, debouncedSearch, price, duration, sortBy]);

  const fetchPackages = async (page: number, searchQuery: string = '', price?: string, duration?: string, sortBy?: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/user/packages/getAll?page=${page}&limit=${itemsPerPage}&search=${searchQuery}${price ? `&price=${price}` : ''}${duration ? `&duration=${duration}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}`);
      console.log(res.data.data)
      setPackages(res.data.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white text-gray-800">
      <Header />

      <section className="max-w-6xl mx-auto px-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Explore Our Travel Packages</h2>

        <div className="relative max-w-xl mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm hover:shadow"
            placeholder="Search by package name or covered places..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 mb-8 gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-40 border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 pl-3 bg-white"
            >
              <option value="All">All Prices</option>
              <option value="under_5k">Under ₹5,000</option>
              <option value="5k_15k">₹5,000 - ₹15,000</option>
              <option value="over_15k">Over ₹15,000</option>
            </select>

            <select
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-40 border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 pl-3 bg-white"
            >
              <option value="All">All Durations</option>
              <option value="short">Short (1-3 Days)</option>
              <option value="medium">Medium (4-7 Days)</option>
              <option value="long">Long (8+ Days)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-sm font-medium text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 pl-3 bg-white"
            >
              <option value="title_asc">Name (A-Z)</option>
              <option value="title_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
          </div>
        ) : packages.length === 0 ? (
          <p className="text-center text-gray-500">No packages available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition duration-200"
                onClick={() => router.push(`/package/${pkg.id}`)}
              >
                <img
                  src={pkg.images ? pkg.images[0] : '/images/default.jpg'}
                  alt={pkg.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Duration: <span className="font-medium text-gray-800">{pkg.duration}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Price: <span className="font-medium text-emerald-600">₹{pkg.price}</span>
                </p>
                <button className="mt-3 w-full px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-emerald-600 hover:bg-emerald-50'
              }`}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border ${currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-emerald-600 hover:bg-emerald-50'
              }`}
          >
            Next
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
