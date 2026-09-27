import { cn } from '@/lib/utils';
import { Reveal } from '../ui/reveal';
import { WIDTH } from '../ui/widths';
import { DesktopSteps } from './desktop-steps';

export type Step = { title: string; description: string };

const STEPS: Step[] = [
  {
    title: 'Crie sua loja',
    description: 'Cadastro em menos de um minuto, sem precisar de suporte.',
  },
  {
    title: 'Cadastre produtos',
    description: 'Um a um ou tudo de uma vez, por planilha.',
  },
  {
    title: 'Cadastre sua equipe',
    description: 'Cada vendedor com código e histórico próprios.',
  },
  {
    title: 'Comece a vender',
    description: 'Carrinho, pagamento e recibo do jeito que você já vende.',
  },
  {
    title: 'Estoque atualiza sozinho',
    description: 'Cada venda ajusta o estoque na hora, sem planilha.',
  },
  {
    title: 'Acompanhe tudo',
    description: 'Vendas, estoque e time, sempre à vista.',
  },
];

function MobileTimeline({ steps }: { steps: Step[] }) {
  return (
    <div className="relative mx-auto mt-14 max-w-sm lg:hidden">
      <div
        aria-hidden
        className="absolute top-11 left-5.5 h-[calc(100%-3.5rem)] border-muted-foreground/40 border-l-2 border-dotted"
      />
      <ol className="relative flex flex-col gap-10">
        {steps.map((step, index) => (
          <li className="relative flex items-start gap-4" key={step.title}>
            <div className="relative grid size-11 shrink-0 place-items-center rounded-full border-2 border-primary bg-background font-semibold text-foreground text-sm">
              {index + 1}
            </div>
            <div className="pt-2">
              <h3 className="font-semibold text-foreground text-sm">
                {step.title}
              </h3>
              <p className="mt-1 text-text-muted text-xs">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      className={cn('mx-auto px-6 py-[clamp(48px,6vw,80px)]', WIDTH.page)}
      id="como-funciona"
    >
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <span className="font-medium text-primary text-sm">Como funciona</span>
        <h2 className="text-balance font-semibold text-[clamp(28px,3.4vw,40px)] text-foreground leading-[1.12] tracking-[-0.025em]">
          Da criação da loja à primeira venda, em seis passos.
        </h2>
        <p className="mt-1 text-text-muted leading-relaxed">
          Sem curso para fazer, sem manual pra decorar antes de começar.
        </p>
      </Reveal>

      <DesktopSteps steps={STEPS} />
      <MobileTimeline steps={STEPS} />
    </section>
  );
}
