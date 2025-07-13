import Image from "next/image";
import type { ComponentProps } from "react";

interface ILogoProps extends ComponentProps<"div"> {
  variant?: "default" | "small";
  showText?: boolean;
}

export const Logo = ({
  variant = "default",
  showText = true,
  ...rest
}: ILogoProps) => {
  return (
    <div className="flex items-center gap-5" {...rest}>
      <Image
        alt="Logo"
        height={60}
        priority
        quality={100}
        src="/logo.png"
        width={60}
      />

      <div
        className={`flex-col gap-0.5 transition-opacity ${showText ? "flex" : "hidden"}`}
      >
        <span
          className={`text-nowrap font-semibold text-foreground ${variant === "small" ? "text-sm" : "text-xl"}`}
        >
          VNS - Admin
        </span>
        <span
          className={`text-nowrap text-base text-text-muted ${variant === "small" ? "text-xs" : "text-base"}`}
        >
          Seu gerenciador de vendas
        </span>
      </div>
    </div>
  );
};
