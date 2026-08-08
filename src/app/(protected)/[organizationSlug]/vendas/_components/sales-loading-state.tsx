import { RECEIPT_BADGE_CLASSNAME, SaleReceipt } from './sale-receipt';

const COPY_LINES = [
  { width: 'w-full', delay: '0ms' },
  { width: 'w-[92%]', delay: '120ms' },
  { width: 'w-[70%]', delay: '240ms' },
];

export const SalesLoadingState = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-14 lg:flex-row lg:gap-16">
      <SaleReceipt
        animated
        badge={
          <div
            className={RECEIPT_BADGE_CLASSNAME}
            style={{ transform: 'rotate(-4deg)' }}
          >
            <span className="size-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
          </div>
        }
      />

      <div className="flex w-full max-w-sm flex-col items-center lg:items-start">
        <span className="h-[26px] w-36 animate-pulse rounded-full bg-blue-50" />

        <div className="mt-4 flex w-full flex-col gap-2.5">
          <span className="h-6 w-[85%] animate-pulse rounded-md bg-secondary" />
          <span
            className="h-6 w-[60%] animate-pulse rounded-md bg-secondary"
            style={{ animationDelay: '120ms' }}
          />
        </div>

        <div className="mt-4 flex w-full flex-col gap-2">
          {COPY_LINES.map((line) => (
            <span
              className={`h-3.5 animate-pulse rounded-full bg-muted ${line.width}`}
              key={line.width}
              style={{ animationDelay: line.delay }}
            />
          ))}
        </div>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
          <span className="h-9 w-40 animate-pulse rounded-md bg-blue-50" />
          <span
            className="h-9 w-40 animate-pulse rounded-md bg-muted"
            style={{ animationDelay: '160ms' }}
          />
        </div>
      </div>

      <output className="sr-only">Carregando vendas…</output>
    </div>
  );
};
