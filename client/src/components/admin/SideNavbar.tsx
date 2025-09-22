import { Home, Users, Utensils, IndianRupee, ShoppingBag, Package, BarChart3, Settings, LogOut } from "lucide-react"
import api from "@/services/api"
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"


export function SideNavbar() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const res = await api.post("/admin/auth/logout");
    if (res.data.success) {
      toast.success('Log-out successfully')
      router.push("/admin/login");
    }
  };


  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 text-xl font-bold">🚚 Travel Truck</div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer bg-gray-100">
            <Home className="w-5 h-5 mr-3" /> Dashboard
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <Users className="w-5 h-5 mr-3" /> Users
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <Utensils className="w-5 h-5 mr-3" /> Restaurants
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <IndianRupee className="w-5 h-5 mr-3" /> Subscriptions
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <ShoppingBag className="w-5 h-5 mr-3" /> Orders
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <Package className="w-5 h-5 mr-3" /> Products
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <BarChart3 className="w-5 h-5 mr-3" /> Reports
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </li>
          <li className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer" onClick={()=>setShowModal(!showModal)}>
            <LogOut className="w-5 h-5 mr-3" /> LogOut
          </li>
          <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-96 relative"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                  <LogOut size={28} />
                </div>
              </div>

              {/* Title + Message */}
              <h2 className="text-xl font-semibold text-center mb-2">
                Confirm Logout
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to log out from your admin dashboard?
              </p>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-transform duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-transform duration-200 hover:scale-105"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </ul>
      </nav>
    </aside>
  )
}