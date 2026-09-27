// Owner screens: sales list, products and stock movements, as tables (notebook) or cards (phone).

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  brl,
  ddmmyy,
  hhmm,
  type OwnerPage,
  orderLabel,
  PAGE_TITLE,
  saleWhen,
  stockStatus,
} from '../demo-data';
import {
  Avatar,
  LIST_PAY_ICON,
  Logo,
  Menu,
  Pager,
  PhoneHead,
  payList,
  Thumb,
  TOOLBAR,
} from './chrome';
import type { ViewProps } from './view';

function SalesTable({ view }: ViewProps) {
  const s = view.state;
  const { fx } = view;
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Venda</th>
            <th className="w-full">Cliente</th>
            <th>Vendedor</th>
            <th className="r">Total</th>
            <th>Método de pagamento</th>
            <th>Data e hora</th>
          </tr>
        </thead>
        <tbody>
          {s.sales.slice(0, 6).map((sale) => {
            const Ico = LIST_PAY_ICON[sale.pay];
            return (
              <tr
                key={sale.n}
                {...fx(
                  `s-${sale.n}`,
                  sale.n === s.lastSale?.n ? 'row-in' : undefined
                )}
              >
                <td>
                  <b style={{ fontWeight: 500 }}>{orderLabel(sale.n)}</b>
                </td>
                <td>
                  {sale.customer ?? (
                    <span className="muted">Não identificado</span>
                  )}
                </td>
                <td>{sale.seller}</td>
                <td className="r">{brl(sale.total)}</td>
                <td>
                  <span className="pay">
                    <Ico className="i" />
                    {payList(sale.pay)}
                  </span>
                </td>
                <td>{saleWhen(sale.at, s.now)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pager
        label={`Mostrando 1–6 de ${s.sales[0].n} vendas`}
        pages={['1', '2', '3']}
      />
    </div>
  );
}

function ProductsTable({ view }: ViewProps) {
  const { fx } = view;
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th className="w-full">Produto</th>
            <th>Categoria</th>
            <th className="r">Custo</th>
            <th className="r">Preço de venda</th>
            <th className="r">Estoque</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {view.state.products.map((p) => {
            const badge = stockStatus(p);
            return (
              <tr key={p.id} {...fx(`p-${p.id}`)}>
                <td>
                  <span className="prod">
                    <Thumb id={p.id} />
                    <span>
                      <b>{p.name}</b>
                      <small className="mono">#{p.code}</small>
                    </span>
                  </span>
                </td>
                <td>{p.category}</td>
                <td className="r muted">{brl(p.cost)}</td>
                <td className="r">{brl(p.price)}</td>
                <td className="r">
                  <span {...fx(`p-${p.id}`, 'num', 'pop')}>{p.stock} un.</span>
                </td>
                <td>
                  <span className={cn('badge', badge.tone)}>{badge.label}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pager
        label="Mostrando 1–6 de 56 produtos"
        pages={['1', '2', '…', '10']}
      />
    </div>
  );
}

function MovesTable({ view }: ViewProps) {
  const { fx } = view;
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Data e hora</th>
            <th className="w-full">Produto</th>
            <th>Tipo</th>
            <th className="r">Quantidade</th>
            <th>Detalhe</th>
            <th>Usuário</th>
          </tr>
        </thead>
        <tbody>
          {view.state.moves.slice(0, 6).map((m) => {
            const p = view.product(m.product);
            return (
              <tr
                key={m.id}
                {...fx(`m-${m.id}`, m.fresh ? 'row-in' : undefined)}
              >
                <td>
                  {ddmmyy(m.at)}, {hhmm(m.at)}
                </td>
                <td>
                  <b style={{ fontWeight: 500, display: 'block' }}>{p.name}</b>
                  <small className="muted" style={{ fontSize: 11.5 }}>
                    #{p.code}
                  </small>
                </td>
                <td>{m.type}</td>
                <td className={cn('r', m.qty > 0 ? 'qty-pos' : 'qty-neg')}>
                  {m.qty > 0 ? '+' : ''}
                  {m.qty}
                </td>
                <td>{m.detail}</td>
                <td>{m.user}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pager
        label="Mostrando 1–6 de 318 movimentações"
        pages={['1', '2', '…']}
      />
    </div>
  );
}

function OwnerTable({ view, page }: ViewProps & { page: OwnerPage }) {
  if (page === 'produtos') {
    return <ProductsTable view={view} />;
  }
  if (page === 'estoque') {
    return <MovesTable view={view} />;
  }
  return <SalesTable view={view} />;
}

export function LaptopOwner({ view }: ViewProps) {
  const page = view.state.ownerPage;
  const bar = TOOLBAR[page];
  const [FilterIcon, filter] = bar.filter;
  return (
    <div className="shell">
      <aside className="side">
        <Logo />
        <Menu active={page} />
      </aside>
      <div className="main">
        <header className="head">
          <div className="left">
            <h1>{PAGE_TITLE[page]}</h1>
          </div>
          <Avatar />
        </header>
        <div className="content pg" key={page}>
          <div className="toolbar">
            <div className="group">
              <span className="input" style={{ width: 210 }}>
                <MagnifyingGlassIcon className="i" />
                <span>{bar.search}</span>
              </span>
              <span className="btn outline">
                <FilterIcon className="i" />
                {filter}
              </span>
            </div>
            <div className="group">
              {bar.actions.map((a, i) => (
                <span
                  className={cn(
                    'btn',
                    i === bar.actions.length - 1 ? 'primary' : 'outline'
                  )}
                  key={a}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
          <OwnerTable page={page} view={view} />
        </div>
      </div>
    </div>
  );
}

export function PhoneOwner({ view }: ViewProps) {
  const s = view.state;
  const { fx } = view;
  const page = s.ownerPage;
  let list: ReactNode;
  if (page === 'produtos') {
    list = s.products.map((p) => {
      const badge = stockStatus(p);
      return (
        <div key={p.id} {...fx(`p-${p.id}`, 'm-card')}>
          <div className="row">
            <span className="prod">
              <Thumb id={p.id} />
              <span>
                <b>{p.name}</b>
                <small className="mono">#{p.code}</small>
              </span>
            </span>
          </div>
          <div className="row">
            <small>
              {brl(p.price)} ·{' '}
              <span {...fx(`p-${p.id}`, 'num stock', 'pop')}>
                {p.stock} un.
              </span>
            </small>
            <span className={cn('badge', badge.tone)}>{badge.label}</span>
          </div>
        </div>
      );
    });
  } else if (page === 'estoque') {
    list = s.moves.slice(0, 6).map((m) => (
      <div key={m.id} {...fx(`m-${m.id}`, cn('m-card', m.fresh && 'row-in'))}>
        <div className="row">
          <b>{view.product(m.product).name}</b>
          <span className={m.qty > 0 ? 'qty-pos' : 'qty-neg'}>
            {m.qty > 0 ? '+' : ''}
            {m.qty}
          </span>
        </div>
        <small>
          {m.type} · {m.detail} · {hhmm(m.at)}
        </small>
      </div>
    ));
  } else {
    list = s.sales.slice(0, 5).map((sale) => {
      const Ico = LIST_PAY_ICON[sale.pay];
      return (
        <div
          key={sale.n}
          {...fx(
            `s-${sale.n}`,
            cn('m-card', sale.n === s.lastSale?.n && 'row-in')
          )}
        >
          <div className="row">
            <b>{orderLabel(sale.n)}</b>
            <b>{brl(sale.total)}</b>
          </div>
          <div className="row">
            <span>
              {sale.customer ?? <span className="muted">Não identificado</span>}
            </span>
            <span className="pay" style={{ fontSize: 13 }}>
              <Ico className="i" />
              {payList(sale.pay)}
            </span>
          </div>
          <small>
            {saleWhen(sale.at, s.now)} · {sale.seller}
          </small>
        </div>
      );
    });
  }
  return (
    <div className="page pg" key={`owner-${page}`}>
      <PhoneHead title={PAGE_TITLE[page]} />
      <div className="scroll">
        <span className="input" style={{ height: 40 }}>
          <MagnifyingGlassIcon className="i" />
          <span>{TOOLBAR[page].search}</span>
        </span>
        {page === 'vendas' ? (
          <span className="btn primary" style={{ width: '100%' }}>
            Iniciar nova venda
          </span>
        ) : null}
        <div className="m-list table">{list}</div>
      </div>
    </div>
  );
}
