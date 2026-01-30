'use client';

import { Plane, Mail, Phone, MapPin } from 'lucide-react';

export default function VendorFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Plane className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Travel Truck
            </h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            A unified platform for agencies, hotels, and restaurants to manage
            bookings, services, and business growth efficiently.
          </p>
        </div>

        {/* Vendor Panels */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Vendor Panels</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-emerald-600 cursor-pointer">Agency Dashboard</li>
            <li className="hover:text-emerald-600 cursor-pointer">Hotel Dashboard</li>
            <li className="hover:text-emerald-600 cursor-pointer">Restaurant Dashboard</li>
            <li className="hover:text-emerald-600 cursor-pointer">Subscription Plans</li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Support & Legal</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-emerald-600 cursor-pointer">Help Center</li>
            <li className="hover:text-emerald-600 cursor-pointer">Vendor Guidelines</li>
            <li className="hover:text-emerald-600 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-emerald-600 cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              support@traveltruck.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500 bg-white">
        © {new Date().getFullYear()} Travel Truck. All rights reserved.
      </div>
    </footer>
  );
}
