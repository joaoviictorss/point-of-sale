import { useQueryStates } from 'nuqs';
import {
  createLoader,
  createParser,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';
import { PAGINATION } from '@/utils/constants';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parser date-only (YYYY-MM-DD) que trabalha em horário **local**, ao contrário
 * do `parseAsIsoDate` do nuqs (que interpreta como meia-noite UTC). Isso mantém
 * a URL, o calendário, os presets e o backend no mesmo dia-calendário — sem o
 * off-by-one de fuso (ex.: em UTC-3, `2026-07-04` virava 03/07 e o preset "Hoje"
 * casava como "Ontem").
 */
const parseAsLocalIsoDate = createParser({
  parse(value: string) {
    const match = ISO_DATE_PATTERN.exec(value);
    if (!match) {
      return null;
    }
    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  },
  serialize(value: Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  eq(a: Date, b: Date) {
    return a.getTime() === b.getTime();
  },
});

export const salesParams = {
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({
      clearOnDefault: true,
    }),
  search: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
  }),
  // filtro de período (date-only local na URL, ex.: ?from=2024-06-01&to=2024-06-07)
  from: parseAsLocalIsoDate,
  to: parseAsLocalIsoDate,
};

export const useSalesParams = () => {
  return useQueryStates(salesParams);
};

export const salesParamsLoader = createLoader(salesParams);
