"use client";

import {
  ChartPieIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/Shadcn/sidebar";

const items = [
  {
    title: "Vendas",
    url: "/sales",
    icon: ShoppingBagIcon,
  },
  {
    title: "Produtos",
    url: "/products",
    icon: ClipboardDocumentListIcon,
  },
  {
    title: "Estoque",
    url: "/stock",
    icon: CircleStackIcon,
  },
  {
    title: "Relatórios",
    url: "/analytics",
    icon: ChartPieIcon,
  },
];

export function Sidebar({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="w-full items-center justify-center">
            <SidebarHeader
              className={`flex h-[6.75rem] items-center justify-center border-border border-b ${isOpen ? "p-6" : "p-0"}`}
              onClick={() => onOpenChange(!isOpen)}
            >
              <Logo showText={isOpen} variant="small" />
            </SidebarHeader>
            <SidebarMenu className={`${isOpen ? "p-6" : "p-0"}`}>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === pathname}
                    size={"lg"}
                  >
                    <a className="" href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
