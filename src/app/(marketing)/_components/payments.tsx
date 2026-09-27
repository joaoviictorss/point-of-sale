import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BoltIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Reveal } from './ui/reveal';
import { WIDTH } from './ui/widths';

const METHODS = [
  { icon: BoltIcon, label: 'PIX' },
  { icon: CreditCardIcon, label: 'Cartão de crédito' },
  { icon: CreditCardIcon, label: 'Cartão de débito' },
  { icon: BanknotesIcon, label: 'Dinheiro' },
  { icon: ArrowsRightLeftIcon, label: 'Transferência' },
];

export function Payments() {
  return (
    <section className={cn('mx-auto px-6 py-14', WIDTH.page)}>
      <Reveal>
        <p className="text-center font-medium text-[13px] text-text-muted uppercase tracking-wide">
          Aceita os pagamentos que sua loja já usa
        </p>
      </Reveal>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {METHODS.map((method, index) => (
          <Reveal delay={index * 0.05} key={method.label}>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-medium text-[14px] text-foreground">
              <method.icon className="size-4 text-primary" />
              {method.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
