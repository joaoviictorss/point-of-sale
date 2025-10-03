import {
  ChartPieIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export const navigationItems = [
  {
    title: "Vendas",
    url: "/vendas",
    headerTitle: "Suas vendas",
    icon: ShoppingBagIcon,
  },
  {
    title: "Produtos",
    url: "/produtos",
    headerTitle: "Seus produtos",
    icon: ClipboardDocumentListIcon,
  },
  {
    title: "Estoque",
    url: "/estoque",
    headerTitle: "Seu estoque",
    icon: CircleStackIcon,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    headerTitle: "Relatórios",
    icon: ChartPieIcon,
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
