import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { Noise } from './ui/noise';
import { Reveal } from './ui/reveal';
import { WIDTH } from './ui/widths';

const FREE = [
  '1 loja, usuários ilimitados',
  'Vendas, estoque e produtos completos',
  'Cadastro de vendedores',
  'PIX, cartão e dinheiro',
];

const PRO = [
  'Tudo do plano Grátis',
  'Múltiplas lojas na mesma conta',
  'Emissão de NFe/NFC-e',
  'Suporte prioritário',
];

function Features({
  items,
  inverted,
}: {
  items: string[];
  inverted?: boolean;
}) {
  return (
    <ul className="relative mt-6 flex flex-1 flex-col gap-3">
      {items.map((item) => (
        <li className="flex gap-2.5 text-[15px]" key={item}>
          <CheckIcon
            className={cn(
              'mt-0.5 size-4 shrink-0',
              inverted ? 'text-white' : 'text-primary'
            )}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Pricing() {
  return (
    <section
      className={cn('mx-auto px-6 py-[clamp(48px,6vw,80px)]', WIDTH.focus)}
      id="precos"
    >
      <Reveal>
        <h2 className="mx-auto max-w-[560px] text-balance text-center font-semibold text-[clamp(28px,3.4vw,40px)] text-foreground leading-[1.12] tracking-[-0.025em]">
          Comece de graça, cresça quando fizer sentido
        </h2>
        <p className="mt-3.5 text-center text-text-muted">
          Sem taxa de instalação, sem contrato de fidelidade.
        </p>
      </Reveal>

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">
        <Reveal className="flex">
          <div className="flex flex-1 flex-col rounded-[20px] border border-border bg-white p-8 text-foreground">
            <span className="font-medium text-sm text-text-muted">Grátis</span>
            <span className="mt-2 font-semibold text-[40px] tracking-tight">
              R$ 0
            </span>
            <span className="mt-1 text-sm text-text-muted">
              pra sempre, sem pegadinha
            </span>
            <Features items={FREE} />
            <Button asChild className="mt-8 w-full" size="lg">
              <Link href="/sign-up">Começar agora</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal className="flex" delay={0.09}>
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(165deg,#2563eb,#1d4ed8)] p-8 text-white">
            <Noise />
            <div className="relative flex items-center justify-between">
              <span className="font-medium text-blue-50 text-sm">
                Profissional
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 font-semibold text-[11px] uppercase tracking-wide">
                Em breve
              </span>
            </div>
            <span className="relative mt-2 font-semibold text-[40px] tracking-tight">
              R$ 49
            </span>
            <span className="relative mt-1 text-blue-50 text-sm">
              por mês, valor de lançamento — sujeito a ajuste
            </span>
            <Features inverted items={PRO} />
            <span className="relative mt-8 flex h-10 items-center justify-center rounded-lg border border-white/35 font-medium text-sm">
              Avise-me quando lançar
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
