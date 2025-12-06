import { z } from 'zod';

export const SignupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
      .trim(),
    email: z.string().email({ message: 'Email inválido' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
      .trim(),
    confirmPassword: z
      .string()
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export type signUpSchema = z.infer<typeof SignupFormSchema>;

export type SignUpFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export const SignInFormSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }).trim(),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
  keepConnected: z.boolean().optional(),
});

export type signInSchema = z.infer<typeof SignInFormSchema>;

export type SignInFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const resetPasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
    .trim(),
});

export type resetPasswordSchema = z.infer<typeof resetPasswordFormSchema>;
