"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input, Logo } from "@/components";
import { Button } from "@/components/Shadcn";
import {
  resetPasswordFormSchema,
  type resetPasswordSchema,
} from "@/lib/validations/auth/sign-up";

import { resetPassword } from "@/services/reset-password";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

const ResetPassword = ({ searchParams }: PageProps) => {
  const resolvedSearchParams = use(searchParams);
  const token = resolvedSearchParams.token;

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<resetPasswordSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: resetPasswordSchema) => {
    if (!token) {
      toast.error("Token inválido");
      return;
    }

    try {
      await resetPassword(data.password, token);

      toast.success("Senha redefinida com sucesso");
      router.push("/sign-in");
    } catch {
      toast.error("Erro ao redefinir senha");
      return;
    }
  };

  return (
    <main className="relative flex h-screen flex-col items-center justify-center p-4">
      <header className="fixed top-0 flex w-full items-center justify-end border-border border-b p-4 sm:justify-between">
        <Link className="hidden sm:block" href={"/sign-in"}>
          <Logo />
        </Link>

        <div className="flex items-center gap-3 ">
          <span className="hidden text-text-muted sm:block">
            Lembrou da sua senha?
          </span>
          <Button asChild>
            <a href={"/sign-in"}>Entrar</a>
          </Button>
        </div>
      </header>

      <section className="w-full md:w-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-4xl">Redefinir senha</h3>
            <p className="text-text-muted">
              Por favor insira sua nova senha de acesso!
            </p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              error={errors.password?.message}
              id="password"
              label="Nova senha"
              placeholder="Insira sua nova senha"
              type="password"
              {...register("password")}
              disabled={isSubmitting}
              required
            />

            <Button disabled={isSubmitting}>
              {isSubmitting ? "Alterando..." : "Alterar senha"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
