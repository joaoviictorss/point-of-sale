"use client";

import { createContext, useContext } from "react";

type OrganizationContextType = {
  slug: string;
};

const OrganizationContext = createContext<OrganizationContextType | null>(null);

interface OrganizationProviderProps {
  children: React.ReactNode;
  slug: string;
}

export function OrganizationProvider({
  children,
  slug,
}: OrganizationProviderProps) {
  return (
    <OrganizationContext.Provider value={{ slug }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextType {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }

  return context;
}
