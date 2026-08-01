import {
  ClipboardDocumentListIcon,
  PlusIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/shadcn';
import { useOrganization } from '@/contexts/organization-context';

const SKELETON_LINES = [
  { left: 'w-20', right: 'w-10' },
  { left: 'w-24', right: 'w-8' },
  { left: 'w-16', right: 'w-11' },
];

export const SalesEmptyState = () => {
  const { slug: organizationSlug } = useOrganization();

  return (
    <div className="flex min-h-[calc(100svh-180px)] flex-col items-center justify-center gap-16 px-6 py-8 lg:flex-row">
      {/* recibo */}
      <div className="relative shrink-0">
        <div
          className="w-[226px] rounded-t-2xl bg-card px-6 pt-6 pb-2 shadow-[0_18px_44px_-16px_rgba(17,24,39,0.30)]"
          style={{ transform: 'rotate(-4deg)' }}
        >
          <div className="flex items-center gap-2.5 border-gray-300 border-b border-dashed pb-3.5">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-50 text-primary">
              <ShoppingBagIcon className="size-4" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-foreground text-xs">
                VNS - Admin
              </span>
              <span className="text-[10px] text-muted-foreground">
                Comprovante de venda
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 py-4">
            {SKELETON_LINES.map((line) => (
              <div
                className="flex items-center justify-between"
                key={line.left}
              >
                <span className={`h-2 rounded-full bg-gray-200 ${line.left}`} />
                <span
                  className={`h-2 rounded-full bg-gray-100 ${line.right}`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-gray-300 border-t border-dashed py-3.5">
            <span className="font-semibold text-muted-foreground text-xs">
              Total
            </span>
            <span className="font-bold font-mono text-muted-foreground text-sm">
              R$ —
            </span>
          </div>
        </div>
        {/* serrilhado inferior */}
        <div
          className="mt-[11px] ml-2 h-3 w-[226px] bg-card shadow-[0_18px_30px_-18px_rgba(17,24,39,0.30)]"
          style={{
            transform: 'rotate(-184deg)',
            transformOrigin: 'top center',
            WebkitMask: 'radial-gradient(8px at 8px 0,#0000 98%,#000) repeat-x',
            mask: 'radial-gradient(8px at 8px 0,#0000 98%,#000) repeat-x',
            WebkitMaskSize: '16px 12px',
            maskSize: '16px 12px',
          }}
        />
        <div
          className="-top-3.5 -right-3 absolute flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_-4px_rgba(37,99,235,0.55)]"
          style={{ transform: 'rotate(-4deg)' }}
        >
          <PlusIcon className="size-5" strokeWidth={2.2} />
        </div>
      </div>

      {/* copy */}
      <div className="max-w-sm text-center lg:text-left">
        <span className="inline-flex h-[26px] items-center rounded-full bg-blue-50 px-2.5 font-semibold text-primary text-xs">
          Comece por aqui
        </span>
        <h2 className="mt-4 font-semibold text-[28px] text-foreground leading-tight tracking-tight">
          Sua primeira venda começa com um toque
        </h2>
        <p className="mt-2.5 text-[15px] text-muted-foreground leading-relaxed">
          Registre o que você vende e o VNS organiza os comprovantes, o
          faturamento e o estoque automaticamente. Sem planilha, sem
          complicação.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
          <Button asChild>
            <Link href={`/${organizationSlug}/vendas/nova`}>
              <PlusIcon className="size-4" />
              Iniciar nova venda
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${organizationSlug}/produtos/novo`}>
              <ClipboardDocumentListIcon className="size-4" />
              Cadastrar produto
            </Link>
          </Button>
        </div>
        <p className="mt-5 text-muted-foreground/80 text-sm">
          Dica: você pode operar tudo pelo celular também.
        </p>
      </div>
    </div>
  );
};
