import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { WIDTH } from '../ui/widths';
import { MobileStory } from './mobile-story';
import type { Task } from './task-list';

const TASKS: Task[] = [
  {
    title: 'Registrar vendas',
    description: 'Carrinho, PIX, cartão ou dinheiro, direto do balcão.',
  },
  {
    title: 'Consultar o estoque',
    description: 'Veja o que tem e o que falta sem sair de perto do cliente.',
  },
  {
    title: 'Acompanhar as vendas',
    description:
      'Cada venda aparece na lista na hora, com vendedor e pagamento.',
  },
];

export function Mobile() {
  return (
    <section
      className={cn('mx-auto px-6 pt-[clamp(64px,8vw,112px)]', WIDTH.content)}
    >
      <MobileStory
        cta={
          <Button asChild className="mt-9" size="lg">
            <Link href="/sign-up">Comece grátis</Link>
          </Button>
        }
        intro={
          <>
            <span className="font-medium text-primary text-sm">
              Funciona no celular
            </span>
            <h2 className="mt-3 text-balance font-semibold text-[clamp(30px,3.6vw,44px)] text-foreground leading-[1.1] tracking-[-0.025em]">
              O computador parou? A loja continua no celular.
            </h2>
            <p className="mt-4 max-w-[480px] text-pretty text-[17px] text-text-muted leading-relaxed">
              É o mesmo VNS, com as mesmas funções. Abra no navegador do celular
              e continue vendendo. Não precisa instalar nada.
            </p>
          </>
        }
        tasks={TASKS}
      />
    </section>
  );
}
