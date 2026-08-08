import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const RECEIPT_LINES = [
  { left: 'w-20', right: 'w-10', delay: '0ms' },
  { left: 'w-24', right: 'w-8', delay: '160ms' },
  { left: 'w-16', right: 'w-11', delay: '320ms' },
];

type SaleReceiptProps = {
  animated?: boolean;
  badge?: React.ReactNode;
};

export const SaleReceipt = ({ animated, badge }: SaleReceiptProps) => {
  return (
    <div className="relative shrink-0">
      <div
        className="w-[226px] rounded-t-2xl bg-card px-6 pt-6 pb-2 shadow-[0_18px_44px_-16px_rgba(17,24,39,0.30)]"
        style={{ transform: 'rotate(-4deg)' }}
      >
        <div className="flex items-center gap-2.5 border-gray-300 border-b border-dashed pb-3.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-50 text-primary">
            <ShoppingBagIcon className="size-4" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground text-xs">
              VNS - Admin
            </span>
            <span className="text-[10px] text-muted-foreground">
              Comprovante de venda
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 py-4">
          {RECEIPT_LINES.map((line) => (
            <div className="flex items-center justify-between" key={line.left}>
              <span
                className={cn(
                  'h-2 rounded-full bg-gray-200',
                  line.left,
                  animated && 'animate-pulse'
                )}
                style={animated ? { animationDelay: line.delay } : undefined}
              />
              <span
                className={cn(
                  'h-2 rounded-full bg-gray-100',
                  line.right,
                  animated && 'animate-pulse'
                )}
                style={animated ? { animationDelay: line.delay } : undefined}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-gray-300 border-t border-dashed py-3.5">
          <span className="font-semibold text-muted-foreground text-xs">
            Total
          </span>
          <span className="font-bold font-mono text-muted-foreground text-sm">
            R$ —
          </span>
        </div>
      </div>

      <div
        className="mt-[11px] ml-2 h-3 w-[226px] bg-card shadow-[0_18px_30px_-18px_rgba(17,24,39,0.30)]"
        style={{
          transform: 'rotate(-184deg)',
          transformOrigin: 'top center',
          WebkitMask: 'radial-gradient(8px at 8px 0,#0000 98%,#000) repeat-x',
          mask: 'radial-gradient(8px at 8px 0,#0000 98%,#000) repeat-x',
          WebkitMaskSize: '16px 12px',
          maskSize: '16px 12px',
        }}
      />

      {badge}
    </div>
  );
};

export const RECEIPT_BADGE_CLASSNAME =
  '-top-3.5 -right-3 absolute flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_-4px_rgba(37,99,235,0.55)]';
