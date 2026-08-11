// src/pages/api/auth/signin.ts
import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../config/firebase-server"; // Asegúrate de tener la configuración de Firebase Admin

export const POST: APIRoute = async ({ request, cookies }) => {
    const authHeader = request.headers.get("Authorization");

    const idToken = authHeader?.split("Bearer ")[1];

    if (!idToken) {
        return new Response("No token provided", { status: 401 });
    }

    try {
        // crear cookie válida por 5 días
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await getAuth(app).createSessionCookie(idToken, { expiresIn });

        // guardar cookie en la respuesta HTTP
        cookies.set("__session", sessionCookie, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: expiresIn / 1000,
        });

        return new Response(JSON.stringify({ status: "success" }), { status: 200 });
    } catch (error) {
        console.log({error})
        return new Response("Unauthorized", { status: 401 });
    }
};