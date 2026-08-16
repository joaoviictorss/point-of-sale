import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { stockMovementsParamsLoader } from '@/hooks/stock/use-stock-movements-params';
import { prefetchStockMovementsFromOrganization } from '@/services/stock/prefetch';
import { HydrateClient } from '@/trpc/server';
import { StockContainer } from './_components/stock-container';
import { StockMovementsList } from './_components/stock-movements-list';

type StockPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ organizationSlug: string }>;
};

const StockPage = async ({ searchParams, params }: StockPageProps) => {
  const { organizationSlug } = await params;
  const queryParams = await stockMovementsParamsLoader(searchParams);

  prefetchStockMovementsFromOrganization({
    organizationSlug,
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    productId: queryParams.productId ?? undefined,
    type: queryParams.type ?? undefined,
  });

  return (
    <StockContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<span>Error</span>}>
          <Suspense fallback={<StockMovementsList isLoading={true} />}>
            <StockMovementsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </StockContainer>
  );
};

export default StockPage;
