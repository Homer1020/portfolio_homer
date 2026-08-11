// src/pages/api/auth/signout.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Eliminar la cookie del navegador
  cookies.delete("__session", { path: "/" });

  return redirect("/admin/login");
};
