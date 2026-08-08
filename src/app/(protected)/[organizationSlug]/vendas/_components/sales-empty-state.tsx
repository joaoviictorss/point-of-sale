import {
  ClipboardDocumentListIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/shadcn';
import { useOrganization } from '@/contexts/organization-context';
import { RECEIPT_BADGE_CLASSNAME, SaleReceipt } from './sale-receipt';

export const SalesEmptyState = () => {
  const { slug: organizationSlug } = useOrganization();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12 px-6 py-14 lg:flex-row lg:gap-16">
      <SaleReceipt
        badge={
          <div
            className={RECEIPT_BADGE_CLASSNAME}
            style={{ transform: 'rotate(-4deg)' }}
          >
            <PlusIcon className="size-5" strokeWidth={2.2} />
          </div>
        }
      />

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
      </div>
    </div>
  );
};
