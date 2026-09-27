import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { NOTA_FISCAL_DISPONIVEL } from '../flags';
import { Reveal } from '../ui/reveal';
import { WIDTH } from '../ui/widths';
import { FaqAccordion, type FaqEntry } from './faq-accordion';

const FAQS: FaqEntry[] = [
  {
    q: 'É grátis mesmo?',
    a: 'Sim. O plano Grátis custa R$ 0 pra sempre: 1 loja, usuários ilimitados, vendas, estoque, produtos e vendedores. Não pedimos cartão de crédito pra criar a conta.',
  },
  {
    q: 'Preciso instalar alguma coisa?',
    a: 'Não. O VNS funciona direto no navegador, no computador ou no celular. É só entrar com seu e-mail ou conta Google.',
  },
  {
    q: 'Preciso trocar minha maquininha?',
    a: 'Não. O VNS registra a forma de pagamento de cada venda — PIX, cartão, dinheiro ou transferência — e você continua usando a maquininha que já tem.',
  },
  {
    q: 'Consigo trazer meus produtos de uma planilha?',
    a: 'Sim. No cadastro em lote você envia a planilha, revisa as linhas e corrige o que precisar antes de importar.',
  },
  {
    q: 'Posso cadastrar mais de um vendedor?',
    a: 'Sim. Cada vendedor tem código e histórico próprios, e você pode desativar alguém sem perder as vendas que essa pessoa fez.',
  },
  {
    q: 'O VNS emite nota fiscal?',
    a: NOTA_FISCAL_DISPONIVEL
      ? 'Sim. Você emite NFC-e no balcão e NF-e quando o cliente pede, direto da venda — produto, valor e pagamento já vêm preenchidos.'
      : 'Está chegando. A emissão de NFC-e e NF-e direto da venda está em desenvolvimento. Crie sua conta agora e você recebe o aviso assim que liberar.',
  },
  {
    q: 'Meus dados ficam salvos se eu trocar de aparelho?',
    a: 'Sim. Tudo fica na sua conta, então você entra do computador ou do celular e encontra as mesmas vendas, produtos e estoque.',
  },
];

export function Faq() {
  return (
    <section
      className={cn('mx-auto px-6 py-[clamp(48px,6vw,80px)]', WIDTH.content)}
    >
      <div className="flex flex-wrap items-start gap-[clamp(32px,5vw,72px)]">
        <Reveal className="flex max-w-[380px] flex-[1_1_300px] flex-col gap-4">
          <span className="font-medium text-primary text-sm">
            Perguntas frequentes
          </span>
          <h2 className="text-balance font-semibold text-[clamp(28px,3.4vw,40px)] text-foreground leading-[1.12] tracking-[-0.025em]">
            Ficou alguma dúvida?
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            O jeito mais rápido de tirar a dúvida é testar. Criar a conta leva
            menos de um minuto.
          </p>
          <div className="mt-2">
            <Button asChild size="lg">
              <Link href="/sign-up">Criar conta grátis</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal
          className="min-w-0 flex-[1.6_1_420px] border-border border-t"
          delay={0.1}
        >
          <FaqAccordion entries={FAQS} />
        </Reveal>
      </div>
    </section>
  );
}
