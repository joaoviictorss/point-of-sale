"use client";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/Shadcn/sidebar";

import { Logo } from "@/components";

import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CircleStackIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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
              className={`border-b border-border flex items-center justify-center h-[6.75rem] ${isOpen ? "p-6" : "p-0"}`}
              onClick={() => onOpenChange(!isOpen)}
            >
              <Logo variant="small" showText={isOpen} />
            </SidebarHeader>
            <SidebarMenu className={`${isOpen ? "p-6" : "p-0"}`}>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    size={"lg"}
                    isActive={item.url === pathname}
                  >
                    <a href={item.url} className="">
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
