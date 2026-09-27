import { cn } from '@/lib/utils';
import { Reveal } from '../ui/reveal';
import { WIDTH } from '../ui/widths';
import { ModulePicker } from './module-picker';

export function Modules() {
  return (
    <section
      className={cn('mx-auto px-6 py-[clamp(64px,8vw,112px)]', WIDTH.content)}
    >
      <Reveal>
        <h2 className="mx-auto max-w-[560px] text-balance text-center font-semibold text-[clamp(30px,3.8vw,46px)] text-foreground leading-[1.12] tracking-[-0.025em]">
          Tudo que sua loja precisa, em um só sistema
        </h2>
        <p className="mt-3.5 text-center text-base text-text-muted">
          Sem menu escondido, sem tela que ninguém acha.
        </p>
      </Reveal>
      <ModulePicker />
    </section>
  );
}
