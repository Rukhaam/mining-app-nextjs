import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/auth-constants";
import { signJwt, verifyJwt } from "@/lib/jwt";

function getSessionExpiresAt() {
  return new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
}

export async function createSession(user) {
  const token = signJwt(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    SESSION_DURATION_SECONDS,
  );
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: getSessionExpiresAt(),
    path: "/",
  });
}

export async function getCurrentSession() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const session = verifyJwt(token);

  if (!session?.userId || session.role !== "admin") return null;

  return session;
}

export async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
}
