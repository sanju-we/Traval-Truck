'use client';

import { useEffect, useState } from 'react';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { ApiResponse } from '@/services/api.service';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import { useRouter } from 'next/navigation';
import { Hotel } from '@/types/hotel/index';
import { Loader2, MapPin, Star, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  const router = useRouter()

  const itemsPerPage = 6;

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchHotels(currentPage, debouncedSearch, minRating, sortBy);
  }, [currentPage, debouncedSearch, minRating, sortBy]);

  const fetchHotels = async (page: number, searchQuery: string = '', ratingFilter?: string, sortOption?: string) => {
    setLoading(true);
    try {
      const limit = 6
      const res = (await USER_API_METHODS.getAllHotel(searchQuery, page, limit, Number(ratingFilter), sortOption !== 'createdAt_desc' ? sortOption : undefined)) as ApiResponse<{ data: Hotel[]; totalPages: number }> | null;
      if (res && res.data) {
        setHotels(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (!hotels) {
    return (
      <div className="bg-white text-gray-800">
        <Header />
        <section className="max-w-6xl mx-auto px-6 mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore Our Partner Hotels</h2>
          NO data in here
        </section>
      </div>
    )
  }

  return (
    <div className="bg-white text-gray-800">
      <Header />

      <section className="max-w-6xl mx-auto px-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Explore Our Partner Hotels</h2>

        <div className="relative max-w-xl mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm hover:shadow"
            placeholder="Search by hotel name or location..."
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
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-48 border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 pl-3 bg-white"
            >
              <option value="0">All Ratings</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-sm font-medium text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 pl-3 bg-white"
            >
              <option value="createdAt_desc">Newest Arrivals</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="rating_asc">Lowest Rated</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
          </div>
        ) : hotels.length === 0 ? (
          <p className="text-center text-gray-500">No hotels available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {hotels?.map((hotel) => (
              <div
                key={hotel.id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition duration-200"
              >
                <img
                  src={hotel?.logo ? hotel?.logo : '/images/default-hotel.jpg'}
                  alt={hotel.companyName}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg">{hotel.companyName}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={14} className="mr-1 text-emerald-500" />
                  {hotel.address || hotel.location}
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{hotel.Description || `Visit ${hotel.companyName} for a comfortable stay.`}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center text-yellow-500">
                    {hotel.rating ? (
                      <>
                        {'★'.repeat(Math.round(hotel.rating))}
                        {'☆'.repeat(5 - Math.round(hotel.rating))}
                      </>
                    ) : (
                      'No rating'
                    )}
                  </div>
                  <p className="text-emerald-600 font-semibold text-sm">
                    Starting ₹{hotel.PricePerNight}/night
                  </p>
                </div>
                <button className="mt-3 w-full px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600"
                  onClick={() => router.push(`/hotels/${hotel.id}`)}
                >
                  View Rooms
                </button>
              </div>
            ))}
          </div>
        )}

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
