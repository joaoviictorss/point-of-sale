"use client";

import { startTransition, useActionState, useEffect, use } from "react";

import Image from "next/image";
import Link from "next/link";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { GoogleIcon } from "@/assets";
import { toast } from "sonner";

import { oAuthSignIn, signIn } from "@/actions/auth";

import { SignInFormSchema, signInSchema } from "@/lib/validations/auth/signUp";

import { useDialog } from "@/hooks";

import { Checkbox, Input, Logo } from "@/components";
import { Button } from "@/components/Shadcn/button";
import { ResetPasswordModal } from "./components/reset-password-modal";

const SignIn = ({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) => {
  const resolvedSearchParams = use(searchParams);
  const { oauthError } = resolvedSearchParams;

  const [state, action, isPending] = useActionState(signIn, undefined);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<signInSchema>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      keepConnected: false,
    },
  });

  const onSubmit = async (data: signInSchema) => {
    startTransition(() => {
      action(data);
    });
  };

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (oauthError) {
      toast.error("Erro ao fazer login com Google. Tente novamente.");
    }
  }, [oauthError]);

  const resetPasswordDialog = useDialog();

  return (
    <main className="flex items-center p-3 h-screen">
      <div className="w-full flex items-center justify-center flex-col">
        <div className="flex flex-col max-w-[420px] w-full px-4 sm:px-0">
          <div className="flex flex-col gap-8 md:gap-12 sm:min-w-[420px] w-full">
            <Logo />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-4xl">Entrar</h3>
                <p className="text-text-muted">
                  Bem vindo de volta! Por favor insira suas credenciais
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <Input
                  id="email"
                  label="Email"
                  placeholder="Insira seu email"
                  {...register("email")}
                  error={errors.email?.message || state?.errors?.email?.[0]}
                  required
                />

                <Input
                  id="password"
                  label="Senha"
                  placeholder="Insira sua senha"
                  type="password"
                  {...register("password")}
                  error={
                    errors.password?.message || state?.errors?.password?.[0]
                  }
                  required
                />

                <div className="flex items-center justify-between sm:flex-row">
                  <Controller
                    name="keepConnected"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="keepConnected"
                        label="Permanecer conectado"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />

                  <span
                    className="text-primary hover:text-primary/90 transition-colors duration-75 text-sm cursor-pointer"
                    onClick={resetPasswordDialog.openDialog}
                  >
                    Esqueci minha senha
                  </span>
                </div>

                <Button size={"lg"} type="submit" disabled={isPending}>
                  {isPending ? "Entrando..." : "Entrar"}
                </Button>

                <Button
                  size={"lg"}
                  variant={"outline"}
                  type="button"
                  onClick={async () => {
                    await oAuthSignIn("GOOGLE");
                  }}
                >
                  <GoogleIcon />
                  Acessar com google
                </Button>

                <div className="flex items-center justify-center gap-1">
                  <span className="text-text-muted">
                    Ainda não tem uma conta?
                  </span>
                  <Link href={"/sign-up"} className="text-primary">
                    Cadastre-se
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full relative h-full hidden lg:block">
        <Image
          src={"/hero-login.png"}
          alt="Hero Login"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <ResetPasswordModal
        dialog={resetPasswordDialog}
        email={getValues("email")}
      />
    </main>
  );
};

export default SignIn;
