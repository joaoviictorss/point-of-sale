"use server";

import {
  SignInFormSchema,
  SignInFormState,
  signInSchema,
  SignupFormSchema,
  SignUpFormState,
  signUpSchema,
} from "@/lib/validations/auth/signUp";
import { prisma } from "@/lib/prisma/client";
import { findUserByCredentials, findUserByEmail } from "@/lib/prisma/user";
import { createSession, deleteSession } from "@/lib/session";
import { hasheAndSaltPassword } from "@/utils/password";
import { redirect } from "next/navigation";
import { OAuthProvider } from "@prisma/client";
import { getOAuthClient } from "@/utils/oAuth";
import { cookies } from "next/headers";

export async function signUp(state: SignUpFormState, formData: signUpSchema) {
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

export async function signIn(state: SignInFormState, formData: signInSchema) {
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
