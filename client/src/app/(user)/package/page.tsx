'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import { useRouter } from 'next/navigation';

interface Package {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  imageUrl?: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  const itemsPerPage = 6; // adjust how many packages per page

  useEffect(() => {
    fetchPackages(currentPage);
  }, [currentPage]);

  const fetchPackages = async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/user/packages/getAll?page=${page}&limit=${itemsPerPage}`);
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
                onClick={()=>router.push(`/package/${pkg.id}`)}
              >
                <img
                  src={pkg.imageUrl || '/images/default.jpg'}
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
