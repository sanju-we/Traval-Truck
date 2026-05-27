'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SideNavbar from '@/components/agency/SideNavbar';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Define routes that should NOT have a sidebar
  const noSidebarRoutes = [
    '/agency/login',
    '/agency/signup',
    '/agency/forgetPassword',
    '/agency/resetPassword',
    '/agency/success',
    '/agency/cancel',
    '/agency/restricted'
  ];

  const isNoSidebarPage = noSidebarRoutes.some(route => pathname.startsWith(route));

  if (isNoSidebarPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 sticky top-0 h-screen">
        <SideNavbar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden"
            >
              <SideNavbar onClose={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <div className="w-5 h-5 text-white flex items-center justify-center font-bold text-xs italic">TT</div>
            </div>
            <span className="font-bold text-lg text-blue-700">Travel Truck</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Content Container */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
