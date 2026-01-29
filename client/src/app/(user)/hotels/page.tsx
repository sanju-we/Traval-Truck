'use client';

import { useEffect, useState } from 'react';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { Loader2, MapPin, Star } from 'lucide-react';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import { useRouter } from 'next/navigation';
import { Hotel } from '@/types/hotel/index';

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  const itemsPerPage = 6;

  useEffect(() => {
    fetchHotels(currentPage);
  }, [currentPage]);

  const fetchHotels = async (page: number) => {
    setLoading(true);
    try {
      const limit = 6
      const data = await USER_API_METHODS.getAllHotel('',page,limit);
      console.log('fucking',data.data)
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

  if(!hotels){
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
                  src={hotel?.images ? hotel?.images[0] : '/images/default-hotel.jpg'}
                  alt={hotel.Description}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg">{hotel.Description}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={14} className="mr-1 text-emerald-500" />
                  {hotel.location}
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{hotel.Description}</p>
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
                    ₹{hotel.PricePerNight}/night
                  </p>
                </div>
                <button className="mt-3 w-full px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600"
                onClick={()=> router.push(`/hotels/${hotel.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1
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
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
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
