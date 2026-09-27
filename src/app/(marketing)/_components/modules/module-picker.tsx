'use client';

import {
  ArrowsUpDownIcon,
  ArrowUturnLeftIcon,
  BanknotesIcon,
  BellAlertIcon,
  BoltIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  IdentificationIcon,
  ScaleIcon,
  ShoppingCartIcon,
  TableCellsIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { type ComponentType, type SVGProps, useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { cn } from '@/lib/utils';
import { NOTA_FISCAL_DISPONIVEL } from '../flags';
import { Reveal } from '../ui/reveal';

type Tile = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  fiscal?: boolean;
};

const TILES: Tile[] = [
  { icon: ShoppingCartIcon, label: 'Carrinho de vendas' },
  { icon: DocumentCheckIcon, label: 'NF-e e NFC-e', fiscal: true },
  { icon: BoltIcon, label: 'PIX como pagamento' },
  { icon: CreditCardIcon, label: 'Cartão com parcelamento' },
  { icon: BanknotesIcon, label: 'Dinheiro e transferência' },
  { icon: DocumentTextIcon, label: 'Recibo com numeração automática' },
  { icon: ArrowUturnLeftIcon, label: 'Cancelamento devolve o estoque' },
  { icon: ArrowsUpDownIcon, label: 'Movimentações de estoque' },
  { icon: BellAlertIcon, label: 'Aviso de estoque mínimo' },
  { icon: ScaleIcon, label: 'Produtos por unidade, peso ou volume' },
  { icon: TableCellsIcon, label: 'Importação por planilha' },
  { icon: IdentificationIcon, label: 'Vendedores com código próprio' },
  { icon: UserGroupIcon, label: 'Equipe com permissões' },
  { icon: UsersIcon, label: 'Clientes com CPF/CNPJ' },
  { icon: DevicePhoneMobileIcon, label: 'Funciona no celular' },
];

function selectionLabel(count: number) {
  if (count === 0) {
    return 'Marque o que sua loja precisa';
  }
  return count === 1
    ? '1 recurso selecionado'
    : `${count} recursos selecionados`;
}

function ModuleTile({
  tile,
  id,
  on,
  onToggle,
}: {
  tile: Tile;
  id: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        'flex min-h-32 flex-1 cursor-pointer select-none flex-col gap-3.5 rounded-[14px] border p-5 transition-[border-color,background-color,box-shadow] duration-150 hover:border-blue-300 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50',
        on
          ? 'border-primary bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,.18)]'
          : 'border-border bg-white'
      )}
      htmlFor={id}
    >
      <div className="flex items-start justify-between gap-2">
        <tile.icon className="size-5.5 text-primary" />
        <Checkbox
          checked={on}
          className="size-4.5"
          id={id}
          onCheckedChange={onToggle}
        />
      </div>
      <span className="text-pretty text-[15px] text-foreground/80 leading-snug">
        {tile.label}
      </span>
      {tile.fiscal && !NOTA_FISCAL_DISPONIVEL && (
        <span className="self-start rounded-full bg-blue-50 px-2 py-0.75 font-semibold text-[10px] text-primary uppercase tracking-wide">
          Em breve
        </span>
      )}
    </label>
  );
}

function SelectionBar({
  count,
  onClear,
}: {
  count: number;
  onClear: () => void;
}) {
  return (
    <div className="mt-7 flex min-h-10 flex-wrap items-center justify-center gap-4">
      <span aria-live="polite" className="text-sm text-text-muted">
        {selectionLabel(count)}
      </span>
      {count > 0 && (
        <>
          <Button asChild size="lg">
            <Link href="/sign-up">Comece grátis com esses recursos</Link>
          </Button>
          <Button onClick={onClear} size="lg" variant="ghost">
            Limpar
          </Button>
        </>
      )}
    </div>
  );
}

/** The feature grid the visitor ticks to see what the VNS covers for their shop. */
export function ModulePicker() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  function toggle(label: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(label)) {
        next.add(label);
      }
      return next;
    });
  }

  return (
    <>
      <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))] gap-3.5">
        {TILES.map((tile, k) => (
          <Reveal
            className="flex"
            delay={((k % 5) * 60 + Math.floor(k / 5) * 40) / 1000}
            key={tile.label}
          >
            <ModuleTile
              id={`modulo-${k}`}
              on={selected.has(tile.label)}
              onToggle={() => toggle(tile.label)}
              tile={tile}
            />
          </Reveal>
        ))}
      </div>
      <SelectionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
      />
    </>
  );
}
