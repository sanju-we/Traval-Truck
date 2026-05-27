'use client';

import { usePathname } from 'next/navigation';
import { SideNavbar } from '@/components/admin/SideNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noSidebarRoutes = [
    '/admin/login',
  ];

  const isNoSidebarPage = noSidebarRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  if (isNoSidebarPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar active="Dashboard" />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
