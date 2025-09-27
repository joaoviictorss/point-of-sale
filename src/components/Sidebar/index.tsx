"use client";

import {
  ChartPieIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
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
} from "@/components/Shadcn/sidebar";

const items = [
  {
    title: "Vendas",
    url: "/vendas",
    icon: ShoppingBagIcon,
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: ClipboardDocumentListIcon,
  },
  {
    title: "Estoque",
    url: "/estoque",
    icon: CircleStackIcon,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
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
    <ShadcnSidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="w-full items-center justify-center">
            <SidebarHeader
              className={
                "flex items-start justify-center border-border border-b p-4"
              }
              onClick={() => onOpenChange(!isOpen)}
            >
              <Logo variant="small" />
            </SidebarHeader>
            <SidebarMenu className={"p-4"}>
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
            </SidebarMenu>{" "}
          </SidebarGroupContent>{" "}
        </SidebarGroup>{" "}
      </SidebarContent>{" "}
    </ShadcnSidebar>
  );
}
