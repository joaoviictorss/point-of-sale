import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { NOTA_FISCAL_DISPONIVEL } from '../flags';
import { Noise } from '../ui/noise';
import { Reveal } from '../ui/reveal';
import { WIDTH } from '../ui/widths';
import { SaleFlow } from './sale-flow';

const EDGE_FADE =
  '[mask-image:radial-gradient(ellipse_72%_68%_at_50%_50%,#000_58%,transparent_100%)]';

function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'h-full overflow-hidden rounded-[22px] border border-white/15 bg-white/5',
        className
      )}
    >
      {children}
    </div>
  );
}

function ImageCard({
  title,
  description,
  badge,
  image,
}: {
  title: string;
  description: string;
  badge?: string;
  image: { src: string; alt: string; ratio: string };
}) {
  return (
    <Panel className="flex flex-col gap-3 px-[clamp(24px,3.5vw,40px)] pt-[clamp(24px,3.5vw,40px)]">
      <div className="flex flex-col items-center text-center">
        {badge && (
          <span className="mb-3 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-semibold text-[11px] text-white uppercase tracking-wide">
            {badge}
          </span>
        )}
        <h3 className="font-semibold text-[22px] text-white tracking-tight">
          {title}
        </h3>
        <p className="mx-auto mt-2.5 max-w-[400px] text-pretty text-[15px] text-blue-50 leading-relaxed">
          {description}
        </p>
      </div>
      <div
        className={cn(
          'relative mx-[calc(-1*clamp(24px,3.5vw,40px))] mt-auto',
          EDGE_FADE
        )}
        style={{ aspectRatio: image.ratio }}
      >
        <Image
          alt={image.alt}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          src={image.src}
        />
      </div>
    </Panel>
  );
}

export function Features() {
  return (
    <section className="px-6" id="recursos">
      <div
        className={cn(
          'relative mx-auto overflow-hidden rounded-[28px] bg-[radial-gradient(110%_70%_at_10%_0%,#3b82f6_0%,transparent_55%),radial-gradient(80%_60%_at_100%_100%,#1e40af_0%,transparent_65%),linear-gradient(165deg,#2563eb,#1d4ed8)]',
          WIDTH.frame
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,transparent_38%,rgba(255,255,255,.07)_48%,transparent_58%),linear-gradient(62deg,transparent_55%,rgba(30,64,175,.35)_70%,transparent_85%)]"
        />
        <Noise />

        <div
          className={cn(
            'relative mx-auto flex flex-col gap-6 px-[clamp(16px,4vw,40px)] pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,6vw,80px)]',
            WIDTH.content
          )}
        >
          <Reveal>
            <h2 className="mx-auto mb-6 max-w-[640px] text-balance text-center font-semibold text-[clamp(30px,3.8vw,46px)] text-white leading-[1.12] tracking-[-0.025em]">
              O sistema que coloca você no controle da sua loja
            </h2>
          </Reveal>

          <Reveal>
            <Panel className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-8 p-[clamp(24px,4vw,48px)]">
              <div>
                <h3 className="font-semibold text-[clamp(24px,2.4vw,30px)] text-white tracking-[-0.02em]">
                  Venda do carrinho ao recibo
                </h3>
                <p className="mt-3 max-w-[440px] text-pretty text-base text-blue-50 leading-relaxed">
                  Registre PIX, cartão e dinheiro em poucos toques. Parcelamento
                  no cartão configurável e recibo com numeração sequencial
                  automática.
                </p>
              </div>
              <SaleFlow />
            </Panel>
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6">
            <Reveal>
              <ImageCard
                description="Entrada, saída, ajuste e devolução registrados. Aviso de estoque mínimo por produto."
                image={{
                  src: '/lp/card-estoque.png',
                  alt: 'Movimentações de estoque com alerta de reposição',
                  ratio: '1585/992',
                }}
                title="Estoque que se atualiza sozinho"
              />
            </Reveal>
            <Reveal delay={0.09}>
              <ImageCard
                badge={NOTA_FISCAL_DISPONIVEL ? undefined : 'Em breve'}
                description="NFC-e no balcão e NF-e quando o cliente pede, sem digitar tudo de novo. Produto, valor e pagamento já vêm da venda."
                image={{
                  src: '/lp/card-nota-fiscal.png',
                  alt: 'NFC-e autorizada no celular',
                  ratio: '1672/941',
                }}
                title="Nota fiscal direto da venda"
              />
            </Reveal>
          </div>

          <Reveal>
            <Panel className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-8 p-[clamp(24px,4vw,40px)]">
              <div
                className={cn(
                  'relative aspect-square w-full max-w-[440px] justify-self-center',
                  '[mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]'
                )}
              >
                <Image
                  alt="Cards de vendedores com histórico de vendas"
                  className="object-cover"
                  fill
                  sizes="440px"
                  src="/lp/card-vendedores.png"
                />
              </div>
              <div>
                <h3 className="font-semibold text-[clamp(24px,2.4vw,30px)] text-white tracking-[-0.02em]">
                  Cada vendedor com seu histórico
                </h3>
                <p className="mt-3 max-w-[440px] text-pretty text-base text-blue-50 leading-relaxed">
                  Acompanhe quem vendeu o quê, sem planilha paralela. Cada
                  vendedor tem código próprio, e você ativa ou desativa sem
                  perder o passado.
                </p>
              </div>
            </Panel>
          </Reveal>

          <Reveal className="mt-6 flex justify-center">
            <Link
              className="hover:-translate-y-0.5 inline-flex h-12.5 items-center gap-2.5 rounded-full bg-white px-6.5 font-medium text-base text-foreground shadow-[0_10px_30px_-10px_rgba(17,24,39,.4)] transition-transform"
              href="/sign-up"
            >
              Simplificar minhas vendas
              <ChevronRightIcon className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
