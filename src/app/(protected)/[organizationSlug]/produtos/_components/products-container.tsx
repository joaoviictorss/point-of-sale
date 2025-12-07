"use client";

import { useRouter } from "next/navigation";
import { EntityContainer } from "@/components/entity-components/entity-container";
import { useOrganization } from "@/contexts/organization-context";
import { ProductsFilters } from "./products-filters";

export const ProductsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { slug: organizationSlug } = useOrganization();
  const router = useRouter();

  return (
    <EntityContainer
      createButtonOnClick={() =>
        router.push(`/${organizationSlug}/produtos/novo`)
      }
      createButtonText="Criar novo produto"
      filters={<ProductsFilters />}
    >
      {children}
    </EntityContainer>
  );
};
