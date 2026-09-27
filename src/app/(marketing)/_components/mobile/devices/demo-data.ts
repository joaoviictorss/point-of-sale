// Demo catalogue and records for the devices showcase. Same items and prices the landing uses
// elsewhere (sale #0143), and the same rules as the app (stock badges, order numbers).

export type Device = 'phone' | 'laptop';
export type OwnerPage = 'vendas' | 'produtos' | 'estoque';
export type PayMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export type Product = {
  id: string;
  name: string;
  code: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
};

export type Sale = {
  n: number;
  customer: string | null;
  seller: string;
  total: number;
  pay: PayMethod;
  at: Date;
};

export type Movement = {
  id: number;
  product: string;
  type: 'Venda' | 'Entrada';
  qty: number;
  detail: string;
  user: string;
  at: Date;
  fresh?: boolean;
};

export const SELLERS: Record<Device, string> = {
  phone: 'Ana Souza',
  laptop: 'João Victor',
};

export const CATALOG: Product[] = [
  {
    id: 'camiseta',
    name: 'Camiseta Básica Algodão',
    code: '7890005556667',
    category: 'Vestuário',
    cost: 1450,
    price: 3990,
    stock: 12,
    minStock: 3,
  },
  {
    id: 'caderno',
    name: 'Caderno Universitário',
    code: '7890002223334',
    category: 'Papelaria',
    cost: 900,
    price: 1990,
    stock: 2,
    minStock: 3,
  },
  {
    id: 'vinho',
    name: 'Vinho Tinto Reserva',
    code: '7890009990001',
    category: 'Bebidas',
    cost: 2500,
    price: 5990,
    stock: 30,
    minStock: 5,
  },
  {
    id: 'cafe',
    name: 'Café em Grãos Torrado',
    code: '7890001112223',
    category: 'Mercearia',
    cost: 1200,
    price: 2500,
    stock: 15,
    minStock: 4,
  },
  {
    id: 'carregador',
    name: 'Carregador USB-C 20W',
    code: '7896541237890',
    category: 'Eletrônicos',
    cost: 1800,
    price: 3990,
    stock: 4,
    minStock: 3,
  },
  {
    id: 'fone',
    name: 'Fone de Ouvido Bluetooth',
    code: '7891234567890',
    category: 'Eletrônicos',
    cost: 4500,
    price: 9990,
    stock: 25,
    minStock: 5,
  },
];

/** What the story sells, and how a person types it: the start of the product name. */
export const STORY_ITEMS: [id: string, query: string][] = [
  ['vinho', 'vinho'],
  ['cafe', 'café'],
  ['carregador', 'carreg'],
];

export const PAY_METHODS: { id: PayMethod; label: string; list: string }[] = [
  { id: 'CASH', label: 'Dinheiro', list: 'Dinheiro' },
  { id: 'PIX', label: 'Pix', list: 'Pix' },
  { id: 'CREDIT_CARD', label: 'Crédito', list: 'Cartão de crédito' },
  { id: 'DEBIT_CARD', label: 'Débito', list: 'Cartão de débito' },
];

export const PAGE_TITLE: Record<OwnerPage, string> = {
  vendas: 'Suas vendas',
  produtos: 'Seus produtos',
  estoque: 'Seu estoque',
};

export function initialSales(now: Date): Sale[] {
  const ago = (m: number) => new Date(now.getTime() - m * 60_000);
  const yesterday = new Date(now.getTime() - 86_400_000);
  yesterday.setHours(18, 40);
  return [
    {
      n: 143,
      customer: 'Mariana Lima',
      seller: 'Ana Souza',
      total: 8990,
      pay: 'CREDIT_CARD',
      at: ago(9),
    },
    {
      n: 142,
      customer: null,
      seller: 'João Victor',
      total: 4500,
      pay: 'CASH',
      at: ago(38),
    },
    {
      n: 141,
      customer: 'Carlos Mendes',
      seller: 'Ana Souza',
      total: 21_970,
      pay: 'PIX',
      at: ago(154),
    },
    {
      n: 140,
      customer: null,
      seller: 'João Victor',
      total: 3990,
      pay: 'DEBIT_CARD',
      at: ago(221),
    },
    {
      n: 139,
      customer: 'Beatriz Rocha',
      seller: 'Ana Souza',
      total: 6490,
      pay: 'PIX',
      at: yesterday,
    },
  ];
}

export function initialMoves(now: Date): Movement[] {
  const ago = (m: number) => new Date(now.getTime() - m * 60_000);
  return [
    {
      id: 1,
      product: 'camiseta',
      type: 'Venda',
      qty: -1,
      detail: 'Venda #143',
      user: 'Ana Souza',
      at: ago(9),
    },
    {
      id: 2,
      product: 'fone',
      type: 'Venda',
      qty: -1,
      detail: 'Venda #143',
      user: 'Ana Souza',
      at: ago(9),
    },
    {
      id: 3,
      product: 'cafe',
      type: 'Venda',
      qty: -2,
      detail: 'Venda #142',
      user: 'João Victor',
      at: ago(38),
    },
    {
      id: 4,
      product: 'vinho',
      type: 'Venda',
      qty: -1,
      detail: 'Venda #141',
      user: 'Ana Souza',
      at: ago(154),
    },
    {
      id: 5,
      product: 'caderno',
      type: 'Entrada',
      qty: 10,
      detail: 'Reposição do fornecedor',
      user: 'João Victor',
      at: ago(190),
    },
  ];
}

const pad = (n: number, len: number) => String(n).padStart(len, '0');

export const brl = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const orderLabel = (n: number) => `#${pad(n, 3)}`;
export const orderNumber = (n: number) => pad(n, 4);
export const hhmm = (d: Date) =>
  `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}`;
export const ddmmyy = (d: Date) =>
  `${pad(d.getDate(), 2)}/${pad(d.getMonth() + 1, 2)}/${String(d.getFullYear()).slice(2)}`;

/** "Hoje - 14:32" / "Ontem - 18:40", like the sales list. */
export function saleWhen(d: Date, now: Date) {
  const day = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86_400_000);
  if (diff <= 0) {
    return `Hoje - ${hhmm(d)}`;
  }
  if (diff === 1) {
    return `Ontem - ${hhmm(d)}`;
  }
  return `${d.toLocaleDateString('pt-BR')} - ${hhmm(d)}`;
}

type StockBadge = {
  label: string;
  tone: 'success' | 'warning' | 'destructive';
};

/** Same thresholds as the products list in the app. */
export function stockStatus(
  p: Pick<Product, 'stock' | 'minStock'>
): StockBadge {
  if (p.stock <= p.minStock) {
    return { label: 'Repor agora', tone: 'destructive' };
  }
  if (p.minStock > 0 && p.stock <= p.minStock * 2) {
    return { label: 'Estoque baixo', tone: 'warning' };
  }
  return { label: 'Em estoque', tone: 'success' };
}

const MAX_MATCHES = 6;

/** Search ranking of the new-sale screen: exact code, code prefix, code substring, then name. */
export function matchProducts(products: Product[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [];
  }
  const rank = (p: Product) => {
    if (p.code === q) {
      return 0;
    }
    if (p.code.startsWith(q)) {
      return 1;
    }
    if (p.code.includes(q)) {
      return 2;
    }
    return p.name.toLowerCase().includes(q) ? 3 : 9;
  };
  return products
    .filter((p) => rank(p) < 9)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, MAX_MATCHES);
}
