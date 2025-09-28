"use server";

import type { OAuthProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma/client";
import { createSession, deleteSession } from "@/lib/session";
import {
  SignInFormSchema,
  type SignInFormState,
  type SignUpFormState,
  SignupFormSchema,
  type signInSchema,
  type signUpSchema,
} from "@/lib/validations/auth/sign-up";
import {
  findUserByCredentials,
  findUserByEmail,
  getOAuthClient,
  hasheAndSaltPassword,
} from "@/utils";

export async function signUp(_: SignUpFormState, formData: signUpSchema) {
  const validatedFields = SignupFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  const userAlreadyExists = await findUserByEmail(email);

  if (userAlreadyExists) {
    return {
      message: "Uma conta já existe com esse email",
    };
  }

  const hashedPassword = await hasheAndSaltPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) {
    return {
      message: "Erro ao cadastrar usuário",
    };
  }

  await createSession(user.id);
  redirect("/");
}

export async function signIn(_: SignInFormState, formData: signInSchema) {
  const validatedFields = SignInFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, keepConnected } = validatedFields.data;

  const user = await findUserByCredentials(email, password);

  if (!user) {
    return {
      message: "Usuário ou senhas inválidos",
    };
  }

  await createSession(user.id, keepConnected);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/sign-in");
}

export async function oAuthSignIn(provider: OAuthProvider) {
  const oAuthClient = getOAuthClient(provider);
  redirect(oAuthClient.createAuthUrl(await cookies()));
}
