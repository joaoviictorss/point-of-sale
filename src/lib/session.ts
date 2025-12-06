import 'server-only';
// Garante que este código seja executado apenas no servidor, protegendo o SESSION_SECRET
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
// Converte a string SESSION_SECRET da variável de ambiente para um formato utilizável pela biblioteca jose

const cookie = {
  name: 'session',
  options: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  },
  duration: 24 * 60 * 60 * 1000, // 24 horas
} as const;

export function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, keepConnected = false) {
  const duration = keepConnected
    ? 60 * 60 * 24 * 15 * 1000 // 15 dias
    : cookie.duration;

  const expires = new Date(Date.now() + duration);
  const session = await encrypt({ userId, expires });
  const cookieStore = await cookies();

  cookieStore.set(cookie.name, session, {
    ...cookie.options,
    expires,
    maxAge: duration / 1000, // em segundos
  });
}

export async function updateSession() {
  const session = (await cookies()).get(cookie.name)?.value;
  const payload = await decrypt(session);

  if (!(session && payload)) {
    return null;
  }

  const expires = new Date(Date.now() + cookie.duration);
  const cookieStore = await cookies();
  cookieStore.set(cookie.name, session, { ...cookie.options, expires });
}

export async function verifySession() {
  const cookieData = (await cookies()).get(cookie.name)?.value;
  const session = await decrypt(cookieData);
  if (!session) {
    redirect('/sign-in');
  }

  return { isAuth: true, userId: session.userId as string };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookie.name);
}
