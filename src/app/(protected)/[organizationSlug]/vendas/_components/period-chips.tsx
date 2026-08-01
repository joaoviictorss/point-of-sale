'use client';

import { useSalesParams } from '@/hooks/sales/use-sales-params';
import { cn } from '@/lib/utils';
import { PAGINATION } from '@/utils/constants';
import { CHIP_PRESETS, resolveActivePreset } from './period-presets';

export const PeriodChips = () => {
  const [params, setParams] = useSalesParams();
  const activePreset = resolveActivePreset(params.from, params.to);

  return (
    <div className="flex flex-wrap gap-2">
      {CHIP_PRESETS.map((preset) => {
        const isActive = activePreset === preset.id;

        const handleClick = () => {
          if (isActive) {
            setParams({ from: null, to: null, page: PAGINATION.DEFAULT_PAGE });
            return;
          }
          const range = preset.getRange();
          setParams({
            from: range.from,
            to: range.to,
            page: PAGINATION.DEFAULT_PAGE,
          });
        };

        return (
          <button
            className={cn(
              'inline-flex h-8 items-center rounded-full border px-3.5 font-medium text-sm transition-colors',
              isActive
                ? 'border-blue-100 bg-blue-50 text-primary'
                : 'border-border bg-card text-foreground hover:bg-accent'
            )}
            key={preset.id}
            onClick={handleClick}
            type="button"
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};
