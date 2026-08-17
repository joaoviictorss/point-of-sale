import { productTypeOptions, stockUnitOptions } from '@/utils/constants';
import { type ProductFormSchema, productFormSchema } from './schemas';

const DIACRITICS_PATTERN = /[\u0300-\u036f]/g;

const HEADER_ALIASES: Record<string, keyof ProductFormSchema> = {
  codigo: 'code',
  code: 'code',
  nome: 'name',
  'nome do produto': 'name',
  produto: 'name',
  categoria: 'category',
  'tipo de produto': 'productType',
  tipo: 'productType',
  'preco de custo': 'costPrice',
  custo: 'costPrice',
  'preco de venda': 'salePrice',
  venda: 'salePrice',
  preco: 'salePrice',
  estoque: 'stock',
  'estoque atual': 'stock',
  quantidade: 'stock',
  unidade: 'stockUnit',
  'unidade de estoque': 'stockUnit',
  'unidade de medida': 'stockUnit',
  'estoque minimo': 'minStock',
  'estoque maximo': 'maxStock',
};

function normalizeHeaderKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(DIACRITICS_PATTERN, '')
    .trim()
    .toLowerCase();
}

function normalizeImportHeaders(
  row: Record<string, unknown>
): Partial<Record<keyof ProductFormSchema, unknown>> {
  const normalized: Partial<Record<keyof ProductFormSchema, unknown>> = {};

  for (const [header, value] of Object.entries(row)) {
    const key = HEADER_ALIASES[normalizeHeaderKey(header)];
    if (key) {
      normalized[key] = value;
    }
  }

  return normalized;
}

const INVALID = Symbol('invalid');

function parseCurrencyCell(
  value: unknown
): number | undefined | typeof INVALID {
  if (value === null || value === undefined || value === '') {
    return;
  }
  if (typeof value === 'number') {
    return Math.round(value * 100);
  }

  const str = String(value).trim();
  if (str === '') {
    return;
  }

  let cleaned = str.replace(/[^\d,.-]/g, '');
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? INVALID : Math.round(num * 100);
}

function parseNumberCell(value: unknown): number | undefined | typeof INVALID {
  if (value === null || value === undefined || value === '') {
    return;
  }
  if (typeof value === 'number') {
    return value;
  }

  const str = String(value).trim().replace(',', '.');
  if (str === '') {
    return;
  }

  const num = Number.parseFloat(str);
  return Number.isNaN(num) ? INVALID : num;
}

function parseEnumCell(
  value: unknown,
  options: { label: string; value: string }[]
): string | undefined | typeof INVALID {
  if (value === null || value === undefined) {
    return;
  }

  const str = String(value).trim();
  if (str === '') {
    return;
  }

  const normalized = normalizeHeaderKey(str);
  const match = options.find(
    (option) =>
      option.value.toLowerCase() === str.toLowerCase() ||
      normalizeHeaderKey(option.label) === normalized
  );

  return match ? match.value : INVALID;
}

export type ImportRowResult = {
  rowNumber: number;
  data: ProductFormSchema;
  status: 'valid' | 'invalid';
  errors: Partial<Record<keyof ProductFormSchema, string>>;
};

type FieldResult<T> = readonly [T, string | undefined];

function requiredText(
  value: unknown,
  requiredMessage: string
): FieldResult<string> {
  const str = value == null ? '' : String(value).trim();
  return [str, str ? undefined : requiredMessage];
}

function requiredEnum(
  raw: unknown,
  options: { label: string; value: string }[],
  requiredMessage: string,
  fieldLabel: string
): FieldResult<string | undefined> {
  const parsed = parseEnumCell(raw, options);
  if (parsed === undefined) {
    return [undefined, requiredMessage];
  }
  if (parsed === INVALID) {
    return [undefined, `Valor "${raw}" não reconhecido para ${fieldLabel}`];
  }
  return [parsed, undefined];
}

function requiredCurrency(
  raw: unknown,
  requiredMessage: string,
  invalidMessage: string
): FieldResult<number | undefined> {
  const parsed = parseCurrencyCell(raw);
  if (parsed === undefined) {
    return [undefined, requiredMessage];
  }
  if (parsed === INVALID) {
    return [undefined, invalidMessage];
  }
  return [parsed, undefined];
}

function optionalCurrency(
  raw: unknown,
  invalidMessage: string
): FieldResult<number | undefined> {
  const parsed = parseCurrencyCell(raw);
  return parsed === INVALID ? [undefined, invalidMessage] : [parsed, undefined];
}

function optionalNumber(
  raw: unknown,
  invalidMessage: string
): FieldResult<number | undefined> {
  const parsed = parseNumberCell(raw);
  return parsed === INVALID ? [undefined, invalidMessage] : [parsed, undefined];
}

function collectErrors(
  entries: [keyof ProductFormSchema, string | undefined][]
): Partial<Record<keyof ProductFormSchema, string>> {
  const errors: Partial<Record<keyof ProductFormSchema, string>> = {};
  for (const [field, message] of entries) {
    if (message) {
      errors[field] = message;
    }
  }
  return errors;
}

export function parseImportRow(
  rawRow: Record<string, unknown>,
  rowNumber: number
): ImportRowResult {
  const normalized = normalizeImportHeaders(rawRow);

  const [code, codeError] = requiredText(
    normalized.code,
    'Código é obrigatório'
  );
  const [name, nameError] = requiredText(
    normalized.name,
    'Nome do produto é obrigatório'
  );
  const [category, categoryError] = requiredText(
    normalized.category,
    'Categoria é obrigatória'
  );
  const [productType, productTypeError] = requiredEnum(
    normalized.productType,
    productTypeOptions,
    'Tipo de produto é obrigatório',
    'tipo de produto'
  );
  const [stockUnit, stockUnitError] = requiredEnum(
    normalized.stockUnit,
    stockUnitOptions,
    'Unidade de estoque é obrigatória',
    'unidade de estoque'
  );
  const [costPrice, costPriceError] = optionalCurrency(
    normalized.costPrice,
    'Preço de custo precisa ser um número'
  );
  const [salePrice, salePriceError] = requiredCurrency(
    normalized.salePrice,
    'Informe o preço de venda',
    'Preço de venda precisa ser um número'
  );
  const [stock, stockError] = optionalNumber(
    normalized.stock,
    'Estoque precisa ser um número'
  );
  const [minStock, minStockError] = optionalNumber(
    normalized.minStock,
    'Estoque mínimo precisa ser um número'
  );
  const [maxStock, maxStockError] = optionalNumber(
    normalized.maxStock,
    'Estoque máximo precisa ser um número'
  );

  const errors = collectErrors([
    ['code', codeError],
    ['name', nameError],
    ['category', categoryError],
    ['productType', productTypeError],
    ['stockUnit', stockUnitError],
    ['costPrice', costPriceError],
    ['salePrice', salePriceError],
    ['stock', stockError],
    ['minStock', minStockError],
    ['maxStock', maxStockError],
  ]);

  const candidate = {
    code,
    name,
    category,
    productType,
    costPrice,
    salePrice,
    stock,
    stockUnit,
    minStock,
    maxStock,
    medias: [] as string[],
  };

  const result = productFormSchema.safeParse(candidate);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ProductFormSchema | undefined;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  const data = (result.success ? result.data : candidate) as ProductFormSchema;

  return {
    rowNumber,
    data,
    status: Object.keys(errors).length === 0 ? 'valid' : 'invalid',
    errors,
  };
}
