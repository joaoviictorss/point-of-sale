"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "../Shadcn/sidebar";

export const Header = () => {
  const pathname = usePathname();

  const headerTitle = [
    {
      href: "/vendas",
      title: "Suas vendas",
    },
    {
      href: "/produtos",
      title: "Seus produtos",
    },
    {
      href: "/estoque",
      title: "Seu estoque",
    },
    {
      href: "/relatorios",
      title: "Relatórios",
    },
  ] as const;

  const currentHeaderTitle = headerTitle.find((item) => item.href === pathname);

  return (
    <header className="flex w-full items-center justify-between border-border border-b p-4">
      <span className="font-semibold text-2xl">
        {currentHeaderTitle ? currentHeaderTitle.title : "VNS - Admin"}
      </span>

      <div className="h-[60px] w-[60px] bg-accent" />
    </header>
  );
};
