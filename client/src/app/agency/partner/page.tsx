"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, MapPin, Phone, Mail, Plus, User } from "lucide-react";
import axios from "axios";
import EditPartnerModal from "../../../components/agency/EditPartnerModal";
import AddPartnerModal from "../../../components/agency/AddPartnerModal";
import MapComponent from '@/components/Map';
import api from "@/services/api";
import SideNavbar from "@/components/agency/SideNavbar";

interface Partner {
  id: string;
  PartnerType: "Hotel" | "Restaurant";
  partnerName: string;
  status: "Active" | "Inactive" | "Pending";
  contactPerson: string;
  phone: number;
  media: {
    Gallery: string[];
    Logo: string;
  };
  Details: {
    AvgPriceRange: number;
    Category: string;
    Description: string;
    Facilities: string[];
  }[];
  email: string;
  location: {
    coordinates:string[]
  };
}

export default function PartnerListingPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchPartners = async () => {
    try {
      const res = await api.get("/agency/partner/getAllPartners");
      console.log(res.data.data)
      setPartners(res.data.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideNavbar />

      <div className="flex-1 p-8 space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center sticky top-0 bg-gray-50 pb-4 z-10">
          <h1 className="text-3xl font-bold text-gray-800">Partners</h1>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            <Plus size={18} /> Add Partner
          </Button>
        </div>

        {/* Partner Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.length > 0 ? (
            partners.map((partner) => (
              <Card
                key={partner.id}
                className="rounded-2xl shadow-sm border border-gray-200 bg-white hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3">
                    <img
                      src={partner.media?.Logo || "/images/profile.jpeg"}
                      alt={partner.partnerName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{partner.partnerName}</h2>
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

                <CardContent className="text-sm text-gray-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        partner.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : partner.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {partner.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={14} /> {partner.contactPerson}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} /> {partner.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 truncate">
                    <Mail size={14} /> {partner.email}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl shadow-sm">
              <img src="/images/empty.svg" alt="No Partners" className="w-40 mb-4 opacity-80" />
              <h3 className="text-gray-700 font-semibold mb-2">No Partners Yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start by adding your first partner.</p>
              <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white">
                <Plus size={16} className="mr-1" /> Add Partner
              </Button>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddPartnerModal
            onClose={() => setShowAddModal(false)}
            onAdd={fetchPartners}
          />
        )}

        {showEditModal && selectedPartner && (
          <EditPartnerModal
            partner={selectedPartner}
            onClose={() => setShowEditModal(false)}
            onUpdate={fetchPartners}
          />
        )}
      </div>
    </div>
  );
}
