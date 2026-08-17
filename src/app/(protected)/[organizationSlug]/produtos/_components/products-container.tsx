'use client';

import { useRouter } from 'next/navigation';
import { EntityContainer } from '@/components/entity-components/entity-container';
import { useOrganization } from '@/contexts/organization-context';
import { ProductsFilters } from './products-filters';

export const ProductsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { slug: organizationSlug } = useOrganization();
  const router = useRouter();

  return (
    <EntityContainer
      filters={<ProductsFilters />}
      primaryActionButtonOnClick={() =>
        router.push(`/${organizationSlug}/produtos/novo`)
      }
      primaryActionButtonText="Criar novo produto"
      secondaryActionButtonOnClick={() =>
        router.push(`/${organizationSlug}/produtos/cadastro-em-lote`)
      }
      secondaryActionButtonText="Cadastrar em lote"
    >
      {children}
    </EntityContainer>
  );
};
