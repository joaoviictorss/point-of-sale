"use client";

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
import { navigationItems } from "@/utils/constants";

export function Sidebar({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const organizationId = pathname.split("/")[1];

  const isActiveRoute = (itemUrl: string) => {
    return organizationId
      ? pathname === `/${organizationId}${itemUrl}`
      : pathname === itemUrl;
  };

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
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveRoute(item.url)}
                    size={"lg"}
                  >
                    <a
                      href={
                        organizationId
                          ? `/${organizationId}${item.url}`
                          : item.url
                      }
                    >
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
