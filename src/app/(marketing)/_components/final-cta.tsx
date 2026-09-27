import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Noise } from './ui/noise';
import { Reveal } from './ui/reveal';
import { WIDTH } from './ui/widths';

export function FinalCta() {
  return (
    <section className="px-6 pt-[clamp(24px,4vw,48px)] pb-[clamp(64px,8vw,96px)]">
      <Reveal
        className={cn(
          'relative mx-auto overflow-hidden rounded-[28px] bg-[radial-gradient(90%_70%_at_20%_0%,#3b82f6_0%,transparent_60%),linear-gradient(165deg,#2563eb,#1e40af)]',
          WIDTH.frame
        )}
      >
        <Noise />
        <div className="relative px-6 pt-[clamp(48px,6vw,72px)] text-center">
          <h2 className="mx-auto max-w-[640px] text-balance font-semibold text-[clamp(32px,4.4vw,54px)] text-white leading-[1.08] tracking-[-0.03em]">
            Pronta pra simplificar sua loja?
          </h2>
          <p className="mx-auto mt-4.5 max-w-[460px] text-[17px] text-blue-50 leading-relaxed">
            Crie sua conta em menos de um minuto e comece a vender ainda hoje.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              className="hover:-translate-y-0.5 inline-flex h-12.5 items-center gap-2.5 rounded-full bg-white px-6.5 font-medium text-base text-foreground shadow-[0_10px_30px_-10px_rgba(17,24,39,.4)] transition-transform"
              href="/sign-up"
            >
              Comece agora — é grátis
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <Reveal
            className="mx-auto mt-14 h-[clamp(200px,30vw,340px)] max-w-[920px] overflow-hidden"
            delay={0.15}
          >
            <div className="rounded-t-[22px] border border-white/30 border-b-0 bg-white/20 px-2.5 pt-2.5">
              <Image
                alt="Tela de produtos do VNS"
                className="block h-auto w-full rounded-t-[14px]"
                height={742}
                sizes="(min-width: 1024px) 920px, 100vw"
                src="/captura-produtos.png"
                width={1345}
              />
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
