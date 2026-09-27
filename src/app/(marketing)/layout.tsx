import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VNS — o sistema de vendas feito pro tamanho da sua loja',
  description:
    'VNS é o sistema de vendas, estoque e equipe pra pequenos e médios varejistas. Comece grátis, sem complicação de ERP.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
