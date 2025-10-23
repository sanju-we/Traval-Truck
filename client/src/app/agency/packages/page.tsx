"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit3 } from "lucide-react";
import axios from "axios";
// import AddPackageModal from "./AddPackageModal"; // your existing modal component

interface Package {
  _id: string;
  Title: string;
  Duration: string;
  Price: number;
  Description: string;
  hotels: {
    Description: string;
    Image: string;
    Name: string;
    id: string;
  }[];
  Discoveries: string[];
  dining: {
    Cuisine: string;
    Image: string;
    Name: string;
  }[];
  AvailableFoods: string[];
  itinerary: {
    Activities: string[];
    Day: number;
    Title: string;
  }[];
  reviews: {
    Comment: string;
    Date: string;
    Rating: number;
    UserName: string;
  }[];
  CreatedBy: string;
}

export default function PackageListingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await axios.get("/api/packages");
      setPackages(res.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Travel Packages</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus size={18} /> Add New Package
        </Button>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <Card key={pkg._id} className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{pkg.Title}</span>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Edit3 size={16} /> Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-3">{pkg.Description}</p>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Duration:</span>
                  <span className="font-medium">{pkg.Duration}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Price:</span>
                  <span className="font-medium">₹{pkg.Price}</span>
                </div>

                {pkg.hotels && pkg.hotels.length > 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={pkg.hotels[0].Image}
                      alt={pkg.hotels[0].Name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{pkg.hotels[0].Name}</p>
                      <p className="text-xs text-gray-500">Partner Hotel</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">No packages found. Add a new one!</p>
        )}
      </div>

      {/* Add Package Modal */}
      {/* {showModal && <AddPackageModal onClose={() => setShowModal(false)} onPackageAdded={fetchPackages} />} */}
    </div>
  );
}
