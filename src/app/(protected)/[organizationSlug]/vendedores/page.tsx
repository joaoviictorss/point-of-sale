import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { sellersParamsLoader } from '@/hooks/seller/use-sellers-params';
import { prefetchSellersFromOrganization } from '@/services/seller/prefetch';
import { HydrateClient } from '@/trpc/server';
import { SellersContainer } from './_components/sellers-container';
import { SellersList } from './_components/sellers-list';

type SellersPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ organizationSlug: string }>;
};

const SellersPage = async ({ searchParams, params }: SellersPageProps) => {
  const { organizationSlug } = await params;
  const queryParams = await sellersParamsLoader(searchParams);

  prefetchSellersFromOrganization({ ...queryParams, organizationSlug });

  return (
    <SellersContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<span>Error</span>}>
          <Suspense fallback={<SellersList isLoading={true} />}>
            <SellersList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </SellersContainer>
  );
};

export default SellersPage;
