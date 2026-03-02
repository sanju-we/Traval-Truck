'use client';

import { useEffect, useState } from 'react';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
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

  const router = useRouter()

  const itemsPerPage = 6;

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchHotels(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const fetchHotels = async (page: number, searchQuery: string = '') => {
    setLoading(true);
    try {
      const limit = 6
      const data = await USER_API_METHODS.getAllHotel(searchQuery, page, limit);
      setHotels(data.data.data || []);
      setTotalPages(data.totalPages || 1);
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
