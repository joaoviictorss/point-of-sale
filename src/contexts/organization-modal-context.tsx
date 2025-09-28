"use client";

import { createContext } from "react";

interface OrganizationModalContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const OrganizationModalContext = createContext<
  OrganizationModalContextType | undefined
>(undefined);
