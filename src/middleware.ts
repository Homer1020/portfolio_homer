// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { getAuth } from "firebase-admin/auth";
import { app } from "./config/firebase-server"; // Tu app de firebase-admin instanciada

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // 1. Definir qué rutas queremos privatizar
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isLoginPage = url.pathname === "/admin/login";

  // Si no es una ruta administrativa, dejamos pasar la petición
  if (!isAdminRoute) {
    return next();
  }

  // 2. Obtener la cookie de sesión creada durante el login
  const sessionCookie = cookies.get("__session")?.value;

  // Si intenta entrar a /admin (y no es la página de login) sin cookie -> Redirigir al login
  if (!sessionCookie && !isLoginPage) {
    return redirect("/admin/login");
  }

  // 3. Validar la cookie con Firebase Admin SDK si existe
  if (sessionCookie) {
    try {
      const auth = getAuth(app);
      // verifySessionCookie valida firma, expiración y revoked tokens
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

      // (Opcional) Guardar datos del usuario en locals para usarlos en tus páginas .astro
      context.locals.user = decodedClaims;

      // Si el usuario ya está autenticado e intenta ir al /admin/login, redirigir al panel principal
      if (isLoginPage) {
        return redirect("/admin");
      }
    } catch (error) {
      // Cookie inválida o expirada -> Borrar cookie y enviar a login
      cookies.delete("__session", { path: "/" });
      if (!isLoginPage) {
        return redirect("/admin/login");
      }
    }
  }

  return next();
});