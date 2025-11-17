"use client";

import { Wallet, User, Compass, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileSidebar() {
  const router = useRouter();

  const menu = [
    { label: "Profile", icon: <User size={18} />, path: "/user/profile" },
    { label: "Wallet", icon: <Wallet size={18} />, path: "/user/wallet" },
    { label: "Trips", icon: <Compass size={18} />, path: "/user/trips" },
    { label: "Settings", icon: <Settings size={18} />, path: "/user/settings" },
  ];

  return (
    <div className="w-full md:w-56 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-base font-semibold text-gray-700 mb-3">Your Menu</h3>

      <div className="flex flex-col gap-1">
        {menu.map((item, idx) => (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className="
            flex items-center gap-3 px-3 py-2 rounded-lg 
            text-gray-700 border border-transparent
            hover:bg-emerald-50 hover:border-emerald-200 transition"
          >
            <span className="text-emerald-600">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem("userToken");
            router.push("/");
          }}
          className="
          flex items-center gap-3 px-3 py-2 rounded-lg 
          text-red-600 border border-transparent
          hover:bg-red-50 hover:border-red-200 transition mt-3"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
