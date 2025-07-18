import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/", "/sales", "/stock", "/analytics"];
const publicRoutes = ["/sign-in", "/sign-up", "/reset-password"];
const authRoutes = ["/sign-in", "/sign-up", "/reset-password"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (path === "/" && session?.userId) {
    return NextResponse.redirect(new URL("/sales", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/sales", req.nextUrl));
  }

  if (isAuthRoute && !!session?.userId) {
    return NextResponse.redirect(new URL("/sales", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
