import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { salesParamsLoader } from '@/hooks/sales/use-sales-params';
import { prefetchSalesFromOrganization } from '@/services/sales/prefetch';
import { HydrateClient } from '@/trpc/server';
import { SalesContainer } from './_components/sales-container';
import { SalesList } from './_components/sales-list';
import { SalesLoadingState } from './_components/sales-loading-state';

type VendasPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ organizationSlug: string }>;
};

const VendasPage = async ({ searchParams, params }: VendasPageProps) => {
  const { organizationSlug } = await params;
  const queryParams = await salesParamsLoader(searchParams);

  prefetchSalesFromOrganization({ ...queryParams, organizationSlug });

  return (
    <SalesContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<span>Error</span>}>
          <Suspense fallback={<SalesLoadingState />}>
            <SalesList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </SalesContainer>
  );
};

export default VendasPage;
