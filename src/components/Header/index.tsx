"use client";

import { UserIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../Shadcn/dropdown-menu";

export const Header = () => {
  const pathname = usePathname();
  const { user } = useUser();

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
      <div className="flex h-[60px] items-center justify-center p-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className={`relative flex size-10 items-center justify-center rounded-full border-[#00000020] transition-all hover:scale-105 hover:cursor-pointer ${user?.imageUrl ? "border-2" : "border-0 bg-primary"}`}
            >
              {user?.imageUrl ? (
                <Image
                  alt="Imagem do usuário"
                  className="size-4 rounded-full"
                  fill
                  src={user.imageUrl}
                />
              ) : (
                <UserIcon className="size-6" color="white" />
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
      </div>
    </header>
  );
};
