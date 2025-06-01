import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center gap-5">
      <Image src="/logo.png" alt="Logo" width={60} height={60} priority />

      <div className="flex flex-col gap-0.5">
        <span className="text-foreground font-semibold text-xl">
          VNS - Admin
        </span>
        <span className="text-base text-text-muted">
          Seu gerenciador de vendas
        </span>
      </div>
    </div>
  );
};
