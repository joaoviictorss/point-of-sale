"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { use } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  resetPasswordFormSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth/signUp";

import { Input, Logo } from "@/components";
import { Button } from "@/components/Shadcn";

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
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast.error("Erro ao redefinir senha");
      return;
    }
  };

  return (
    <main className="flex flex-col h-screen relative items-center justify-center p-6">
      <header className="flex items-center justify-end sm:justify-between  p-6 border-b border-border fixed top-0 w-full">
        <Link href={"/sign-in"} className="hidden sm:block">
          <Logo />
        </Link>

        <div className="flex items-center gap-3 ">
          <span className="text-text-muted hidden sm:block">Lembrou da sua senha?</span>
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              id="password"
              type="password"
              label="Nova senha"
              placeholder="Insira sua nova senha"
              error={errors.password?.message}
              {...register("password")}
              required
              disabled={isSubmitting}
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
