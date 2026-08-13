// src/pages/api/seed-experiences.ts
import type { APIRoute } from 'astro';
import { db } from '../../config/firebase';
import experiencesData from '../../data/experiences.json';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

export const GET: APIRoute = async () => {
  if (import.meta.env.PROD) {
    return new Response(
      JSON.stringify({ success: false, error: 'Ruta deshabilitada en producción.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const experiencesCollection = collection(db, 'experiences');
    const experiencesSnap = await getDocs(experiencesCollection);

    if (!experiencesSnap.empty) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'La colección "experiences" ya tiene datos, no se migró nada.',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const results: string[] = [];

    for (const experience of experiencesData) {
      await addDoc(experiencesCollection, {
        role: experience.role,
        business: experience.business,
        date: experience.date,
        description: experience.description ?? [],
        order: experience.order ?? 0,
        createdAt: serverTimestamp(),
      });

      results.push(`Migrado: ${experience.role} - ${experience.business}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Migración de experiencias completada exitosamente!',
        migratedExperiences: results,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error durante el seeding de experiencias:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido al poblar la base de datos',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
