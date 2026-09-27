// Selling screens: new sale (search, cart), checkout dialog and the success toast.

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
  ShoppingBagIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { brl, orderNumber, PAY_METHODS, SELLERS } from '../demo-data';
import { Avatar, Logo, Menu, PAY_ICON, PhoneHead, payLabel } from './chrome';
import type { ViewProps } from './view';

function SearchBlock({
  view,
  device,
}: ViewProps & { device: 'phone' | 'laptop' }) {
  const s = view.state;
  const list = view.matches;
  return (
    <div className="search">
      <div className="search-row">
        <span className={cn('input', s.search && 'typed')} style={{ flex: 1 }}>
          <MagnifyingGlassIcon className="i" />
          {s.search ? (
            <>
              <span>{s.search}</span>
              {s.typing ? <span className="caret" /> : null}
            </>
          ) : (
            <span>
              Buscar produto pelo nome ou código
              {device === 'laptop' ? '  ( / )' : ''}
            </span>
          )}
        </span>
        <span className="muted">×</span>
        <span className="input qty" />
      </div>
      {device === 'laptop' ? (
        <div className="hint">
          <kbd>↵</kbd> confirma o código e vai para a quantidade
        </div>
      ) : null}
      {list.length > 0 ? (
        <div className="results drop">
          {list.map((p, i) => (
            <span
              className={cn(
                'result',
                i === s.highlight && 'hl',
                s.pressing === p.id && 'pressed'
              )}
              key={p.id}
            >
              <span className="code">{p.code}</span>
              <span className="name">
                <b>{p.name}</b>
                <small>
                  {p.category} · {p.stock} em estoque
                </small>
              </span>
              <span className="price">{brl(p.price)}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="empty">
      <svg
        aria-hidden="true"
        fill="none"
        height="104"
        viewBox="0 0 160 140"
        width="120"
      >
        <ellipse cx="80" cy="122" fill="#eff6ff" rx="44" ry="5" />
        <path
          d="M50 32a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v78l-7.5-5-7.5 5-7.5-5-7.5 5-7.5-5-7.5 5-7.5-5-7.5 5Z"
          fill="#fff"
          stroke="#64748b"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <path
          d="M62 50h36M62 64h36M62 78h22"
          stroke="#d1d5db"
          strokeDasharray="6 7"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        <circle cx="111" cy="35" fill="#3b82f6" r="14" />
        <path
          d="M111 29v12M105 35h12"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="2.8"
        />
      </svg>
      <h3>Nenhum item lançado</h3>
      <p>
        Digite o código na barra acima e confirme com <kbd>↵</kbd>.
      </p>
    </div>
  );
}

function CartItems({ view }: ViewProps) {
  const { fx } = view;
  const lines = view.lines;
  if (lines.length === 0) {
    return <EmptyCart />;
  }
  return (
    <div className="items">
      {lines.map((l) => (
        <div key={l.id} {...fx(`c-${l.id}`, 'item enter')}>
          <span className="name">
            <b>{l.name}</b>
            <small>
              <span className="mono">{l.code}</span> · {brl(l.price)}
            </small>
          </span>
          <span className="stepper">
            <span className="step">
              <MinusIcon className="i" />
            </span>
            <span>{l.qty}</span>
            <span className="step">
              <PlusIcon className="i" />
            </span>
          </span>
          <span className="sum">{brl(l.price * l.qty)}</span>
          <span className="trash">
            <TrashIcon className="i" />
          </span>
        </div>
      ))}
    </div>
  );
}

function CheckoutDialog({ view }: ViewProps) {
  const s = view.state;
  if (s.phase === 'cart') {
    return null;
  }
  if (s.phase === 'done' && s.lastSale) {
    const last = s.lastSale;
    return (
      <div className="overlay">
        <div className="dialog">
          <div className="dialog-head">
            <h3>Resumo da venda</h3>
            <XMarkIcon className="i" />
          </div>
          <div className="done">
            <span className="ok pop">
              <CheckIcon className="i" />
            </span>
            <div>
              <h4>Venda registrada!</h4>
              <div className="muted" style={{ marginTop: 4 }}>
                Venda nº {orderNumber(last.n)}
              </div>
            </div>
            <div className="rows">
              <div>
                <span className="muted">Total</span>
                <b>{brl(last.total)}</b>
              </div>
              <div>
                <span className="muted">Pagamento</span>
                <b>{payLabel(last.pay)}</b>
              </div>
              <div>
                <span className="muted">Vendedor</span>
                <b>{last.seller}</b>
              </div>
            </div>
            <div className="pair">
              <span className="btn outline">Fechar</span>
              <span className="btn primary">
                <PlusIcon className="i" />
                Nova venda
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const total = view.subtotal;
  return (
    <div className="overlay">
      <div className="dialog enter">
        <div className="dialog-head">
          <h3>Finalizar venda</h3>
          <XMarkIcon className="i" />
        </div>
        <div className="due">
          <span className="muted">Total a pagar</span>
          <strong>{brl(total)}</strong>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <span className="label">Forma de pagamento</span>
          <div className="tiles">
            {PAY_METHODS.map((p, i) => {
              const Ico = PAY_ICON[p.id];
              return (
                <span className={cn('tile', s.pay === p.id && 'on')} key={p.id}>
                  <Ico className="i" />
                  <span>
                    <em>{i + 1}</em>
                    {p.label}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
        {s.pay === 'PIX' ? (
          <div className="note enter">
            Cobrança Pix gerada — o cliente paga via QR Code. Confirme quando o
            pagamento cair.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 6 }}>
            <span className="label">Valor recebido</span>
            <span className="input">R$ 0,00</span>
          </div>
        )}
        <span className="btn primary" style={{ height: 44 }}>
          Confirmar e finalizar
          <CheckIcon className="i" />
        </span>
      </div>
    </div>
  );
}

function Toast({ view }: ViewProps) {
  const t = view.state.toast;
  if (!t) {
    return null;
  }
  return (
    <div className={cn('toast', t.leaving && 'leaving')}>
      <CheckCircleIcon className="i solid" />
      {t.text}
    </div>
  );
}

function CartPanel({ view }: ViewProps) {
  const empty = view.state.cart.length === 0;
  const count = view.state.cart.length;
  return (
    <div className="card cart">
      <div className="cart-head">
        <div className="row">
          <span className="title">
            <ShoppingBagIcon className="i" />
            Venda atual
          </span>
          {empty ? null : (
            <span className="badge default">
              {count} {count === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>
        <div className="seller">
          <UserIcon className="i" />
          <span>{SELLERS.laptop}</span>
          <ChevronDownIcon className="i chev" />
        </div>
      </div>
      <div className="cart-body">
        {empty ? (
          <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
            Cliente e observações ficam disponíveis depois que a venda tiver
            itens.
          </p>
        ) : (
          <>
            <span className="ghost-row">
              <UserPlusIcon className="i" />
              Adicionar cliente
            </span>
            <span className="ghost-row">
              <PencilSquareIcon className="i" />
              Adicionar observação
            </span>
          </>
        )}
      </div>
      <div className="cart-foot">
        <span className="link" style={empty ? { opacity: 0.5 } : undefined}>
          <TagIcon className="i" />
          Aplicar desconto
        </span>
        <div className="line">
          <span className="muted">Subtotal</span>
          <span>{brl(view.subtotal)}</span>
        </div>
        <div className="total">
          <span>Total</span>
          <strong>{brl(view.subtotal)}</strong>
        </div>
        <span className={cn('btn primary lg', empty && 'off')}>
          Finalizar venda
          <ArrowRightIcon className="i" />
        </span>
      </div>
    </div>
  );
}

export function LaptopSeller({ view }: ViewProps) {
  return (
    <>
      <div className="shell">
        <aside className="side">
          <Logo />
          <Menu active="vendas" />
        </aside>
        <div className="main">
          <header className="head">
            <div className="left">
              <h1>Suas vendas</h1>
            </div>
            <Avatar />
          </header>
          <div
            className="content pg"
            key="nova"
            style={{ background: 'var(--gray-50)' }}
          >
            <div className="page-title">
              <span className="btn icon outline">
                <ArrowLeftIcon className="i" />
              </span>
              <h2>Nova venda</h2>
            </div>
            <div className="sale-grid">
              <div className="card sale-left">
                <SearchBlock device="laptop" view={view} />
                <CartItems view={view} />
              </div>
              <CartPanel view={view} />
            </div>
          </div>
        </div>
      </div>
      <CheckoutDialog view={view} />
      <Toast view={view} />
    </>
  );
}

export function PhoneSeller({ view }: ViewProps) {
  const count = view.state.cart.length;
  return (
    <>
      <div className="page pg" key="nova">
        <PhoneHead title="Suas vendas" />
        <div className="scroll">
          <div className="page-title">
            <span className="btn icon outline">
              <ArrowLeftIcon className="i" />
            </span>
            <h2>Nova venda</h2>
            {count > 0 ? (
              <span className="badge default" style={{ marginLeft: 'auto' }}>
                {count} {count === 1 ? 'item' : 'itens'}
              </span>
            ) : null}
          </div>
          <div className="card sale-card">
            <SearchBlock device="phone" view={view} />
            <CartItems view={view} />
          </div>
        </div>
        <div className="foot">
          <div className="total">
            <span>Total</span>
            <strong>{brl(view.subtotal)}</strong>
          </div>
          <span className={cn('btn primary lg', count === 0 && 'off')}>
            Finalizar venda
            <ArrowRightIcon className="i" />
          </span>
        </div>
      </div>
      <CheckoutDialog view={view} />
      <Toast view={view} />
    </>
  );
}
