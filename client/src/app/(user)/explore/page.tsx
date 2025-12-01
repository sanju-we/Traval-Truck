'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Utensils,
  BedDouble,
  PackageSearch,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import toast from 'react-hot-toast';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';

type Tab = 'packages' | 'rooms' | 'foods';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>('packages');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const router = useRouter();

  useEffect(() => {
    fetchData(activeTab, page, search);
  }, [activeTab, page]);

  const fetchData = async (type: Tab, currentPage: number, searchTerm = '') => {
    try {
      setLoading(true);
      let res;

      const query = `?page=${currentPage}&limit=${limit}${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
      }`;

      if (type === 'packages') res = await USER_API_METHODS.getAllPackages(query);
      if (type === 'rooms') res = await USER_API_METHODS.getAllHotel(query);
      if (type === 'foods') res = await USER_API_METHODS.showAllFoods(query);

      if (!res?.data?.success) return toast.error('Failed to fetch data');

      const { data, totalPages } = res.data.data || [];

      if (type === 'packages') setPackages(data ? data : []);
      if (type === 'rooms') setRooms(data || []);
      if (type === 'foods') setFoods(data || []);

      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData(activeTab, 1, search);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchData(activeTab, newPage, search);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-700">Explore With Travel Truck</h1>
            <p className="text-gray-500 text-sm mt-2">
              Discover exciting packages, cozy rooms, and delicious cuisines for your next journey.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            {[
              { label: 'Packages', icon: <PackageSearch size={18} />, key: 'packages' },
              { label: 'Rooms', icon: <BedDouble size={18} />, key: 'rooms' },
              { label: 'Foods', icon: <Utensils size={18} />, key: 'foods' },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab(tab.key as Tab);
                  setPage(1);
                  setSearch('');
                }}
                className="flex items-center gap-2"
              >
                {tab.icon} {tab.label}
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-center mb-8"
          >
            <div className="flex items-center w-full max-w-md bg-white shadow rounded-lg px-3">
              <Search className="text-gray-500 mr-2" size={18} />
              <Input
                placeholder="Search across all items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-none focus:ring-0 focus:outline-none w-full"
              />
              <Button
                type="submit"
                className="ml-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center h-[40vh]">
              <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
            </div>
          ) : (
            <>
              {/* Data Grid */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {/* ✅ Packages */}
                {activeTab === 'packages' &&
                  packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border rounded-lg shadow hover:shadow-md transition-all overflow-hidden"
                    >
                      <img
                        src={pkg.images?.[0] || '/images/default-package.jpg'}
                        className="w-full h-40 object-cover"
                        alt={pkg.title}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800">{pkg.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{pkg.description}</p>
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <span className="text-emerald-600 font-semibold">₹{pkg.price}</span>
                          <span className="text-gray-400">{pkg.duration}</span>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => router.push(`/package/${pkg.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={() => router.push(`/book/package/${pkg.id}`)}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                {/* ✅ Rooms */}
                {activeTab === 'rooms' &&
                  rooms.map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border rounded-lg shadow hover:shadow-md transition-all overflow-hidden"
                    >
                      <img
                        src={room.Images?.[0] || '/images/default-room.jpg'}
                        className="w-full h-40 object-cover"
                        alt={`Room ${room.RoomNumber}`}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Room {room.RoomNumber}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {room.Description || 'No description available.'}
                        </p>
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <span className="text-emerald-600 font-semibold">
                            ₹{room.PricePerNight}/night
                          </span>
                          <span className="text-gray-400">{room.Capacity} guests</span>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => router.push(`/hotels/${room.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={() => router.push(`/book/room/${room.id}`)}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                {/* ✅ Foods */}
                {activeTab === 'foods' &&
                  foods.map((food) => (
                    <motion.div
                      key={food.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border rounded-lg shadow hover:shadow-md transition-all overflow-hidden"
                    >
                      <img
                        src={food.images?.[0] || '/images/default-food.jpg'}
                        className="w-full h-40 object-cover"
                        alt={food.name}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800 capitalize">
                          {food.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {food.description || 'No description available.'}
                        </p>
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <span className="text-emerald-600 font-semibold">
                            ₹{food.price}
                          </span>
                          <span className="text-gray-400 capitalize">
                            {food.category}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => router.push(`/food/${food.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={() => router.push(`/book/food/${food.id}`)}
                          >
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>

              {/* ✅ Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={16} /> Prev
                  </Button>

                  <span className="text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
