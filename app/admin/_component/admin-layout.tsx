'use client';

import type { Metadata } from 'next';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type React from 'react';
import AppSidebar from './admin-sidebar';

interface AdminLayoutProps {
  metadata?: Metadata;
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider className="flex flex-1 min-h-0">
        <AppSidebar />
        <SidebarInset>
          <div className="relative w-full h-full bg-[#FAFAFA] dark:bg-[#1C1C1D] p-8 flex flex-col justify-center items-center">
            <SidebarTrigger className="absolute top-4 left-4 md:hidden" />
            <div className="container max-w-8xl">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
