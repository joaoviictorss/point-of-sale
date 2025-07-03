import Image from "next/image";
import { ComponentProps } from "react";

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
        src="/logo.png"
        alt="Logo"
        width={60}
        height={60}
        priority
        quality={100}
      />

      <div className={`flex-col gap-0.5 transition-opacity ${showText ? "flex" : "hidden"}`}>
        <span
          className={`text-foreground font-semibold text-nowrap ${variant === "small" ? "text-sm" : "text-xl"}`}
        >
          VNS - Admin
        </span>
        <span
          className={`text-base text-text-muted text-nowrap ${variant === "small" ? "text-xs" : "text-base"}`}
        >
          Seu gerenciador de vendas
        </span>
      </div>
    </div>
  );
};
