import {
  endOfMonth,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';

export type PeriodRange = { from: Date; to: Date };

export type PeriodPreset = {
  id: string;
  label: string;
  getRange: () => PeriodRange;
};

// Todos os ranges são normalizados para o início do dia (date-only); o backend
// aplica o fim do dia no limite `to`.
export const PERIOD_PRESETS: PeriodPreset[] = [
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

// Presets exibidos como chips de atalho acima da listagem (Frame 3).
export const CHIP_PRESET_IDS = [
  'today',
  'yesterday',
  'last7',
  'last30',
  'thisMonth',
] as const;

export const CHIP_PRESETS = PERIOD_PRESETS.filter((preset) =>
  (CHIP_PRESET_IDS as readonly string[]).includes(preset.id)
);

/**
 * Retorna o id do preset que casa exatamente com o range atual, `'custom'` se
 * há um range que não bate com nenhum preset, ou `null` quando não há filtro.
 */
export const resolveActivePreset = (
  from: Date | null,
  to: Date | null
): string | null => {
  if (!(from && to)) {
    return null;
  }

  const matched = PERIOD_PRESETS.find((preset) => {
    const range = preset.getRange();
    return isSameDay(range.from, from) && isSameDay(range.to, to);
  });

  return matched?.id ?? 'custom';
};

/** Texto exibido no pill do filtro. */
export const formatPeriodLabel = (
  from: Date | null,
  to: Date | null
): string => {
  if (!(from || to)) {
    return 'Todo o período';
  }

  const presetId = resolveActivePreset(from, to);
  if (presetId && presetId !== 'custom') {
    return PERIOD_PRESETS.find((preset) => preset.id === presetId)?.label ?? '';
  }

  if (from && to) {
    return `${format(from, 'dd/MM/yyyy')} – ${format(to, 'dd/MM/yyyy')}`;
  }

  return format((from ?? to) as Date, 'dd/MM/yyyy');
};
