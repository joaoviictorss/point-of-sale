'use client';

import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  endOfMonth,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
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

type PeriodPreset = {
  id: string;
  label: string;
  getRange: () => { from: Date; to: Date };
};

const PERIOD_PRESETS: PeriodPreset[] = [
  {
    id: 'today',
    label: 'Hoje',
    getRange: () => {
      const today = startOfDay(new Date());
      return { from: today, to: today };
    },
  },
  {
    id: 'yesterday',
    label: 'Ontem',
    getRange: () => {
      const yesterday = startOfDay(subDays(new Date(), 1));
      return { from: yesterday, to: yesterday };
    },
  },
  {
    id: 'last7',
    label: 'Últimos 7 dias',
    getRange: () => {
      const today = startOfDay(new Date());
      return { from: startOfDay(subDays(today, 6)), to: today };
    },
  },
  {
    id: 'last30',
    label: 'Últimos 30 dias',
    getRange: () => {
      const today = startOfDay(new Date());
      return { from: startOfDay(subDays(today, 29)), to: today };
    },
  },
  {
    id: 'thisMonth',
    label: 'Este mês',
    getRange: () => {
      const now = new Date();
      return { from: startOfMonth(now), to: startOfDay(now) };
    },
  },
  {
    id: 'lastMonth',
    label: 'Mês passado',
    getRange: () => {
      const previous = subMonths(new Date(), 1);
      return {
        from: startOfMonth(previous),
        to: startOfDay(endOfMonth(previous)),
      };
    },
  },
];

const presetMatchesRange = (
  presetId: string,
  from: Date | null,
  to: Date | null
): boolean => {
  if (!(from && to)) {
    return false;
  }

  const preset = PERIOD_PRESETS.find((item) => item.id === presetId);
  if (!preset) {
    return false;
  }

  const range = preset.getRange();
  return isSameDay(range.from, from) && isSameDay(range.to, to);
};

const resolveActivePreset = (
  from: Date | null,
  to: Date | null
): string | null => {
  if (!(from && to)) {
    return null;
  }

  const matched = PERIOD_PRESETS.find((preset) =>
    presetMatchesRange(preset.id, from, to)
  );

  return matched?.id ?? 'custom';
};

const formatPeriodLabel = (
  from: Date | null,
  to: Date | null,
  presetId?: string | null
): string => {
  if (!(from || to)) {
    return 'Todo o período';
  }

  const activeId = presetId ?? resolveActivePreset(from, to);
  if (activeId && activeId !== 'custom') {
    return PERIOD_PRESETS.find((preset) => preset.id === activeId)?.label ?? '';
  }

  if (from && to) {
    return `${format(from, 'dd/MM/yyyy')} – ${format(to, 'dd/MM/yyyy')}`;
  }

  return format((from ?? to) as Date, 'dd/MM/yyyy');
};

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

  const [appliedPreset, setAppliedPreset] = useState<string | null>(() =>
    resolveActivePreset(params.from, params.to)
  );
  const [pendingPreset, setPendingPreset] = useState<string | null>(
    appliedPreset
  );

  const hasFilter = Boolean(params.from || params.to);

  const activePreset =
    appliedPreset && presetMatchesRange(appliedPreset, params.from, params.to)
      ? appliedPreset
      : resolveActivePreset(params.from, params.to);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setRange(rangeFromParams(params.from, params.to));
      setPendingPreset(activePreset);
    }
    setOpen(next);
  };

  const applyPreset = (presetId: string) => {
    const preset = PERIOD_PRESETS.find((item) => item.id === presetId);
    if (preset) {
      setRange(preset.getRange());
      setPendingPreset(presetId);
    }
  };

  const handleSelectRange = (next: DateRange | undefined) => {
    setRange(next);
    setPendingPreset(resolveActivePreset(next?.from ?? null, next?.to ?? null));
  };

  const handleApply = () => {
    setParams({
      from: range?.from ?? null,
      to: range?.to ?? range?.from ?? null,
      page: PAGINATION.DEFAULT_PAGE,
    });
    setAppliedPreset(pendingPreset);
    setOpen(false);
  };

  const handleClear = () => {
    setRange(undefined);
    setPendingPreset(null);
    setAppliedPreset(null);
    setParams({ from: null, to: null, page: PAGINATION.DEFAULT_PAGE });
    setOpen(false);
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn('gap-3', hasFilter && 'border-primary text-primary')}
          type="button"
          variant="outline"
        >
          <CalendarIcon className="size-4" />
          {formatPeriodLabel(params.from, params.to, activePreset)}
          <ChevronDownIcon className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
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
                  pendingPreset === preset.id
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
          <div className="flex flex-col">
            <Calendar
              mode="range"
              onSelect={handleSelectRange}
              selected={range}
            />
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
