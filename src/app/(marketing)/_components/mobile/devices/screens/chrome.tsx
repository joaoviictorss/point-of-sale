// App chrome shared by every screen: sidebar, headers, avatar, pagination, icon maps.

import {
  BanknotesIcon,
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  QrCodeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { type OwnerPage, PAY_METHODS, type PayMethod } from '../demo-data';

export type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const NAV: [OwnerPage | 'vendedores' | 'relatorios', string, Icon][] = [
  ['vendas', 'Vendas', ShoppingBagIcon],
  ['produtos', 'Produtos', ClipboardDocumentListIcon],
  ['estoque', 'Estoque', CircleStackIcon],
  ['vendedores', 'Vendedores', UserGroupIcon],
  ['relatorios', 'Relatórios', ChartPieIcon],
];

export const PAY_ICON: Record<PayMethod, Icon> = {
  CASH: BanknotesIcon,
  PIX: QrCodeIcon,
  CREDIT_CARD: CreditCardIcon,
  DEBIT_CARD: CreditCardIcon,
};

export const LIST_PAY_ICON: Record<PayMethod, Icon> = {
  ...PAY_ICON,
  PIX: CurrencyDollarIcon,
};

export const payLabel = (id: PayMethod) =>
  PAY_METHODS.find((p) => p.id === id)?.label ?? id;

export const payList = (id: PayMethod) =>
  PAY_METHODS.find((p) => p.id === id)?.list ?? id;

export const TOOLBAR: Record<
  OwnerPage,
  { search: string; filter: [Icon, string]; actions: string[] }
> = {
  vendas: {
    search: 'Pesquisar venda',
    filter: [CalendarIcon, 'Hoje'],
    actions: ['Iniciar nova venda'],
  },
  produtos: {
    search: 'Pesquisar produto',
    filter: [FunnelIcon, 'Filtrar'],
    actions: ['Cadastrar em lote', 'Criar novo produto'],
  },
  estoque: {
    search: 'Pesquisar produto',
    filter: [FunnelIcon, 'Tipo'],
    actions: ['Nova movimentação'],
  },
};

export function Thumb({ id }: { id: string }) {
  return (
    <Image
      alt=""
      className="thumb"
      height={30}
      src={`/3d/devices/produtos/${id}.png`}
      unoptimized
      width={30}
    />
  );
}

export function Avatar() {
  return (
    <span className="avatar">
      <UsersIcon className="i" />
    </span>
  );
}

export function Logo() {
  return (
    <div className="side-head">
      <Image alt="" height={34} src="/logo.png" width={34} />
      <span>
        <b>VNS - Admin</b>
        <small>Seu gerenciador de vendas</small>
      </span>
    </div>
  );
}

export function Menu({ active }: { active: string }) {
  return (
    <nav className="menu">
      {NAV.map(([id, label, Ico]) => (
        <span className={cn('menu-item', id === active && 'on')} key={id}>
          <Ico className="i" />
          {label}
        </span>
      ))}
    </nav>
  );
}

export function Pager({ label, pages }: { label: string; pages: string[] }) {
  return (
    <div className="pager">
      <span>{label}</span>
      <span className="pages">
        <span className="b">
          <ChevronLeftIcon className="i" />
        </span>
        {pages.map((p, i) => (
          <span className={i === 0 ? 'on' : undefined} key={p}>
            {p}
          </span>
        ))}
        <span className="b">
          <ChevronRightIcon className="i" />
        </span>
      </span>
    </div>
  );
}

export function PhoneHead({ title }: { title: string }) {
  return (
    <header className="head">
      <div className="left">
        <span className="menu-btn">
          <Bars3Icon className="i" />
        </span>
        <h1>{title}</h1>
      </div>
      <Avatar />
    </header>
  );
}
