'use client';

import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/shadcn';
import { Calendar } from '@/components/shadcn/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/popover';
import { useSalesParams } from '@/hooks/sales/use-sales-params';
import { cn } from '@/lib/utils';
import { PAGINATION } from '@/utils/constants';
import {
  formatPeriodLabel,
  PERIOD_PRESETS,
  resolveActivePreset,
} from './period-presets';

const rangeFromParams = (
  from: Date | null,
  to: Date | null
): DateRange | undefined => (from ? { from, to: to ?? undefined } : undefined);

export const PeriodFilter = () => {
  const [params, setParams] = useSalesParams();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    rangeFromParams(params.from, params.to)
  );

  const hasFilter = Boolean(params.from || params.to);
  const activePreset = resolveActivePreset(
    range?.from ?? null,
    range?.to ?? null
  );

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // sincroniza o range pendente com o que está aplicado na URL
      setRange(rangeFromParams(params.from, params.to));
    }
    setOpen(next);
  };

  const applyPreset = (presetId: string) => {
    const preset = PERIOD_PRESETS.find((item) => item.id === presetId);
    if (preset) {
      setRange(preset.getRange());
    }
  };

  const handleApply = () => {
    setParams({
      from: range?.from ?? null,
      to: range?.to ?? range?.from ?? null,
      page: PAGINATION.DEFAULT_PAGE,
    });
    setOpen(false);
  };

  const handleClear = () => {
    setRange(undefined);
    setParams({ from: null, to: null, page: PAGINATION.DEFAULT_PAGE });
    setOpen(false);
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'gap-2 font-medium text-foreground',
            hasFilter && 'border-primary text-primary'
          )}
          type="button"
          variant="outline"
        >
          <CalendarIcon className="size-4" />
          {formatPeriodLabel(params.from, params.to)}
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          {/* presets */}
          <div className="flex min-w-[172px] flex-col gap-0.5 border-border border-b p-2 sm:border-r sm:border-b-0">
            <button
              className="rounded-md px-3 py-2 text-left text-muted-foreground text-sm transition-colors hover:bg-accent"
              onClick={handleClear}
              type="button"
            >
              Todo o período
            </button>
            {PERIOD_PRESETS.map((preset) => (
              <button
                className={cn(
                  'rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                  activePreset === preset.id
                    ? 'bg-blue-50 font-semibold text-primary hover:bg-blue-50'
                    : 'text-foreground'
                )}
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>
          {/* calendário */}
          <div className="flex flex-col">
            <Calendar mode="range" onSelect={setRange} selected={range} />
            <div className="flex items-center gap-2 border-border border-t px-3 py-2.5">
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-muted-foreground text-xs">De</span>
                <span className="rounded-md border border-input px-2.5 py-1.5 text-foreground text-sm">
                  {range?.from ? format(range.from, 'dd/MM/yyyy') : '—'}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-muted-foreground text-xs">Até</span>
                <span className="rounded-md border border-input px-2.5 py-1.5 text-foreground text-sm">
                  {range?.to ? format(range.to, 'dd/MM/yyyy') : '—'}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-border border-t px-3 py-2.5">
              <Button
                onClick={() => setOpen(false)}
                size="sm"
                type="button"
                variant="ghost"
              >
                Cancelar
              </Button>
              <Button
                disabled={!range?.from}
                onClick={handleApply}
                size="sm"
                type="button"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
