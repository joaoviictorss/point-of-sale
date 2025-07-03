"use client";

import { SidebarProvider } from "@/components/Shadcn/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const onOpenChange = (value: boolean) => {
    setIsOpen(value);
  };

  return (
    <SidebarProvider onOpenChange={onOpenChange} open={isOpen}>
      <Sidebar onOpenChange={onOpenChange} isOpen={isOpen} />

      <main>{children}</main>
    </SidebarProvider>
  );
}
