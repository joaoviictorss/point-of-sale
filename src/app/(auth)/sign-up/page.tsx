'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import Image from 'next/image';
import Link from 'next/link';
import { startTransition, use, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { signUp } from '@/actions';
import { oAuthSignIn } from '@/actions/auth';
import { GoogleIcon } from '@/assets';
import { Input, Logo } from '@/components';
import { Button } from '@/components/Shadcn';
import {
  SignupFormSchema,
  type signUpSchema,
} from '@/lib/validations/auth/sign-up';

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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: signUpSchema) => {
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
      toast.error('Erro ao fazer login com Google. Tente novamente.');
    }
  }, [oauthError]);

  return (
    <main className="flex h-screen items-center p-3">
      <div className="flex w-full flex-col items-center justify-center ">
        <div className="flex w-full max-w-[420px] flex-col px-4 sm:px-0">
          <div className="flex w-full flex-col gap-8 md:gap-12">
            <Logo />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-4xl ">Cadastrar-se</h3>
                <p className="text-text-muted">
                  Seja bem vindo! vamos criar sua conta.
                </p>
              </div>

              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  id="email"
                  label="Email"
                  placeholder="Insira seu email"
                  {...register('email')}
                  error={errors.email?.message || state?.errors?.email?.[0]}
                  required
                />

                <Input
                  id="name"
                  label="Nome de usuario"
                  placeholder="Insira seu nome"
                  {...register('name')}
                  error={errors.name?.message || state?.errors?.name?.[0]}
                  required
                />

                <Input
                  id="password"
                  label="Senha"
                  placeholder="Insira sua senha"
                  type="password"
                  {...register('password')}
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
                  {...register('confirmPassword')}
                  error={
                    errors.confirmPassword?.message ||
                    state?.errors?.confirmPassword?.[0]
                  }
                  required
                />

                <Button disabled={isPending} size={'lg'} type="submit">
                  {isPending ? 'Criando conta...' : 'Criar conta'}
                </Button>

                <Button
                  onClick={async () => {
                    await oAuthSignIn('GOOGLE');
                  }}
                  size={'lg'}
                  type="button"
                  variant={'outline'}
                >
                  <GoogleIcon />
                  Acessar com google
                </Button>

                <div className="flex items-center justify-center gap-1">
                  <span className="text-text-muted">Ja tem uma conta? </span>
                  <Link className="text-primary" href={'/sign-in'}>
                    Acesse aqui
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden h-full w-full lg:block">
        <Image
          alt="Hero Login"
          className="rounded-lg object-cover"
          fill
          src={'/hero-login.png'}
        />
      </div>
    </main>
  );
};

export default SignUp;
