"use client";

import { useActionState, startTransition, useEffect, use } from "react";

import Image from "next/image";
import Link from "next/link";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signUp } from "@/actions";
import { GoogleIcon } from "@/assets";

import { Input, Logo } from "@/components";
import { Button } from "@/components/Shadcn";

import { SignupFormSchema, signUpSchema } from "@/lib/validations/auth/signUp";
import { oAuthSignIn } from "@/actions/auth";

const SignUp = ({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) => {
  const resolvedSearchParams = use(searchParams);
  const { oauthError } = resolvedSearchParams;

  const [state, action, isPending] = useActionState(signUp, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpSchema>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: signUpSchema) => {
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

  return (
    <main className="flex items-center p-3 h-screen">
      <div className="w-full flex items-center justify-center flex-col ">
        <div className="flex flex-col max-w-[420px] w-full px-4 sm:px-0">
          <div className="flex flex-col gap-8 md:gap-12 w-full">
            <Logo />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-4xl ">Cadastrar-se</h3>
                <p className="text-text-muted">
                  Seja bem vindo! vamos criar sua conta.
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
                  id="name"
                  label="Nome de usuario"
                  placeholder="Insira seu nome"
                  {...register("name")}
                  error={errors.name?.message || state?.errors?.name?.[0]}
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

                <Input
                  id="confirmPassword"
                  label="Confirmar senha"
                  placeholder="Insira a confirmação de sua senha"
                  type="password"
                  {...register("confirmPassword")}
                  error={
                    errors.confirmPassword?.message ||
                    state?.errors?.confirmPassword?.[0]
                  }
                  required
                />

                <Button size={"lg"} type="submit" disabled={isPending}>
                  {isPending ? "Criando conta..." : "Criar conta"}
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
                  <span className="text-text-muted">Ja tem uma conta? </span>
                  <Link href={"/sign-in"} className="text-primary">
                    Acesse aqui
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
    </main>
  );
};

export default SignUp;
