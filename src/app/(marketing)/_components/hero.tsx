import {
  ArchiveBoxIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { NOTA_FISCAL_DISPONIVEL } from './flags';
import { RotatingWord } from './rotating-word';
import { Noise } from './ui/noise';
import { Reveal } from './ui/reveal';
import { WIDTH } from './ui/widths';

const HERO_HIGHLIGHTS = [
  {
    title: 'Venda mais rápido.',
    description: 'Registre PIX, cartão e dinheiro em poucos toques.',
  },
  {
    title: 'Estoque sempre certo.',
    description: 'Cada venda atualiza o estoque sozinha.',
  },
  {
    title: 'Comece sem custo.',
    description: 'Grátis pra começar, sem cartão de crédito.',
  },
];

function HeroVisual() {
  return (
    <div className="relative pb-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] bottom-0 h-2/5 bg-[radial-gradient(closest-side,rgba(37,99,235,.35),transparent)] blur-2xl"
      />
      <div className="relative aspect-[1585/992] w-full overflow-hidden rounded-3xl bg-blue-700 shadow-[0_1px_2px_rgba(17,24,39,.06),0_30px_60px_-28px_rgba(29,78,216,.55)]">
        <Image
          alt="Painel do VNS com a tela de vendas"
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          src="/lp/hero-vns.png"
        />
        <Noise className="opacity-[.05]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.18)]"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[clamp(-28px,-2vw,-12px)] flex w-59 animate-[lp-float_7s_ease-in-out_infinite] flex-col gap-2.5 rounded-2xl bg-white px-4 py-3.5 shadow-[0_18px_36px_-12px_rgba(17,24,39,.35),0_0_0_1px_rgba(17,24,39,.05)] motion-reduce:animate-none"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-text-muted text-xs">
            Venda #0143
          </span>
          <Badge className="text-[11px]" variant="success">
            Pago · PIX
          </Badge>
        </div>
        <span className="font-semibold text-[22px] text-foreground tracking-tight">
          R$ 59,80
        </span>
        <span className="flex items-center gap-1.5 text-text-muted text-xs">
          <ArchiveBoxIcon className="size-3.5 text-primary" />
          Estoque atualizado · 2 itens
        </span>
      </div>

      <div
        aria-hidden
        className="-top-4.5 pointer-events-none absolute right-[clamp(-16px,-1vw,-8px)] flex animate-[lp-float_8s_ease-in-out_-3s_infinite] items-center gap-2 rounded-full bg-white py-2 pr-3.5 pl-2.5 font-medium text-[13px] text-foreground shadow-[0_12px_28px_-10px_rgba(17,24,39,.3),0_0_0_1px_rgba(17,24,39,.05)] motion-reduce:animate-none"
      >
        <span className="grid size-6 place-items-center rounded-full bg-blue-50">
          <DevicePhoneMobileIcon className="size-3.5 text-primary" />
        </span>
        Mesmo sistema no celular
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className={cn(
          'mx-auto flex flex-wrap items-center gap-[clamp(40px,5vw,72px)] px-6 pt-[clamp(40px,6vw,80px)] pb-[clamp(48px,6vw,80px)]',
          WIDTH.page
        )}
      >
        <Reveal className="max-w-[500px] flex-[1_1_380px]">
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1.5 px-2.5 py-0.5" variant="outline">
              <DevicePhoneMobileIcon className="size-3.5! text-primary" />
              Funciona no celular
            </Badge>
            <Badge className="gap-1.5 px-2.5 py-0.5" variant="outline">
              <DocumentTextIcon className="size-3.5! text-primary" />
              Emissão de nota fiscal
              {!NOTA_FISCAL_DISPONIVEL && ' · em breve'}
            </Badge>
          </div>

          <h1 className="mt-6 font-semibold text-[clamp(40px,4.8vw,60px)] text-foreground leading-[1.05] tracking-[-0.035em]">
            Venda de forma <RotatingWord />
          </h1>

          <p className="mt-5.5 max-w-[460px] text-pretty text-lg text-text-muted leading-relaxed">
            Vendas, estoque e equipe em um só lugar — sem a complexidade de um
            ERP.
          </p>

          <ul className="mt-7.5 flex flex-col gap-3.5">
            {HERO_HIGHLIGHTS.map((item) => (
              <li className="flex items-start gap-3" key={item.title}>
                <span className="mt-px grid size-5.5 shrink-0 place-items-center rounded-full bg-blue-50 text-primary">
                  <svg
                    aria-hidden="true"
                    className="size-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m5 13 4.5 4.5L19 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-[15px] text-foreground leading-snug">
                  <span className="font-semibold">{item.title}</span>{' '}
                  <span className="text-text-muted">{item.description}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8.5 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">Comece grátis</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#como-funciona">Ver como funciona</a>
            </Button>
          </div>

          <p className="mt-4.5 text-[13px] text-text-muted">
            Grátis pra começar · Sem cartão de crédito
          </p>
        </Reveal>

        <Reveal className="min-w-0 flex-[1.35_1_520px]" delay={0.12}>
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}
