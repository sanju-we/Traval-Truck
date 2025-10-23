"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, MapPin, Phone, Mail, Plus } from "lucide-react";
import axios from "axios";
import EditPartnerModal from "../../../components/agency/EditPartnerModal";
import AddPartnerModal from "../../../components/agency/AddPartnerModal";
import MapComponent from '@/components/Map';

interface Partner {
  _id: string;
  PartnerType: "Hotel" | "Restaurant";
  PartnerName: string;
  Status: "Active" | "Inactive" | "Pending";
  ContactPerson: string;
  Phone: number;
  Media: {
    Gallery: string[];
    Logo: string;
  };
  Details: {
    AvgPriceRange: number;
    Category: string;
    Description: string;
    Facilities: string[];
  }[];
  Email: string;
  Location: string;
}

export default function PartnerListingPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchPartners = async () => {
    try {
      const res = await axios.get("/api/partners");
      setPartners(res.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Partners</h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          Add Partner
        </Button>
      </div>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {partners.length > 0 ? (
          partners.map((partner) => (
            <Card
              key={partner._id}
              className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <img
                    src={partner.Media?.Logo || "/placeholder-logo.png"}
                    alt={partner.PartnerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{partner.PartnerName}</h2>
                    <p className="text-sm text-gray-500">{partner.PartnerType}</p>
                  </div>
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPartner(partner);
                    setShowEditModal(true);
                  }}
                >
                  <Edit3 size={16} />
                </Button>
              </CardHeader>

              <CardContent className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`font-semibold ${
                      partner.Status === "Active"
                        ? "text-green-600"
                        : partner.Status === "Pending"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {partner.Status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{partner.Location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{partner.Phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>{partner.Email}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">
            No partners found.
          </p>
        )}
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <AddPartnerModal/>
      )}

      {/* Edit Partner Modal */}
      {showEditModal && selectedPartner && (
        <EditPartnerModal
          partner={selectedPartner}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchPartners}
        />
      )}
    </div>
  );
}
