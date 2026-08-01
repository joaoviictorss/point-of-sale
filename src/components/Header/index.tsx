'use client';

import { UsersIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth';
import { useUser } from '@/contexts/user-context';
import { navigationItems } from '@/utils/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu';

export const Header = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const currentHeaderTitle = navigationItems.find((item) => {
    const organizationId = pathname.split('/')[1];
    const fullPath = organizationId
      ? `/${organizationId}${item.url}`
      : item.url;
    return pathname === fullPath;
  });

  return (
    <header className="sticky top-0 z-10 flex h-[72px] w-full items-center justify-between border-border border-b bg-white px-6">
      <span className="font-semibold text-2xl text-foreground tracking-tight">
        {currentHeaderTitle ? currentHeaderTitle.headerTitle : 'VNS - Admin'}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            className={`relative flex size-10 items-center justify-center rounded-full border-[#00000020] transition-all hover:scale-105 hover:cursor-pointer ${user?.imageUrl ? 'border-2' : 'border-0 bg-primary'}`}
          >
            {user?.imageUrl ? (
              <Image
                alt="Imagem do usuário"
                className="size-4 rounded-full"
                fill
                src={user.imageUrl}
              />
            ) : (
              <UsersIcon className="size-6" color="white" />
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <span>Gerenciar conta</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()}>
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
