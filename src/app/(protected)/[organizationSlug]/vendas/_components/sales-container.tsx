'use client';

import { useRouter } from 'next/navigation';
import { EntityContainer } from '@/components/entity-components/entity-container';
import { useOrganization } from '@/contexts/organization-context';
import { SalesFilters } from './sales-filters';

export const SalesContainer = ({ children }: { children: React.ReactNode }) => {
  const { slug: organizationSlug } = useOrganization();
  const router = useRouter();

  return (
    <EntityContainer
      filters={<SalesFilters />}
      primaryActionButtonOnClick={() =>
        router.push(`/${organizationSlug}/vendas/nova`)
      }
      primaryActionButtonText="Iniciar nova venda"
    >
      {children}
    </EntityContainer>
  );
};
