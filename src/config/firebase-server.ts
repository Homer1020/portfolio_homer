import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Lee la clave privada desde tus variables de entorno (.env)
const serviceAccount = JSON.parse(
  import.meta.env.FIREBASE_SERVICE_ACCOUNT || "{}"
);

export const activeApps = getApps();

// Evita inicializar múltiples veces la app durante el hot-reload de Astro
export const app = activeApps.length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : activeApps[0];

export const serverAuth = getAuth(app);