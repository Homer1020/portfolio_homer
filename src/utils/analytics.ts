// src/lib/analytics.ts
import { db } from '../config/firebase';
import type { AstroGlobal } from 'astro';
import { collection, addDoc, getCountFromServer } from 'firebase/firestore';

export interface DatosVisita {
  ip: string;
  userAgent: string;
  referrer: string;
  pais: string;
  ruta: string;
}

export async function registrarVisita(Astro: AstroGlobal): Promise<{ totalVisits: number; datos: DatosVisita }> {
  // 1. Extraer datos de la petición HTTP
  const clientIP = 
    Astro.request.headers.get('x-forwarded-for')?.split(',')[0] || 
    Astro.request.headers.get('x-real-ip') || 
    'Desconocida';

  const userAgent = Astro.request.headers.get('user-agent') || 'Desconocido';
  const referrer = Astro.request.headers.get('referer') || 'Directo';
  const pais = Astro.request.headers.get('x-vercel-ip-country') || 
               Astro.request.headers.get('cf-ipcountry') || 
               'Desconocido';
  
  const ruta = Astro.url.pathname;

  const datosVisita: DatosVisita = {
    ip: clientIP,
    userAgent,
    referrer,
    pais,
    ruta
  };

  let totalVisits = 0;

  try {
    const analyticsRef = collection(db, 'analytics');
    // 2. Guardar el documento de la visita con la fecha del servidor
    await addDoc(analyticsRef, {
        ...datosVisita,
        fecha: new Date()
    });

    // 3. Obtener el total acumulado de visitas
    const snapshot = await getCountFromServer(analyticsRef);
    totalVisits = snapshot.data().count;
  } catch (error) {
    console.error('Error en helper registrarVisita:', error);
  }

  return {
    totalVisits,
    datos: datosVisita
  };
}