'use client';

import { usePathname } from 'next/navigation';
import { Logo } from '@/components';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/shadcn/sidebar';
import { navigationItems } from '@/utils/constants';

export function Sidebar() {
  const pathname = usePathname();
  const organizationId = pathname.split('/')[1];

  const isActiveRoute = (itemUrl: string) => {
    if (organizationId) {
      return (
        pathname === `/${organizationId}${itemUrl}` ||
        pathname.startsWith(`/${organizationId}${itemUrl}`)
      );
    }
    return pathname === itemUrl || pathname.startsWith(itemUrl);
  };

  return (
    <ShadcnSidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="w-full items-center justify-center">
            <SidebarHeader
              className={
                'flex h-[72px] items-start justify-center border-border border-b px-4'
              }
            >
              <Logo variant="small" />
            </SidebarHeader>
            <SidebarMenu className={'gap-1 p-3'}>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveRoute(item.url)}
                    size={'lg'}
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
