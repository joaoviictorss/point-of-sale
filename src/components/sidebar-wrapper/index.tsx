'use client';

import { useState } from 'react';
import { SidebarProvider } from '@/components/Shadcn/sidebar';
import { Sidebar } from '@/components/sidebar';

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarProvider onOpenChange={setIsOpen} open={isOpen}>
      <Sidebar isOpen={isOpen} onOpenChange={setIsOpen} />
      {children}
    </SidebarProvider>
  );
}
