'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddPackageModal from "@/components/agency/AddPackageModal";
import { Plus, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/services/api";
import SideNavbar from "@/components/agency/SideNavbar";
import toast from "react-hot-toast";
import EditPackageModal from "@/components/agency/editPackageModal";

interface Itinerary {
  activities: string[];
  day: number;
  title: string;
}

interface Review {
  Comment: string;
  Date: string;
  Rating: number;
  UserName?: string;
}

interface Package {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  discoveries: string[];
  availableFoods: string[];
  itinerary: Itinerary[];
  reviews: Review[];
  CreatedBy: string;
  images: string[]; // ✅ Added this field
}

export default function PackageListingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const fetchPackages = async (pageNumber = 1) => {
    try {
      const { data } = await api.get(
        `/agency/package/getAllPackages?page=${pageNumber}&limit=${limit}`
      );

      console.log(data.data)
      if (!data.success) return toast.error(data.message);

      setPackages(data.data.data || []);
      setTotalPages(data.data.totalPages || 1);
      setPage(data.data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Something went wrong while fetching packages");
    }
  };

  useEffect(() => {
    fetchPackages(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Travel Packages</h1>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <Plus size={18} /> Add Package
          </Button>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden"
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
                    <CardTitle className="text-lg font-medium text-gray-800 truncate">
                      {pkg.title}
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setEditModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-gray-700 hover:bg-gray-100"
                    >
                      <Edit3 size={16} /> Edit
                    </Button>

                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{pkg.description}</p>

                  <div className="flex justify-between text-sm text-gray-700 border-t pt-3">
                    <span>Duration</span>
                    <span className="font-medium">{pkg.duration}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Price</span>
                    <span className="font-medium text-emerald-600">₹{pkg.price}</span>
                  </div>

                  {/* ✅ Discoveries */}
                  {pkg.discoveries?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">
                        Discoveries
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pkg.discoveries.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ✅ Foods */}
                  {pkg.availableFoods?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">
                        Available Foods
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pkg.availableFoods.map((food, idx) => (
                          <li key={idx}>• {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ✅ Itinerary */}
                  {pkg.itinerary?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Itinerary</h3>
                      <div className="space-y-2">
                        {pkg.itinerary.map((day, idx) => (
                          <div
                            key={idx}
                            className="border-l-2 border-blue-500 pl-3 text-sm"
                          >
                            <p className="font-medium">
                              Day {day.day}: {day.title}
                            </p>
                            <ul className="text-xs text-gray-600 ml-2">
                              {day.activities.map((act, i) => (
                                <li key={i}>• {act}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              No packages found. Add a new one to get started.
            </p>
          )}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-4">
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
      </div>

      {/* ✅ Add Package Modal */}
      {showModal && (
        <AddPackageModal
          isOpen={showModal}
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
