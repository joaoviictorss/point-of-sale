import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BoltIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Logo } from '@/components';
import { cn } from '@/lib/utils';
import { WIDTH } from './ui/widths';

const METHODS = [
  { icon: BoltIcon, label: 'PIX' },
  { icon: CreditCardIcon, label: 'Cartão' },
  { icon: BanknotesIcon, label: 'Dinheiro' },
  { icon: ArrowsRightLeftIcon, label: 'Transferência' },
];

const COLUMNS = [
  {
    title: 'Produto',
    links: [
      { href: '#recursos', label: 'Recursos' },
      { href: '#como-funciona', label: 'Como funciona' },
      { href: '#precos', label: 'Preços' },
    ],
  },
  {
    title: 'Módulos',
    links: [
      { href: '#recursos', label: 'Vendas' },
      { href: '#recursos', label: 'Estoque' },
      { href: '#recursos', label: 'Produtos' },
      { href: '#recursos', label: 'Vendedores' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { href: '/sign-in', label: 'Entrar' },
      { href: '/sign-up', label: 'Criar conta' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-border border-t bg-gray-50">
      <div
        className={cn(
          'relative mx-auto px-6 pt-[clamp(48px,6vw,72px)]',
          WIDTH.page
        )}
      >
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex max-w-[360px] flex-[1_1_280px] flex-col gap-4.5">
            <Link href="/">
              <Logo variant="small" />
            </Link>
            <p className="text-pretty text-[15px] text-text-muted leading-relaxed">
              Feito pra loja de bairro, não pra multinacional. Vendas, estoque e
              equipe no computador ou no celular.
            </p>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((method) => (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1.25 font-medium text-foreground/80 text-xs"
                  key={method.label}
                >
                  <method.icon className="size-3.5 text-primary" />
                  {method.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-[clamp(40px,6vw,88px)]">
            {COLUMNS.map((column) => (
              <div className="flex flex-col gap-3.5" key={column.title}>
                <span className="font-semibold text-[13px] text-foreground">
                  {column.title}
                </span>
                {column.links.map((link) => (
                  <Link
                    className="w-fit text-foreground/80 text-sm transition-colors hover:text-primary"
                    href={link.href}
                    key={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(40px,5vw,56px)] flex flex-wrap justify-between gap-3 border-border border-t py-5.5 text-[13px] text-text-muted">
          <span>
            © {new Date().getFullYear()} VNS. Todos os direitos reservados.
          </span>
        </div>

        <div
          aria-hidden
          className="-mb-0.5 select-none bg-[linear-gradient(180deg,#dbeafe_0%,rgba(219,234,254,0)_92%)] bg-clip-text text-center font-bold text-[clamp(120px,24vw,340px)] text-transparent leading-[.78] tracking-[-0.06em]"
        >
          VNS
        </div>
      </div>
    </footer>
  );
}
