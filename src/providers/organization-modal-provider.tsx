"use client";

import { type ReactNode, useState } from "react";
import { OrganizationModalContext } from "@/contexts/organization-modal-context";

interface OrganizationModalProviderProps {
  children: ReactNode;
}

export function OrganizationModalProvider({
  children,
}: OrganizationModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <OrganizationModalContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
    </OrganizationModalContext.Provider>
  );
}
