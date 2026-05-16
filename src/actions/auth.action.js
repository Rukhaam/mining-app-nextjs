"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";

export async function loginAction(_state, formData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Enter both username and password." };
  }

  let user;

  try {
    [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Could not verify credentials right now." };
  }

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Invalid username or password." };
  }

  await createSession(user);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
