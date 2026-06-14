'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import AddPackageModal from "@/components/agency/AddPackageModal";
import { Plus, Edit3, ChevronLeft, ChevronRight, Search, SlidersHorizontal, ArrowUpDown, Tag } from "lucide-react";
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';
import toast from "react-hot-toast";
import EditPackageModal from "@/components/agency/editPackageModal";
import { Packages } from "@/types/agency";
import { ApiResponse } from "@/services/api.service";
import VendorFooter from "@/components/shared/Footer";
import TravelTruckLoading from "@/components/shared/TravelTruckLoading";

export default function PackageListingPage() {
  const [packages, setPackages] = useState<Packages[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Packages | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('title_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const fetchPackages = async (
    page = 1,
    search = searchTerm,
    price = priceFilter,
    duration = durationFilter,
    sort = sortBy
  ) => {
    try {
      setLoading(true);
      const res = await AGENCY_API_METHODS.getAll({
        page,
        limit: itemsPerPage,
        search: search || undefined,
        price: price !== 'All' ? price : undefined,
        duration: duration !== 'All' ? duration : undefined,
        sortBy: sort
      }) as ApiResponse<{ data: Packages[]; totalPages?: number; total?: number }>;
      if (res && res.success && res.data) {
        setPackages(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.total || 0);
        setCurrentPage(page);
      } else {
        toast.error('Failed to load packages');
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Something went wrong while fetching packages");
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceFilter, durationFilter, sortBy]);

  // Debounced/Reactive fetch when filters or page change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPackages(currentPage, searchTerm, priceFilter, durationFilter, sortBy);
    }, 300);
    return () => clearTimeout(handler);
  }, [currentPage, searchTerm, priceFilter, durationFilter, sortBy]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentPackages = packages;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <TravelTruckLoading />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Travel Packages</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, search, and organize all travel itineraries</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          <Plus size={18} /> Add Package
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title, description or discoveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <SlidersHorizontal size={14} />
            <span>Filters:</span>
          </div>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="All">All Prices</option>
            <option value="under_5k">Under ₹5,000</option>
            <option value="5k_15k">₹5,000 - ₹15,000</option>
            <option value="over_15k">Over ₹15,000</option>
          </select>

          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="All">All Durations</option>
            <option value="short">1 - 3 Days</option>
            <option value="medium">4 - 7 Days</option>
            <option value="long">Over 7 Days</option>
          </select>

          <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1" />

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <ArrowUpDown size={14} />
            <span>Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="title_asc">Title: A - Z</option>
            <option value="title_desc">Title: Z - A</option>
            <option value="price_asc">Price: Low - High</option>
            <option value="price_desc">Price: High - Low</option>
          </select>
        </div>
      </div>

      {/* Package Cards */}
      {currentPackages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className="border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full bg-white"
            >
              <div className="relative w-full h-48 bg-gray-100">
                <img
                  src={pkg.images?.[0] || "/images/default-package.jpg"}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium text-gray-800 truncate flex-1 mr-2" title={pkg.title}>
                    {pkg.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setEditModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-gray-700 hover:bg-gray-100 shrink-0"
                  >
                    <Edit3 size={16} /> Edit
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{pkg.description}</p>

                  <div className="flex justify-between text-sm text-gray-700 border-t pt-3">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium">{pkg.duration}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-700">
                    <span className="text-gray-500">Price</span>
                    <span className="font-semibold text-emerald-600">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>

                  {/* ✅ Discoveries */}
                  {pkg.discoveries?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Discoveries
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pkg.discoveries.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="truncate">• {item}</li>
                        ))}
                        {pkg.discoveries.length > 3 && (
                          <li className="text-xs text-blue-500 font-medium">+ {pkg.discoveries.length - 3} more discoveries</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* ✅ Foods */}
                  {pkg.availableFoods?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Available Foods
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pkg.availableFoods.slice(0, 3).map((food, idx) => (
                          <li key={idx} className="truncate">• {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ✅ Itinerary summary */}
                {pkg.itinerary?.length > 0 && (
                  <div className="border-t pt-3 mt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Itinerary Schedule</h3>
                    <div className="space-y-2">
                      {pkg.itinerary.slice(0, 2).map((day, idx) => (
                        <div
                          key={idx}
                          className="border-l-2 border-blue-500 pl-3 text-xs"
                        >
                          <p className="font-medium text-gray-700">
                            Day {day.day}: {day.title}
                          </p>
                        </div>
                      ))}
                      {pkg.itinerary.length > 2 && (
                        <p className="text-[11px] text-blue-500 font-medium pl-3 border-l-2 border-transparent">
                          + {pkg.itinerary.length - 2} more days...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto mt-8">
          <Tag className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700">No matching packages</h3>
          <p className="text-gray-500 text-sm mt-2">
            No packages matched your search or filters. Please adjust your criteria or add a new package.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setPriceFilter('All');
              setDurationFilter('All');
              setSortBy('title_asc');
            }}
            className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-4 py-2 border rounded-lg transition-all"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-10">
          <p className="text-sm text-gray-600 font-medium">
            Showing {packages.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} packages
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 border rounded-lg text-sm transition-colors"
            >
              <ChevronLeft size={16} /> Prev
            </Button>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm border border-blue-100 flex items-center justify-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 border rounded-lg text-sm transition-colors"
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
      <VendorFooter />

      {showModal && (
        <AddPackageModal
          onClose={() => setShowModal(false)}
          onAdd={fetchPackages}
          setPackages={setPackages}
        />
      )}
      {editModalOpen && selectedPackage && (
        <EditPackageModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={fetchPackages}
          pkg={selectedPackage}
        />
      )}
    </div>
  );
}
