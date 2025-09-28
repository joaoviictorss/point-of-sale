"use client";

import { useContext } from "react";
import { OrganizationModalContext } from "@/contexts/organization-modal-context";

export const useOrganizationModal = () => {
  const context = useContext(OrganizationModalContext);
  if (context === undefined) {
    throw new Error(
      "useOrganizationModal must be used within an OrganizationModalProvider"
    );
  }
  return context;
};
