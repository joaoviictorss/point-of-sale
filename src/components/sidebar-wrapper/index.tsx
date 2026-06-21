'use client';

import { SidebarProvider } from '@/components/shadcn/sidebar';
import { Sidebar } from '@/components/sidebar';

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      {children}
    </SidebarProvider>
  );
}
