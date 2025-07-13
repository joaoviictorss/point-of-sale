"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/Shadcn/sidebar";
import { Sidebar } from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const onOpenChange = (value: boolean) => {
    setIsOpen(value);
  };

  return (
    <SidebarProvider onOpenChange={onOpenChange} open={isOpen}>
      <Sidebar isOpen={isOpen} onOpenChange={onOpenChange} />

      <main>{children}</main>
    </SidebarProvider>
  );
}
