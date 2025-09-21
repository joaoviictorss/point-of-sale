"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Shadcn";
import { useSidebar } from "../Shadcn/sidebar";

export const Header = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const headerTitle = [
    {
      href: "/sales",
      title: "Suas vendas",
    },
    {
      href: "/products",
      title: "Seus produtos",
    },
    {
      href: "/stock",
      title: "Seu estoque",
    },
    {
      href: "/analytics",
      title: "Relatórios",
    },
  ] as const;

  const currentHeaderTitle = headerTitle.find((item) => item.href === pathname);

  return (
    <header className="flex w-full items-center justify-between border-border border-b p-6">
      <Button onClick={toggleSidebar}>
        <Bars3Icon />
      </Button>

      <div className="h-[60px] w-[60px] bg-accent" />
    </header>
  );
};
