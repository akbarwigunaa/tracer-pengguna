"use server";

import { cookies } from "next/headers";

const SESSION_NAME = "admin_session";
const SESSION_VALUE = "authenticated";

export async function login(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get("password") as string;

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_NAME, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return { success: true };
  }

  return { error: "Password salah" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_NAME)?.value === SESSION_VALUE;
}
