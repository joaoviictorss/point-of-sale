'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import Image from 'next/image';
import Link from 'next/link';
import { startTransition, use, useActionState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { oAuthSignIn, signIn } from '@/actions/auth';
import { GoogleIcon } from '@/assets';
import { Checkbox, Input, Logo } from '@/components';
import { Button } from '@/components/Shadcn/button';
import { useDialog } from '@/hooks';
import {
  SignInFormSchema,
  type signInSchema,
} from '@/lib/validations/auth/sign-up';
import { ResetPasswordModal } from './components/reset-password-modal';

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
      email: '',
      password: '',
      keepConnected: false,
    },
  });

  const onSubmit = (data: signInSchema) => {
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

  const resetPasswordDialog = useDialog();

  return (
    <main className="flex h-screen items-center p-3">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[420px] flex-col px-4 sm:px-0">
          <div className="flex w-full flex-col gap-8 sm:min-w-[420px] md:gap-12">
            <Logo />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-4xl">Entrar</h3>
                <p className="text-text-muted">
                  Bem vindo de volta! Por favor insira suas credenciais
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

                <div className="flex items-center justify-between sm:flex-row">
                  <Controller
                    control={control}
                    name="keepConnected"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        id="keepConnected"
                        label="Permanecer conectado"
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />

                  <Button
                    asChild
                    className="hover:no-underline"
                    onClick={resetPasswordDialog.openDialog}
                    variant={'link'}
                  >
                    <span className="cursor-pointer text-primary text-sm transition-colors duration-75 hover:text-primary/90">
                      Esqueci minha senha
                    </span>
                  </Button>
                </div>

                <Button disabled={isPending} size={'lg'} type="submit">
                  {isPending ? 'Entrando...' : 'Entrar'}
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
                  <span className="text-text-muted">
                    Ainda não tem uma conta?
                  </span>
                  <Link className="text-primary" href={'/sign-up'}>
                    Cadastre-se
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

      <ResetPasswordModal
        dialog={resetPasswordDialog}
        email={getValues('email')}
      />
    </main>
  );
};

export default SignIn;
