'use client';

import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';

function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <main
      className="flex-1 min-w-0 p-4 lg:p-6 transition-all duration-200 ease-out"
      style={{ marginLeft: collapsed ? '68px' : '220px' }}
    >
      <Toaster position="top-right" />
      {children}
    </main>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#ECECEE]">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
